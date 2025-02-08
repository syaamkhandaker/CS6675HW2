"use client";

import { PeerMethods } from "@/utils/peer";
import { useEffect, useState } from "react";
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
  const [files, setFiles] = useState<any>();
  const [tempPeerId, setTempPeerId] = useState<string>("");
  const [peerId, setPeerId] = useState<string>("");
  const [connectId, setConnectId] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [connectionMap, setConnectionMap] = useState<{
    [key: string]: DataConnection;
  }>({});

  const handlePeerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempPeerId(e.target.value);
  };

  const handleLogin = async () => {
    setPeerId(tempPeerId);
    const response = await PeerMethods.startServer(tempPeerId);
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
    setConnectionMap({ ...connectionMap, ...PeerMethods.getConnectionMap() });
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

  const queryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleQueryData = () => {
    var data = {
      keyword: query,
      sender: peerId,
    };
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
                  <FileUpload files={files} setFiles={setFiles} />
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
              </div>
            );
          })}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
