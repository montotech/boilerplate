import { autoAdjustHeightOfTextarea } from "@/components/ai-chat/utils/auto-adjust-textarea-height";
import { scrollToBottom } from "@/components/ai-chat/utils/scroll-to-bottom";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useZodForm } from "@/hooks/use-zod-form";
import { handlePromise } from "@/lib/utils";
import {
  validationSchemaForMessage,
  type ValidationSchemaForCreateChatCompletion,
  type ValidationSchemaForMessage,
} from "@/server/api/validation-schemas/open-ai-chat-completion.schema";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  AIChatMessage,
  HumanChatMessage,
  type StoredMessage,
} from "langchain/schema";
import { Loader2, Send } from "lucide-react";
import { useRef, useState, type KeyboardEvent, useEffect } from "react";

const ChatPage = () => {
  const messagesContainerRef = useRef<HTMLElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useZodForm({ schema: validationSchemaForMessage });
  const { ref: formMessageRef, ...registerFormMessage } =
    form.register("message");

  const message = form.watch("message");

  useEffect(() => {
    autoAdjustHeightOfTextarea(textareaRef);
  }, [message, textareaRef]);

  const { messageHistory, onSubmitMessage, onReceiveMessage } =
    useChatMessages();

  const chatCompletionMutation = useMutation(submitChatMessage, {
    onSuccess: (data) => {
      onReceiveMessage(data.message);
      scrollToBottom(messagesContainerRef, 100).catch(console.error);
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Error! Please try again later.",
      });
    },
  });

  const onSubmit = (data: ValidationSchemaForMessage) => {
    const paramsForRequest: ValidationSchemaForCreateChatCompletion = {
      ...data,
      messageHistory,
    };

    form.setValue("message", "");
    onSubmitMessage(data.message);
    scrollToBottom(messagesContainerRef, 100).catch(console.error);
    chatCompletionMutation.mutate(paramsForRequest);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Layout noPadding fullScreenOnMobile>
      <div className="flex h-full flex-col justify-between">
        <main className="h-full overflow-scroll" ref={messagesContainerRef}>
          <div className="px-3 md:px-12">
            {messageHistory.map((message, index) => (
              <div
                key={`message-${index}`}
                className="flex w-full border-b border-b-slate-100 py-4"
              >
                <div className="w-20 font-semibold">{message.type}:</div>
                <div className="flex-1">{message.text}</div>
              </div>
            ))}
          </div>
        </main>
        <div className="px-3 md:px-12">
          <form onSubmit={handlePromise(form.handleSubmit(onSubmit))}>
            <div className="flex gap-x-2 py-2">
              <Textarea
                className="h-auto resize-none overflow-hidden px-2 py-2"
                onKeyDown={onKeyDown}
                rows={1}
                {...registerFormMessage}
                placeholder="Send a message"
                name="message"
                ref={(htmlElement) => {
                  formMessageRef(htmlElement);
                  textareaRef.current = htmlElement;
                }}
              />
              <Button
                type="submit"
                variant="secondary"
                disabled={
                  chatCompletionMutation.isLoading || !form.formState.isValid
                }
              >
                {chatCompletionMutation.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

const submitChatMessage = async (
  params: ValidationSchemaForCreateChatCompletion
) => {
  const response = await axios.post<ValidationSchemaForMessage>(
    "/api/openai-chat-completion/create",
    params
  );

  return validationSchemaForMessage.parse(response.data);
};

const useChatMessages = () => {
  const [messageHistory, setMessageHistory] = useState<
    ValidationSchemaForCreateChatCompletion["messageHistory"]
  >([]);

  const addMessageToHistory = (message: StoredMessage) => {
    setMessageHistory((previousMessages) => [
      ...previousMessages,
      { type: message.type, text: message.data.content },
    ]);
  };

  const onSubmitMessage = (message: string) => {
    const questionMessage = new HumanChatMessage(message).toJSON();
    addMessageToHistory(questionMessage);
  };

  const onReceiveMessage = (message: string) => {
    const answerMessage = new AIChatMessage(message).toJSON();
    addMessageToHistory(answerMessage);
  };

  return {
    messageHistory,
    onSubmitMessage,
    onReceiveMessage,
  };
};

export default ChatPage;
