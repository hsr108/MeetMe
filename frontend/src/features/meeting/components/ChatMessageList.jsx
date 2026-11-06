import styles from "../styles/chatPanel.module.css";

const emptyStateStyle = { color: "rgba(255,255,255,0.45)", textAlign: "center", marginTop: "2rem" };

function ChatMessageList({ messages }) {
  return (
    <div className={styles.chattingDisplay}>
      {messages.length === 0 ? (
        <p style={emptyStateStyle}>No Messages Yet</p>
      ) : (
        messages.map((item, index) => (
          // Messages are append-only, so the index is a stable key.
          <div key={index} className={`${styles.messageBubble} ${item.isSelf ? styles.self : ""}`}>
            <span className={styles.messageSender}>{item.isSelf ? "You" : item.sender}</span>
            <div className={styles.messageContent}>{item.data}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default ChatMessageList;
