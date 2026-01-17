// services/PeerService.js
class PeerService {
  constructor() {
    this.peer = null;
    this.candidateQueue = [];
    this.remoteDescriptionSet = false;
  }

  // 1️⃣ create the peer once, immediately
  getPeer() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: "turns:threadly.tech:5349?transport=tcp",
            username: "threadly",
            credential: "strongpassword123",
          },
          {
            urls: "turn:threadly.tech:3478?transport=udp",
            username: "threadly",
            credential: "strongpassword123",
          },
          { urls: "stun:stun.l.google.com:19302" },
        ],
      });
    }
    return this.peer;
  }

  // 2️⃣ add local tracks BEFORE creating offer
  // async createOffer(localStream) {
  //   const pc = this.getPeer();

  //   // add every track from local stream
  //   localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  //   const offer = await pc.createOffer();
  //   await pc.setLocalDescription(offer);

  //   // return plain object for signalling
  //   return offer;
  // }

  async createOffer(localStream) {
  const pc = this.getPeer();
  if (pc.getSenders().length === 0) {
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
  }
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  return offer;
}

  // 3️⃣ add local tracks, then create answer
  // async createAnswer(offer, localStream) {
  //   const pc = this.getPeer();

  //   // set remote offer first
  //   await pc.setRemoteDescription(offer);

  //   // add local tracks
  //   localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  //   const answer = await pc.createAnswer();
  //   await pc.setLocalDescription(answer);

  //   return answer;
  // }

  async createAnswer(offer, localStream) {
  const pc = this.getPeer();
  await pc.setRemoteDescription(offer);
  if (pc.getSenders().length === 0) {
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
  }
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  return answer;
}


  // 4️⃣ set remote answer
  // async setRemoteDescription(desc) {
  //   const pc = this.getPeer();
  //   await pc.setRemoteDescription(desc);
  // }

  async setRemoteDescription(desc) {
    const pc = this.getPeer();
    await pc.setRemoteDescription(desc);
    this.remoteDescriptionSet = true;

    // Add queued candidates
    this.candidateQueue.forEach(candidate => {
      pc.addIceCandidate(candidate);
    });
    this.candidateQueue = [];
  }

  // utilities -------------------------------------------------
  // addIceCandidate(candidate) {
  //   this.getPeer().addIceCandidate(candidate);
  // }

  async addIceCandidate(candidate) {
    const pc = this.getPeer();
    if (this.remoteDescriptionSet) {
      await pc.addIceCandidate(candidate);
    } else {
      this.candidateQueue.push(candidate);
    }
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
