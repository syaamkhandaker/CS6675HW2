import Peer, { DataConnection } from "peerjs";
import { PEER_HOST, PEER_PATH, PEER_PORT } from "./common";
import { PeerResponse } from "./types";

let peer: Peer | undefined;
const connectionMap: Record<string, DataConnection> = {};

// starts the server for a single peer

const startServer = async (id: string): Promise<PeerResponse> => {
  let response: PeerResponse = new PeerResponse(true, "");
  try {
    // we can specify the peer id so peerjs doesn't auto generate it
    peer = new Peer(id, { host: PEER_HOST, port: PEER_PORT, path: PEER_PATH });

    if (peer) {
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

// connects to another peer using their id

const connect = async (id: string): Promise<PeerResponse> => {
  let response: PeerResponse = new PeerResponse(true, "");

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

const getPeer = () => peer;

const forwardFunction = async (data: any) => {
  const connectionMap = getConnectionMap();
  for (const key in connectionMap) {
    const conn = connectionMap[key];
    conn.send(data);
  }
};

// this is where peer logic is made

// checkIfFileExists checks to see if query from data is found within the file list of this peer
// if it is found, it returns the file object, otherwise it returns undefined
// forwardFunction is a function that is called when the file is not found
// this function is used to forward the query to other peers
const listenForData = (
  checkIfFileExists: (data: any) => File | undefined,
  setTimeTaken: (time: number) => void,
  setBlobURL: (url: string) => void,
  setResponseFileName: (name: string) => void
) => {
  if (!peer) {
    throw new Error("Peer not initialized");
  } else {
    peer.on("connection", (conn) => {
      conn.on("data", async (data: any) => {
        // once it receives data it comes here
        console.log(data);

        // if type of data is type query
        if (data.type === "query") {
          // if the file is found with this peer, then it returns it
          const file = checkIfFileExists(data);
          console.log("File:", file);
          if (!file) {
            // if file isn't found then it contacts other peers
            console.log("File not found, forwarding query");
            await forwardFunction(data);
          } else {
            console.log(`File found: ${file.name}`);

            const returnData = {
              type: "file",
              file: file,
              blob: URL.createObjectURL(file),
              startTimeStamp: data.startTimeStamp,
              sender: data.sender,
              keyword: data.keyword,
              endTimeStamp: new Date().getTime(),
            };
            const connnection = peer?.connect(data.sender);
            connnection?.on("open", () => {
              connnection?.send(returnData);
            });
          }
        } else if (data.type === "file") {
          console.log(
            `File received: ${data.file.name} in ${
              data.endTimeStamp - data.startTimeStamp
            }ms`
          );
          setTimeTaken(data.endTimeStamp - data.startTimeStamp);
          setBlobURL(data.blob);
          setResponseFileName(data.file.name);
        }
      });
    });
  }
};

export const PeerMethods = {
  startServer,
  connect,
  getConnectionMap,
  getPeer,
  listenForData,
};
