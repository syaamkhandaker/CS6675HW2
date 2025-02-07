"use client";

import { PeerMethods } from "@/utils/peer";
import { useEffect, useState } from "react";
import FileUpload from "@/components/FileUpload";
import MessageComponent from "@/components/MessageComponent";
import { Toaster, toaster } from "@/components/ui/toaster";

const InstructionBullets = [
  { text: "Enter your peer id" },
  { text: "Click on Login" },
  { text: "Enter another peer id to connect to" },
  { text: "Click on Connect" },
  { text: "Upload files to send" },
  { text: "Click on Send Data" },
];

export default function Home() {
  const [files, setFiles] = useState<any>();
  const [peerId, setPeerId] = useState<string>("");
  const [connectId, setConnectId] = useState<string>("");

  const handlePeerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeerId(e.target.value);
  };

  const handleLogin = () => {
    toaster.create({
      type: "success",
      title: `You have logged in as peer id '${peerId}'`,
    });
    PeerMethods.startServer(peerId);
  };

  const handleConnectIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectId(e.target.value);
  };

  const handleConnect = () => {
    toaster.create({
      type: "success",
      title: `You have connected to peer id '${connectId}'`,
    });
    PeerMethods.connect(connectId);
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    setData(e.target.value);
  };

  const handleSendData = () => {
    toaster.create({
      type: "success",
      title: `You have sent uploaded files to peer id '${connectId}'`,
    });
    PeerMethods.sendData(peerId, files);
  };

  const buttonStates = [
    { text: "Login", onClick: handleLogin, onChange: handlePeerIdChange },
    {
      text: "Connect",
      onClick: handleConnect,
      onChange: handleConnectIdChange,
    },
    { text: "Send Data", onClick: handleSendData, onChange: handleDataChange },
  ];

  useEffect(() => {
    const init = () => {};
    init();
  }, []);
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
        <div className="w-[80%] flex justify-between border-2 p-4 rounded-xl">
          {buttonStates.map((button, index) => {
            return (
              <div key={index} className="flex flex-col gap-y-4">
                <div className="text-2xl font-semibold ">{button.text}</div>
                {index !== 2 ? (
                  <input onChange={button.onChange} type="text" />
                ) : (
                  <FileUpload files={files} setFiles={setFiles} />
                )}
                <button
                  className="bg-blue-500 py-4 w-full text-white rounded-xl text-lg"
                  onClick={button.onClick}
                >
                  {button.text}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
