import { PEER_CONNECTION_CONFIG } from "../constants.js";

// Helpers for a single RTCPeerConnection. `sendSignal(peerId, payload)` relays via the server.

export const createPeerConnection = (peerId, { sendSignal, onRemoteStream }) => {
  const pc = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
  pc.onicecandidate = (event) => {
    if (event.candidate) sendSignal(peerId, { ice: event.candidate });
  };
  pc.ontrack = (event) => onRemoteStream(peerId, event.streams[0]);
  return pc;
};

// Replaces every outgoing track with the tracks of `stream`. Caller must renegotiate.
export const syncLocalTracks = (pc, stream) => {
  pc.getSenders().forEach((sender) => {
    try {
      pc.removeTrack(sender);
    } catch (e) {
      console.log("Error removing track:", e);
    }
  });
  stream?.getTracks().forEach((track) => {
    try {
      pc.addTrack(track, stream);
    } catch (e) {
      console.log("Error adding track:", e);
    }
  });
};

export const sendOffer = async (pc, peerId, sendSignal) => {
  try {
    const description = await pc.createOffer();
    await pc.setLocalDescription(description);
    sendSignal(peerId, { sdp: pc.localDescription });
  } catch (e) {
    console.log("Creating offer failed:", e);
  }
};

const applySessionDescription = async (pc, peerId, sdp, sendSignal) => {
  try {
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    if (sdp.type !== "offer") return;
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    sendSignal(peerId, { sdp: pc.localDescription });
  } catch (e) {
    console.log("Applying remote description failed:", e);
  }
};

// signal is { sdp } (offer/answer) or { ice } (candidate).
export const applyRemoteSignal = (pc, peerId, signal, sendSignal) => {
  if (signal.sdp) applySessionDescription(pc, peerId, signal.sdp, sendSignal);
  if (signal.ice) {
    pc.addIceCandidate(new RTCIceCandidate(signal.ice)).catch((e) =>
      console.log("Adding ICE candidate failed:", e)
    );
  }
};
