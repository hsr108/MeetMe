import { useCallback, useEffect, useRef, useState } from "react";
import { getInitialMediaPreferences } from "../../../utils/sessionPreferences.js";
import { useAuth } from "../../../hooks/useAuth.js";
import { useDisplayName } from "../../../hooks/useDisplayName.js";
import { ROUTES } from "../../../config/routes.js";
import { probeMediaAvailability, stopStream } from "../media/mediaStreams.js";
import { createPeerMesh } from "../webrtc/peerMesh.js";
import { useSignaling } from "./useSignaling.js";
import { useRemoteVideos } from "./useRemoteVideos.js";
import { useUserMedia } from "./useUserMedia.js";
import { useScreenShare } from "./useScreenShare.js";
import { useChat } from "./useChat.js";

const INITIAL_AVAILABILITY = { probed: false, video: false, audio: false, screen: false };

// Wires media, WebRTC mesh, signaling and chat together for VideoMeetPage.
export const useMeeting = () => {
  // Logged-in name when signed in, else the guest name (updates once the login check finishes).
  const username = useDisplayName();
  const { currentUser, isAuthReady } = useAuth();
  const [availability, setAvailability] = useState(INITIAL_AVAILABILITY);
  const localVideoRef = useRef(null);
  const isSharingRef = useRef(false); // true while the screen stream is being sent
  const handlersRef = useRef({});

  // Signaling starts after permissions were probed and the login check finished,
  // so the name sent with join-call is already the account name.
  const { selfIdRef, sendSignal, sendChatMessage } = useSignaling(
    availability.probed && isAuthReady,
    handlersRef
  );
  const remote = useRemoteVideos();
  const [mesh] = useState(() =>
    createPeerMesh({ sendSignal, onRemoteStream: remote.upsertRemoteStream })
  );

  const showLocal = useCallback((stream) => {
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
  }, []);

  const media = useUserMedia({ mesh, availability, showLocal, isSharingRef });
  const screenShare = useScreenShare({
    mesh,
    showLocal,
    restoreUserMedia: media.acquireUserMedia,
    isSharingRef,
  });
  const chat = useChat({ selfIdRef, sendChatMessage, username });
  const { setInitialMedia } = media;

  useEffect(() => {
    let cancelled = false;
    probeMediaAvailability().then((result) => {
      if (cancelled) return;
      const preferences = getInitialMediaPreferences();
      setAvailability({ ...result, probed: true });
      setInitialMedia(preferences.video && result.video, preferences.audio && result.audio);
    });
    return () => {
      cancelled = true;
    };
  }, [setInitialMedia]);

  useEffect(() => () => mesh.dispose(), [mesh]);

  useEffect(() => {
    handlersRef.current = {
      displayName: username,
      // After a reconnect our socket id changed, so every old peer connection is stale.
      onConnect: (previousId) => {
        if (!previousId) return;
        mesh.closeAll();
        remote.clearRemoteVideos();
      },
      onSignal: mesh.handleSignal,
      // The newcomer sends offers; existing members just prepare a connection for it.
      onUserJoined: (joinedId, members, names) => {
        remote.setParticipantNames(names ?? {});
        mesh.addPeers(members, selfIdRef.current);
        if (joinedId === selfIdRef.current) mesh.offerToAll();
      },
      onUserLeft: (socketId) => {
        mesh.removePeer(socketId);
        remote.removeRemoteVideo(socketId);
      },
      onChatMessage: chat.receiveMessage,
    };
  });

  // Full reload releases camera/mic and every peer connection. Signed-in users go back to
  // their home page (the auth cookie is still valid), guests to the landing page.
  const endCall = () => {
    stopStream(localVideoRef.current?.srcObject);
    window.location.href = currentUser ? ROUTES.home : ROUTES.landing;
  };

  return { username, availability, localVideoRef, remote, media, screenShare, chat, endCall };
};
