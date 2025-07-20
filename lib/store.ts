export interface Message {
  id: string;
  room: string;
  user: string;
  text: string;
  timestamp: number;
}

class MessageStore {
  private messages: Message[] = [];

  private purge() {
    const cutoff = Date.now() - 60_000;
    this.messages = this.messages.filter(m => m.timestamp > cutoff);
  }

  all(room: string) {
    this.purge();
    return this.messages.filter(m => m.room === room);
  }

  add(msg: Message) {
    this.purge();
    this.messages.push(msg);
  }
}

const store = new MessageStore();
export default store;
