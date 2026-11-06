import styles from "../styles/chatPanel.module.css";
import ChatMessageList from "./ChatMessageList.jsx";
import ChatComposer from "./ChatComposer.jsx";

function ChatPanel({ chat, onClose }) {
  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatHeader}>
        <h3>Chat</h3>
        <button className={styles.chatHeaderCloseBtn} onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <ChatMessageList messages={chat.messages} />
      <ChatComposer chat={chat} />
    </div>
  );
}

export default ChatPanel;
