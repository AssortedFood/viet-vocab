// app/auth/signin/SignInButtons.jsx
"use client";

import { useState, useEffect } from "react";
import { getProviders, signIn } from "next-auth/react";

export default function SignInButtons() {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  if (!providers) return null;

  return (
    <div className="space-y-4">
      {providers.google && (
        <button
          onClick={() => signIn(providers.google.id, { callbackUrl: "/" })}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-full hover:bg-gray-100 transition"
        >
          <img
            src="/icons/google.svg"
            alt="Google logo"
            className="h-5 w-5 mr-2"
          />
          <span className="font-medium">Sign in with Google</span>
        </button>
      )}
    </div>
  );
}
