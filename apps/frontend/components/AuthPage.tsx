"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      if (isSignin) {
        const res = await axios.post(`${HTTP_BACKEND}/signin`, {
          username: email,
          password,
        });
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      } else {
        await axios.post(`${HTTP_BACKEND}/signup`, {
          username: email,
          password,
          name,
        });
        // auto sign-in right after signup
        const res = await axios.post(`${HTTP_BACKEND}/signin`, {
          username: email,
          password,
        });
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">
      <div className="p-6 m-2 bg-white rounded w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">
          {isSignin ? "Sign in" : "Sign up"}
        </h2>

        {!isSignin && (
          <div className="p-2">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
        )}

        <div className="p-2">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="p-2">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        {error && <div className="px-2 text-sm text-red-500">{error}</div>}

        <div className="pt-2 px-2">
          <button
            disabled={loading}
            className="bg-black text-white rounded p-2 w-full disabled:opacity-50"
            onClick={handleSubmit}
          >
            {loading ? "Please wait..." : isSignin ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}