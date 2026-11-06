import { useState } from "react";
import layout from "../features/meeting/styles/meetingLayout.module.css";
import { useMeeting } from "../features/meeting/hooks/useMeeting.js";
import VideoGrid from "../features/meeting/components/VideoGrid.jsx";
import ChatPanel from "../features/meeting/components/ChatPanel.jsx";
import ControlBar from "../features/meeting/components/ControlBar.jsx";

// Meeting room at /:url. All media/WebRTC/signaling logic lives in useMeeting.
function VideoMeetPage() {
  const { username, availability, localVideoRef, remote, media, screenShare, chat, endCall } =
    useMeeting();
  // Chat starts closed; the chat button in the control bar opens it.
  const [isChatOpen, setChatOpen] = useState(false);

  const toggleChat = () => {
    setChatOpen((open) => !open);
    chat.resetUnread();
  };

  return (
    <div className={layout.meetVideoContainer}>
      <div className={layout.mainLayout}>
        <div className={layout.videoSection}>
          <VideoGrid
            localVideoRef={localVideoRef}
            username={username}
            videoOn={media.video || screenShare.screen}
            audioOn={media.audio}
            mirrorLocal={!screenShare.screen}
            remoteVideos={remote.remoteVideos}
            participantNames={remote.participantNames}
          />
        </div>

        {isChatOpen && <ChatPanel chat={chat} onClose={() => setChatOpen(false)} />}
      </div>

      <ControlBar
        media={media}
        screenShare={screenShare}
        canShareScreen={availability.screen}
        isChatOpen={isChatOpen}
        unreadCount={chat.unreadCount}
        onToggleChat={toggleChat}
        onEndCall={endCall}
      />
    </div>
  );
}

export default VideoMeetPage;
