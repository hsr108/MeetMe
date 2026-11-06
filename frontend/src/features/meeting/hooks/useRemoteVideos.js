import { useCallback, useState } from "react";

// List of { socketId, stream } for remote participants, in arrival order.
export const useRemoteVideos = () => {
  const [remoteVideos, setRemoteVideos] = useState([]);
  // { socketId: display name }, refreshed from every user-joined event.
  const [participantNames, setParticipantNames] = useState({});

  // ontrack fires once per track, so skip the update when the stream is unchanged.
  const upsertRemoteStream = useCallback((socketId, stream) => {
    setRemoteVideos((prev) => {
      const existing = prev.find((video) => video.socketId === socketId);
      if (!existing) return [...prev, { socketId, stream }];
      if (existing.stream === stream) return prev;
      return prev.map((video) => (video.socketId === socketId ? { ...video, stream } : video));
    });
  }, []);

  const removeRemoteVideo = useCallback((socketId) => {
    setRemoteVideos((prev) => prev.filter((video) => video.socketId !== socketId));
  }, []);

  const clearRemoteVideos = useCallback(() => setRemoteVideos([]), []);

  return {
    remoteVideos,
    participantNames,
    setParticipantNames,
    upsertRemoteStream,
    removeRemoteVideo,
    clearRemoteVideos,
  };
};
