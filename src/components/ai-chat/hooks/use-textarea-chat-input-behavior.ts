import { type RefObject, useEffect } from "react";

const useTextareaChatInputBehavior = (
  textareaRef: RefObject<HTMLTextAreaElement>,
  message: string
) => {
  useEffect(() => {
    const adjustHeightOfChatInput = () => {
      const MIN_HEIGHT = 40;
      const MAX_HEIGHT = 200;

      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = "auto";
      textarea.style.overflow = "hidden";

      const { scrollHeight } = textarea;

      if (scrollHeight > MIN_HEIGHT && scrollHeight < MAX_HEIGHT) {
        textarea.style.height = `${scrollHeight}px`;
      } else if (scrollHeight >= MAX_HEIGHT) {
        textarea.style.height = `${MAX_HEIGHT}px`;
        textarea.style.overflow = "auto";
        textarea.scrollTop = textarea.scrollHeight;
      }
    };

    adjustHeightOfChatInput();
  }, [message, textareaRef]);
};

export default useTextareaChatInputBehavior;
