"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm font-medium text-gray-600 hover:text-forest transition-colors"
    >
      Sign Out
    </button>
  );
}
