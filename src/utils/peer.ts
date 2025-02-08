import Peer, { DataConnection } from "peerjs";
import { PEER_HOST, PEER_PATH, PEER_PORT } from "./common";
import { PeerResponse } from "./types";

let peer: Peer | undefined;
let connectionMap: Record<string, DataConnection> = {};

const startServer = async (id: string): Promise<PeerResponse> => {
  var response: PeerResponse = new PeerResponse(true, "");
  try {
    // we can specify the peer id so peerjs doesn't auto generate it
    peer = new Peer(id, { host: PEER_HOST, port: PEER_PORT, path: PEER_PATH });

    if (peer) {
      console.log("My peer ID is: " + peer.id);
      peer.on("open", (connId) => {
        console.log(`Server with id: ${connId}`);
      });
      response = {
        valid: true,
        message: `You have logged in as peer id '${peer.id}'`,
      };
    }
  } catch (e: any) {
    console.log(e);
    response = {
      valid: false,
      message: e.message,
    };
  }
  return response;
};

const connect = async (id: string): Promise<PeerResponse> => {
  var response: PeerResponse = new PeerResponse(true, "");

  if (!peer) {
    response = {
      valid: false,
      message: `Peer (${id}) not initialized`,
    };
    return response;
  }

  if (id in connectionMap) {
    response = {
      valid: false,
      message: `Already connected to peer (${id})`,
    };
    return response;
  }

  try {
    const conn = peer.connect(id);

    if (conn) {
      connectionMap[id] = conn;
      conn.on("open", () => {
        console.log(`Connected to peer (${id})`);
      });
      return {
        valid: true,
        message: `You have connected to peer id '${id}'`,
      };
    }
  } catch (e: any) {
    console.log(e);
    return {
      valid: false,
      message: e.message,
    };
  }
  return response;
};

const getConnectionMap = () => connectionMap;

export const PeerMethods = {
  startServer,
  connect,
  getConnectionMap,
};
