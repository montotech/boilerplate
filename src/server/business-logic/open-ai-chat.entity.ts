import { ChatOpenAI } from "langchain/chat_models/openai";
import { env } from "@/env.mjs";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";
import { BufferWindowMemory, ChatMessageHistory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import {
  type ValidationSchemaForMessage,
  type ValidationSchemaForCreateChatCompletion,
} from "@/server/api/validation-schemas/open-ai-chat-completion.schema";
import { TRPCError } from "@trpc/server";

export class OpenAiChatEntity {
  private static readonly DEFAULT_MODEL_PARAMS = {
    temperature: 0.9,
    openAIApiKey: env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    // verbose: true,
  };

  async call(
    params: ValidationSchemaForCreateChatCompletion
  ): Promise<ValidationSchemaForMessage> {
    const { message, messageHistory } = params;

    const memory = new BufferWindowMemory({
      k: 10,
      chatHistory: new ChatMessageHistory(
        this.buildChatHistory(messageHistory)
      ),
    });

    const model = new ChatOpenAI(OpenAiChatEntity.DEFAULT_MODEL_PARAMS);
    const chain = new ConversationChain({ llm: model, memory });

    const chainResponse = await chain.call({
      input: message,
    });

    if (!chainResponse.response || typeof chainResponse.response !== "string") {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Invalid response format from OpenAI.",
      });
    }

    return {
      message: chainResponse.response,
    };
  }

  private buildChatHistory(
    messageHistory: ValidationSchemaForCreateChatCompletion["messageHistory"]
  ) {
    return messageHistory.map((historyMessage) => {
      return historyMessage.type === "ai"
        ? new AIChatMessage(historyMessage.text)
        : new HumanChatMessage(historyMessage.text);
    });
  }
}
