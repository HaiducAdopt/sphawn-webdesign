"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/lab");
    } catch (err) {
      setError("Invalid email or password");
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#0A1A2F] text-white overflow-hidden">
      {/* BACKGROUND BLUR – SPHAWN */}
      <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-[#00E1F0] opacity-20 blur-[160px]" />
      <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-[#BC4EF0] opacity-20 blur-[180px]" />

      {/* LOGIN CARD */}
      <form
        onSubmit={handleSubmit}
        className="
          relative z-10
          w-full max-w-sm
          bg-[#111827]
          border border-white/10
          rounded-xl
          px-8 py-10
        "
      >
        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Sphawn Logo"
            width={200}
            height={100}
            className="h-12 w-auto"
            priority
          />
        </div>

        <h1 className="text-xl font-semibold mb-2 text-center">
          Admin Login
        </h1>

        <p className="text-sm text-gray-400 mb-6 text-center">
          Sign in to access the Sphawn admin panel
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-400 text-center">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email address"
            className="
              w-full
              px-4 py-2.5
              rounded-md
              bg-[#1F2937]
              border border-white/10
              text-white
              placeholder-gray-500
              focus:outline-none
              focus:border-[#00E1F0]
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            className="
              w-full
              px-4 py-2.5
              rounded-md
              bg-[#1F2937]
              border border-white/10
              text-white
              placeholder-gray-500
              focus:outline-none
              focus:border-[#00E1F0]
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="
            w-full
            py-2.5
            rounded-md
            bg-[#00E1F0]
            text-black
            font-medium
            hover:brightness-110
            transition
          "
        >
          Login
        </button>
      </form>
    </main>
  );
}
