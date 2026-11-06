import styles from "../styles/chatComposer.module.css";
import EmojiPicker from "./EmojiPicker.jsx";

function ChatComposer({ chat }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    chat.sendMessage();
  };

  return (
    <div className={styles.chatInputArea}>
      <EmojiPicker
        isDrawerOpen={chat.isEmojiDrawerOpen}
        onToggleDrawer={chat.toggleEmojiDrawer}
        onPick={chat.appendEmoji}
      />

      <form className={styles.chatInputRow} onSubmit={handleSubmit}>
        <div className={styles.textFieldContainer}>
          <input
            value={chat.draft}
            onChange={(e) => chat.setDraft(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
          />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatComposer;
