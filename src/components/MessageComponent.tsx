type MessageComponentProps = {
  type: "login" | "connect" | "sendData";
  peerId?: string;
  connectId?: string;
  data?: any;
  error?: string;
};

export default function MessageComponent({
  type,
  peerId,
  connectId,
  data,
  error,
}: MessageComponentProps) {
  if (!error)
    return (
      <div className="text-green-400">
        {type === "login" && `You have logged in as peer id '${peerId}'`}
        {type === "connect" && `You have connected to peer id '${connectId}'`}
        {type === "sendData" &&
          `You have sent uploaded files to peer id '${connectId}'`}
      </div>
    );
  if (error) return <div className="text-red-400">{error}</div>;
}
