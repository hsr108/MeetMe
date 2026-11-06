import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createPeerMesh } from "../src/features/meeting/webrtc/peerMesh.js";

// Minimal WebRTC fakes: enough surface for peerMesh/peerConnection.
class FakePeerConnection {
  static instances = [];
  constructor() {
    this.senders = [];
    this.closed = false;
    this.offers = 0;
    FakePeerConnection.instances.push(this);
  }
  getSenders() { return this.senders; }
  removeTrack(sender) { this.senders = this.senders.filter((s) => s !== sender); }
  addTrack(track) { this.senders.push({ track }); }
  async createOffer() { this.offers += 1; return { type: "offer", sdp: "o" }; }
  async createAnswer() { return { type: "answer", sdp: "a" }; }
  async setLocalDescription(d) { this.localDescription = d; }
  async setRemoteDescription(d) { this.remoteDescription = d; }
  async addIceCandidate(c) { this.candidate = c; }
  close() { this.closed = true; }
}

const fakeStream = () => {
  const tracks = [{ stopped: false, stop() { this.stopped = true; } }];
  return { tracks, getTracks: () => tracks };
};

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

let signals;
let mesh;

beforeEach(() => {
  globalThis.RTCPeerConnection = FakePeerConnection;
  globalThis.RTCSessionDescription = function (d) { return d; };
  globalThis.RTCIceCandidate = function (c) { return c; };
  FakePeerConnection.instances = [];
  signals = [];
  mesh = createPeerMesh({
    sendSignal: (to, payload) => signals.push([to, payload]),
    onRemoteStream: () => {},
  });
  mesh.setLocalStream(fakeStream(), { renegotiate: false });
});

test("addPeers skips self and existing peers", () => {
  mesh.addPeers(["me", "a"], "me");
  mesh.addPeers(["me", "a", "b"], "me");
  assert.equal(FakePeerConnection.instances.length, 2);
});

test("offerToAll sends one offer per peer", async () => {
  mesh.addPeers(["a", "b"], "me");
  mesh.offerToAll();
  await flush();
  assert.deepEqual(signals.map(([to]) => to).sort(), ["a", "b"]);
  assert.ok(signals.every(([, payload]) => payload.sdp.type === "offer"));
});

test("setLocalStream stops the previous stream and renegotiates", async () => {
  const first = fakeStream();
  mesh.setLocalStream(first, { renegotiate: false });
  mesh.addPeers(["a"], "me");
  mesh.setLocalStream(fakeStream());
  await flush();
  assert.equal(first.tracks[0].stopped, true);
  assert.equal(FakePeerConnection.instances[0].offers, 1);
});

test("an incoming offer is answered", async () => {
  mesh.addPeers(["a"], "me");
  mesh.handleSignal("a", JSON.stringify({ sdp: { type: "offer", sdp: "x" } }));
  await flush();
  assert.deepEqual(signals, [["a", { sdp: { type: "answer", sdp: "a" } }]]);
});

test("unknown peers and malformed signals are ignored", () => {
  mesh.handleSignal("ghost", JSON.stringify({ ice: {} }));
  mesh.addPeers(["a"], "me");
  mesh.handleSignal("a", "{not json");
  assert.equal(signals.length, 0);
});

test("removePeer and closeAll close connections", () => {
  mesh.addPeers(["a", "b"], "me");
  mesh.removePeer("a");
  assert.equal(FakePeerConnection.instances[0].closed, true);
  mesh.closeAll();
  assert.equal(FakePeerConnection.instances[1].closed, true);
  mesh.addPeers(["a"], "me");
  assert.equal(FakePeerConnection.instances.length, 3);
});
