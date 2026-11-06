import { createBlackSilenceStream, stopStream } from "../media/mediaStreams.js";
import {
  createPeerConnection,
  syncLocalTracks,
  sendOffer,
  applyRemoteSignal,
} from "./peerConnection.js";

// Full-mesh WebRTC: one RTCPeerConnection per remote participant, all sharing one local stream.
export const createPeerMesh = ({ sendSignal, onRemoteStream }) => {
  const peers = new Map(); // socketId -> RTCPeerConnection
  let localStream = null;

  const ensureLocalStream = () => {
    if (!localStream) localStream = createBlackSilenceStream();
    return localStream;
  };

  // Creates connections only for participants we are not connected to yet.
  const addPeers = (peerIds, selfId) => {
    peerIds.forEach((peerId) => {
      if (peerId === selfId || peers.has(peerId)) return;
      const pc = createPeerConnection(peerId, { sendSignal, onRemoteStream });
      syncLocalTracks(pc, ensureLocalStream());
      peers.set(peerId, pc);
    });
  };

  const offerToAll = () => {
    peers.forEach((pc, peerId) => sendOffer(pc, peerId, sendSignal));
  };

  // Swaps the outgoing stream (stopping the previous one) and optionally renegotiates.
  const setLocalStream = (stream, { renegotiate = true } = {}) => {
    if (localStream && localStream !== stream) stopStream(localStream);
    localStream = stream;
    if (!renegotiate) return;
    peers.forEach((pc, peerId) => {
      syncLocalTracks(pc, localStream);
      sendOffer(pc, peerId, sendSignal);
    });
  };

  const handleSignal = (fromId, rawMessage) => {
    const pc = peers.get(fromId);
    if (!pc) {
      console.warn("Ignoring signal from unknown peer:", fromId);
      return;
    }
    try {
      applyRemoteSignal(pc, fromId, JSON.parse(rawMessage), sendSignal);
    } catch (e) {
      console.log("Malformed signal:", e);
    }
  };

  const removePeer = (peerId) => {
    peers.get(peerId)?.close();
    peers.delete(peerId);
  };

  const closeAll = () => {
    peers.forEach((pc) => pc.close());
    peers.clear();
  };

  const dispose = () => {
    closeAll();
    stopStream(localStream);
    localStream = null;
  };

  return { setLocalStream, addPeers, offerToAll, handleSignal, removePeer, closeAll, dispose };
};
