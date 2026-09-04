"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";

export default function Dashboard() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    }
  }, [router]);

  async function createOrJoinRoom() {
    setError("");
    const token = localStorage.getItem("token");
    if (!roomName.trim()) {
      setError("Enter a room name");
      return;
    }

    setLoading(true);
    try {
      // Try to join an existing room with this slug first.
      const existing = await axios.get(`${HTTP_BACKEND}/room/${roomName}`);
      if (existing.data.room) {
        router.push(`/canvas/${existing.data.room.id}`);
        return;
      }

      // Otherwise create a new room.
      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: roomName },
        { headers: { Authorization: token || "" } }
      );
      router.push(`/canvas/${res.data.roomId}`);
    } catch (e: any) {
      setError(
        e?.response?.data?.message || "Could not create or join that room."
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    router.push("/signin");
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Create or join a room</h1>
      <div className="flex gap-2">
        <input
          className="text-black rounded p-2"
          placeholder="Room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createOrJoinRoom()}
        />
        <button
          disabled={loading}
          className="bg-white text-black rounded px-4 disabled:opacity-50"
          onClick={createOrJoinRoom}
        >
          {loading ? "..." : "Go"}
        </button>
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button className="text-sm text-gray-400 underline" onClick={logout}>
        Log out
      </button>
    </div>
  );
}