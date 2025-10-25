// services/PeerService.js
class PeerService {
  constructor() {
    this.peer = null;
  }

  // 1️⃣ create the peer once, immediately
  getPeer() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          { urls: ["stun:stun.l.google.com:19302"] },
          { urls: "turn:your-turn-server.com:3478", username: "user", credential: "pass" }
        ]
      });
    }
    return this.peer;
  }

  // 2️⃣ add local tracks BEFORE creating offer
  async createOffer(localStream) {
    const pc = this.getPeer();

    // add every track from local stream
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // return plain object for signalling
    return offer;
  }

  // 3️⃣ add local tracks, then create answer
  async createAnswer(offer, localStream) {
    const pc = this.getPeer();

    // set remote offer first
    await pc.setRemoteDescription(offer);

    // add local tracks
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    return answer;
  }

  // 4️⃣ set remote answer
  async setRemoteDescription(desc) {
    const pc = this.getPeer();
    await pc.setRemoteDescription(desc);
  }

  // utilities -------------------------------------------------
  addIceCandidate(candidate) {
    this.getPeer().addIceCandidate(candidate);
  }

  onIceCandidate(cb) {
    this.getPeer().onicecandidate = cb;
  }

  onTrack(cb) {
    this.getPeer().ontrack = cb;
  }

  close() {
    if (this.peer) {
      this.peer.close();
      this.peer = null;
    }
  }
}

export default new PeerService();
