import axios from 'axios';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  async handleUserMessage(message) {
    try {
      const response = await axios.post('http://localhost:8000/chat', { message });
      const botMessage = this.createChatBotMessage(response.data.reply);
      this.addMessageToState(botMessage);
    } catch {
      const errorMessage = this.createChatBotMessage("Sorry, something went wrong. Try again later.");
      this.addMessageToState(errorMessage);
    }
  }

  addMessageToState(message) {
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message]
    }));
  }
}

export default ActionProvider;
