import { createChatHandler } from "../ai/chat-handler.mjs";

export default createChatHandler();

export const config = {
    path: "/api/chat",
    rateLimit: {
        windowLimit: 5,
        windowSize: 60,
        aggregateBy: ["ip", "domain"],
    },
};
