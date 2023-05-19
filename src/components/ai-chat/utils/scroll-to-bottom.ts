import { wait } from "@/lib/utils";
import { type RefObject } from "react";

export async function scrollToBottom(
  ref: RefObject<HTMLElement>,
  waitMilliseconds?: number
) {
  if (waitMilliseconds) await wait(waitMilliseconds);

  const container = ref.current;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}
