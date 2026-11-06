import styles from "../styles/chatComposer.module.css";
import { QUICK_EMOJIS, DRAWER_EMOJIS } from "../constants.js";

function EmojiButtons({ emojis, className, onPick }) {
  return emojis.map((emoji) => (
    <button key={emoji} type="button" className={className} onClick={() => onPick(emoji)}>
      {emoji}
    </button>
  ));
}

// Quick-emoji row plus an expandable drawer with the full set.
function EmojiPicker({ isDrawerOpen, onToggleDrawer, onPick }) {
  return (
    <>
      <div className={styles.emojiTriggerRow}>
        <div className={styles.quickEmojiBar}>
          <EmojiButtons emojis={QUICK_EMOJIS} className={styles.quickEmojiBtn} onPick={onPick} />
        </div>
        <button type="button" className={styles.moreEmojiToggleBtn} onClick={onToggleDrawer}>
          {isDrawerOpen ? "Hide Emojis" : "More Emojis"}
        </button>
      </div>

      {isDrawerOpen && (
        <div className={styles.emojiDrawer}>
          <EmojiButtons emojis={DRAWER_EMOJIS} className={styles.drawerEmojiBtn} onPick={onPick} />
        </div>
      )}
    </>
  );
}

export default EmojiPicker;
