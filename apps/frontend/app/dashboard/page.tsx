"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, LogOut, Clock, Sparkles } from "lucide-react";
import { HTTP_BACKEND } from "@/config";
import { Logo } from "@/components/Logo";
import { getRecentRooms, addRecentRoom } from "@/lib/recentRooms";

const DOT_COLORS = ["#3B5BFF", "#FFB020", "#FF5D5D", "#7EE0A8", "#C792EA"];

function colorForRoom(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return DOT_COLORS[Math.abs(hash) % DOT_COLORS.length];
}

export default function Dashboard() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentRooms, setRecentRooms] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    setRecentRooms(getRecentRooms());
    setMounted(true);
  }, [router]);

  async function goToRoom(name: string) {
    setError("");
    const token = localStorage.getItem("token");
    if (!name.trim()) {
      setError("Enter a room name");
      return;
    }

    setLoading(true);
    try {
      const existing = await axios.get(`${HTTP_BACKEND}/room/${name}`);
      if (existing.data.room) {
        addRecentRoom(name);
        router.push(`/canvas/${existing.data.room.id}`);
        return;
      }

      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name },
        { headers: { Authorization: token || "" } }
      );
      addRecentRoom(name);
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

  const font = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#14171B] px-6 py-16">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-[#3B5BFF]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#FFB020]/15 blur-[120px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#F3EFE6 1px, transparent 1px), linear-gradient(90deg, #F3EFE6 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <button
        onClick={logout}
        className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-sm text-[#F3EFE6]/60 transition-colors hover:border-white/25 hover:text-[#F3EFE6] lg:right-10 lg:top-8"
        style={font}
      >
        <LogOut size={14} /> Log out
      </button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Logo />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-[#F3EFE6]/70"
        style={font}
      >
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <Sparkles size={13} className="text-[#FFB020]" />
        </motion.span>
        Ready when you are
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mb-2 text-center text-4xl text-[#F3EFE6] sm:text-5xl"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        Where to today?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-10 text-center text-[#F3EFE6]/50"
        style={font}
      >
        Enter a room name to create it, or join one that already exists.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={mounted ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 rounded-2xl bg-[#0F1114] px-4 py-3">
          <input
            autoFocus
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToRoom(roomName)}
            placeholder="e.g. team-standup"
            className="flex-1 bg-transparent text-[#F3EFE6] outline-none placeholder:text-[#F3EFE6]/25"
            style={font}
          />
          <motion.button
            whileTap={{ scale: 0.94 }}
            disabled={loading}
            onClick={() => goToRoom(roomName)}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#F3EFE6] px-4 py-2 text-sm font-medium text-[#14171B] transition-opacity disabled:opacity-50"
          >
            {loading ? "..." : "Enter"}
            {!loading && <ArrowRight size={14} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-2 pt-3 text-sm text-[#FF7A7A]"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {recentRooms.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 w-full max-w-md"
        >
          <div
            className="mb-3 flex items-center gap-1.5 text-xs text-[#F3EFE6]/40"
            style={font}
          >
            <Clock size={12} /> Recent rooms
          </div>
          <div className="flex flex-wrap gap-2">
            {recentRooms.map((room, i) => (
              <motion.button
                key={room}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.06 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => goToRoom(room)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#F3EFE6]/80 transition-colors hover:border-white/25"
                style={font}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colorForRoom(room) }}
                />
                {room}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}