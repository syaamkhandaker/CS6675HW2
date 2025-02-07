import Peer from "peerjs";

let peer: Peer | undefined;
let connectionList: [];

const startServer = async (id: string): Promise<void> => {
  try {
    // we can specify the peer id so peerjs doesn't auto generate it
    peer = new Peer(id, { host: "localhost", port: 9000 });

    if (peer) {
      peer.on("open", (connId) => {
        console.log(`Server  with id: ${connId}`);
      });
    }
  } catch (e) {
    console.log(e);
  }
};
const connect = async (id: string): Promise<void> => {
  if (!peer) {
    throw new Error("Peer not initialized");
  }

  try {
    const conn = peer.connect(id);
    conn.on("open", () => {
      console.log("Connected to peer");
    });
  } catch (e) {
    console.log(e);
  }
};

export const PeerMethods = {
  startServer,
  connect,
};
