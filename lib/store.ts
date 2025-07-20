export interface Message {
  id: string;
  room: string;
  user: string;
  text: string;
  timestamp: number;
}

export interface TypingStatus {
  room: string;
  user: string;
  timestamp: number;
}

class MessageStore {
  private messages: Message[] = [];
  private typingUsers: TypingStatus[] = [];

  private purge() {
    const cutoff = Date.now() - 60_000;
    this.messages = this.messages.filter(m => m.timestamp > cutoff);
    
    // Purge typing status older than 5 seconds
    const typingCutoff = Date.now() - 5_000;
    this.typingUsers = this.typingUsers.filter(t => t.timestamp > typingCutoff);
  }

  all(room: string) {
    this.purge();
    return this.messages.filter(m => m.room === room);
  }

  add(msg: Message) {
    this.purge();
    this.messages.push(msg);
    
    // Remove typing status when a message is sent
    this.typingUsers = this.typingUsers.filter(
      t => !(t.room === msg.room && t.user === msg.user)
    );
  }
  
  setTyping(room: string, user: string) {
    this.purge();
    
    // Remove existing typing status for this user in this room
    this.typingUsers = this.typingUsers.filter(
      t => !(t.room === room && t.user === user)
    );
    
    // Add new typing status
    this.typingUsers.push({
      room,
      user,
      timestamp: Date.now()
    });
  }
  
  getTypingUsers(room: string, currentUser: string) {
    this.purge();
    return this.typingUsers
      .filter(t => t.room === room && t.user !== currentUser)
      .map(t => t.user);
  }
}

const store = new MessageStore();
export default store;
