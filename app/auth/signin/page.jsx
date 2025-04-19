// app/auth/signin/page.jsx
"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState }  from "react";

export default function SignInPage() {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    getProviders().then((prov) => setProviders(prov));
  }, []);

  if (!providers) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Sign in to VietVocab
        </h1>
        <div className="space-y-4">
          {Object.values(providers).map((provider) => (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-full hover:bg-gray-100 transition"
            >
              {/* you can swap in your own SVG or image here */}
              <img src="/icons/google.svg" alt="Google logo" className="h-5 w-5 mr-2" />
              <span className="font-medium">
                Sign in with {provider.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
