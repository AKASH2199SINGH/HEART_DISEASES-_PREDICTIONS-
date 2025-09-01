import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  initialMessages: [createChatBotMessage("Hi! How can I help you with your heart health today?")],
  botName: "HeartBot",
};

export default config;
