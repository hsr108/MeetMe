import { useCallback, useState } from "react";

// Chat messages, unread badge count, the draft being typed and the emoji drawer toggle.
export const useChat = ({ selfIdRef, sendChatMessage, username }) => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [draft, setDraft] = useState("");
  const [isEmojiDrawerOpen, setEmojiDrawerOpen] = useState(false);

  // The server echoes our own messages back, so this is the only place messages are added.
  const receiveMessage = useCallback(
    (data, sender, senderSocketId) => {
      const isSelf = senderSocketId === selfIdRef.current;
      setMessages((prev) => [...prev, { sender, data, isSelf }]);
      if (!isSelf) setUnreadCount((count) => count + 1);
    },
    [selfIdRef]
  );

  const sendMessage = () => {
    if (!draft.trim()) return;
    sendChatMessage(draft, username);
    setDraft("");
  };

  const appendEmoji = (emoji) => setDraft((prev) => prev + emoji);
  const resetUnread = () => setUnreadCount(0);
  const toggleEmojiDrawer = () => setEmojiDrawerOpen((open) => !open);

  return {
    messages,
    unreadCount,
    draft,
    setDraft,
    isEmojiDrawerOpen,
    receiveMessage,
    sendMessage,
    appendEmoji,
    resetUnread,
    toggleEmojiDrawer,
  };
};
