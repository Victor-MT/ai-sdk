import { InferUITools, TypedToolCall, TypedToolResult, UIMessage } from "ai";
import { githubProfile } from "./github-profile";
import { httpFetch } from "./http-fetch";

export type AIToolSet = TypedToolCall<typeof tools>
export type AIToolResult = TypedToolResult<typeof tools>

export type AIMessage = UIMessage<
  unknown,
  never,
  InferUITools<typeof tools>
>;

export const tools = {
    githubProfile,
    httpFetch
}