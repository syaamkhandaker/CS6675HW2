import Peer, { DataConnection } from "peerjs";
import { PEER_HOST, PEER_PATH, PEER_PORT } from "./common";

let peer: Peer | undefined;
let connectionMap: Record<string, DataConnection> = {};

const startServer = async (id: string): Promise<void> => {
  try {
    // we can specify the peer id so peerjs doesn't auto generate it
    peer = new Peer(id, { host: PEER_HOST, port: PEER_PORT, path: PEER_PATH });

    if (peer) {
      console.log("My peer ID is: " + peer.id);
      peer.on("open", (connId) => {
        console.log(`Server with id: ${connId}`);
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const connect = async (id: string): Promise<void> => {
  if (!peer) {
    throw new Error(`Peer (${id}) not initialized`);
  }

  if (id in connectionMap) {
    console.log(`Already connected to peer (${id})`);
    return;
  }

  try {
    const conn = peer.connect(id);

    if (conn) {
      connectionMap[id] = conn;
      conn.on("open", () => {
        console.log(`Connected to peer (${id})`);
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const sendData = (id: string, data: any): void => {
  if (!peer) {
    throw new Error("Peer not initialized");
  }
  if (!(id in connectionMap)) {
    throw new Error("Not connected to peer");
  }
  try {
    connectionMap[id].send(data);
  } catch (e) {
    console.log(e);
  }
};

export const PeerMethods = {
  startServer,
  connect,
  sendData,
};
