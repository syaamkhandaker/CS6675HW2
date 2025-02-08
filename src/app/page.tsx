"use client";

import { PeerMethods } from "@/utils/peer";
import { useEffect, useRef, useState } from "react";
import FileUpload from "@/components/FileUpload";
import { Toaster, toaster } from "@/components/ui/toaster";
import { DataConnection } from "peerjs";

const InstructionBullets = [
  { text: "Enter your peer id" },
  { text: "Click on Login button" },
  { text: "Enter another peer id to connect to" },
  { text: "Click on Connect button" },
  { text: "Upload files" },
  { text: "Click on Send Data button" },
  { text: "Query for data" },
  { text: "Click on Query Data button" },
];

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [tempPeerId, setTempPeerId] = useState<string>("");
  const [peerId, setPeerId] = useState<string>("");
  const [connectId, setConnectId] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [connectionMap, setConnectionMap] = useState<{
    [key: string]: DataConnection;
  }>({});
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [blobURL, setBlobURL] = useState<string>("");
  const [responseFileName, setResponseFileName] = useState<string>("");

  const checkIfFileExists = (data: any) => {
    const latestFiles = filesRef.current;
    console.log("Latest", latestFiles);
    for (let i = 0; i < latestFiles.length; i++) {
      console.log(latestFiles[i].name.split(".")[0], data.keyword);
      if (latestFiles[i].name.split(".")[0] === data.keyword) {
        return latestFiles[i];
      }
    }
    return undefined;
  };

  const handlePeerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempPeerId(e.target.value);
  };

  const handleLogin = async () => {
    setPeerId(tempPeerId);
    const response = await PeerMethods.startServer(tempPeerId);
    PeerMethods.listenForData(
      checkIfFileExists,
      handleForwardQueries,
      setTimeTaken,
      setBlobURL,
      setResponseFileName
    );

    if (response.valid) {
      toaster.create({
        type: "success",
        title: response.message,
      });
    } else {
      toaster.create({
        type: "error",
        title: response.message,
      });
    }
  };

  const handleConnectIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectId(e.target.value);
  };

  const handleConnect = async () => {
    const response = await PeerMethods.connect(connectId);

    if (response.valid) {
      setConnectionMap({ ...connectionMap, ...PeerMethods.getConnectionMap() });
      toaster.create({
        type: "success",
        title: response.message,
      });
    } else {
      toaster.create({
        type: "error",
        title: response.message,
      });
    }
  };

  const queryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleQueryData = () => {
    var data = {
      keyword: query,
      sender: peerId,
      type: "query",
      startTimeStamp: new Date().getTime(),
    };
    handleForwardQueries(data);
  };

  const handleForwardQueries = (data: any) => {
    Object.keys(connectionMap).forEach((conn: any) => {
      connectionMap[conn].send(data);
    });
  };

  const buttonStates = [
    { text: "Login", onClick: handleLogin, onChange: handlePeerIdChange },
    {
      text: "Connect",
      onClick: handleConnect,
      onChange: handleConnectIdChange,
    },
    { text: "Upload Data" },
    { text: "Query Data", onClick: handleQueryData, onChange: queryChange },
  ];

  const filesRef = useRef(files);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-y-6">
      <div className="text-5xl font-semibold mb-10">Peer to Peer System</div>
      <div>
        {InstructionBullets.map((bullet, index) => {
          return (
            <div key={index} className="flex items-center justify-center">
              <div className="text-2xl font-semibold">{index + 1}.</div>
              <div className="text-xl font-semibold ml-2">{bullet.text}</div>
            </div>
          );
        })}
      </div>
      <div className="w-full flex justify-center">
        <div className="w-[80%] justify-between border-2 rounded-xl grid grid-cols-2">
          {buttonStates.map((button, index) => {
            return (
              <div key={index} className="flex flex-col gap-y-4 p-4">
                <div className="text-2xl font-semibold ">{button.text}</div>
                {index !== 2 ? (
                  <>
                    <input onChange={button.onChange} type="text" />
                    <button
                      className="bg-blue-500 py-4 w-full text-white rounded-xl text-lg"
                      onClick={button.onClick}
                    >
                      {button.text}
                    </button>
                  </>
                ) : (
                  <FileUpload setFiles={setFiles} />
                )}
                {peerId !== "" && index === 0 && (
                  <div>Logged in as {peerId}</div>
                )}
                {index === 1 && (
                  <div>
                    {Object.keys(connectionMap).map((el, idx) => {
                      return <div key={idx}>Connected to {el}</div>;
                    })}
                  </div>
                )}
                {index === 3 && timeTaken > 0 && blobURL !== "" && (
                  <>
                    <div
                      className="underline cursor-pointer"
                      onClick={() => {
                        window.open(blobURL, "_blank");
                      }}
                    >
                      Open File
                    </div>
                    <div className="font-semibold text-lg">
                      It took {timeTaken}ms to retrieve this file
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
