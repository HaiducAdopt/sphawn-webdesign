"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    router.replace("/login");
  }

  return (
    <aside className="w-64 bg-[#111827] p-6 flex flex-col">
      <h2 className="text-xl font-semibold mb-8">Sphawn Admin</h2>

      <nav className="flex-1 space-y-4">
        <Link href="/admin" className="block hover:text-blue-400">
          Dashboard
        </Link>
        <Link href="/admin/lab" className="block hover:text-blue-400">
          Articles
        </Link>
        <Link href="/admin/offers" className="block hover:text-blue-400">
          Offers
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-8 text-red-400 hover:text-red-300"
      >
        Logout
      </button>
    </aside>
  );
}
