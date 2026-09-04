"use client";

import { WS_URL } from "@/config";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<"connecting" | "no-token" | "error">(
    "connecting"
  );
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("no-token");
      router.push("/signin");
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };

    ws.onerror = () => {
      setStatus("error");
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.send(JSON.stringify({ type: "leave_room", roomId }));
      ws.close();
    };
  }, [roomId, router]);

  if (!socket) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
        {status === "error"
          ? "Could not connect to the server. Is ws-backend running?"
          : "Connecting to server..."}
      </div>
    );
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}