// app/auth/signin/page.jsx
"use client";

import { useState, useEffect } from "react";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";

// ——— ATTEMPT TO LOAD AN EXTERNAL colors.js IF YOU'VE GOT ONE ———
let externalColors = {};
try {
  // assumes you have a /colors.js exporting a default object, e.g.:
  // export default { bg: "#faf", accent: "#0a0", … }
  // adjust the path if yours lives somewhere else
  // (this will fail silently if that file doesn’t exist)
  // note: Next.js will bundle this only if present
  // you can also `import theme from "@/colors"` at the top instead of require.
  // require won’t work with ESM-only modules—if that’s your case, swap to dynamic import.
  // but for most setups this will Just Work.
  // eslint-disable-next-line import/no-unresolved, @typescript-eslint/no-var-requires
  externalColors = require("../../colors").default || {};
} catch (e) {
  externalColors = {};
}

// ——— CONFIGURE EVERYTHING HERE ———
const AUTH_CONFIG = {
  // which built‑in providers to show
  providers: {
    google: true,
    facebook: true,
    twitter: true,
    github: true,
    linkedin: true,
    apple: true,
    discord: true,
    // turn on any others here…
    // and for totally custom ones, use the `custom` array below:
  },
  // add any totally custom OAuth providers here:
  // they should at least have an `id`, `name`, `logo` and optional `callback` URL
  custom: [
    // { id: "mycorp", name: "MyCorp SSO", logo: "/icons/mycorp.svg", callback: "/" }
  ],
  // show/hide the e‑mail + password form
  showEmailForm: true,
  // show/hide the register / forgot‐password links
  showRegisterLink: true,
  showForgotPasswordLink: true,
  // show/hide the little “OR” separators
  showSeparators: true,
  // show/hide the reCAPTCHA notice
  showRecaptchaBranding: false,
  // default colors (will be merged with anything from /colors.js)
  colors: {
    bg:         "#f8f7ec",
    fg:         "#1b222c",
    btn:        "#fff",
    btnBorder:  "#ccc",
    btnText:    "#1b222c",
    accent:     "#098842",
    separator:  "#ccc",
  },
};
// ——— END CONFIG ———

// final merged theme:
const THEME = { ...AUTH_CONFIG.colors, ...externalColors };

export default function SignInPage() {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    getProviders().then((prov) => setProviders(prov));
  }, []);

  if (!providers) return null;

  // pick only the built‑ins that you turned on:
  const builtin = Object.values(providers).filter(p => AUTH_CONFIG.providers[p.id]);
  // plus any you listed in `custom`
  const allProviders = [...builtin, ...AUTH_CONFIG.custom];

  return (
    <div className="page">
      <div className="card">
        <h1>Sign in to VietVocab</h1>

        {allProviders.length > 0 && (
          <>
            {allProviders.map((p) => (
              <button
                key={p.id}
                className="btn"
                onClick={() => signIn(p.id, { callbackUrl: p.callback || "/" })}
              >
                <Image
                  src={p.logo || `/icons/${p.id}.svg`}
                  alt={`${p.name} logo`}
                  width={20}
                  height={20}
                />
                <span>Sign in with {p.name}</span>
              </button>
            ))}

            {AUTH_CONFIG.showSeparators && <div className="separator">OR</div>}
          </>
        )}

        {AUTH_CONFIG.showEmailForm && (
          <form
            className="form"
            action="/api/auth/callback/credentials"
            method="POST"
          >
            {/* NextAuth will inject a csrfToken field automatically */}
            <input name="csrfToken" type="hidden" />

            <label>Email</label>
            <input name="email" type="email" required />

            <label>Password</label>
            <div className="password-wrapper">
              <input name="password" type="password" required />
              {/* you can wire up a show/hide eye icon here if you like */}
            </div>

            <button type="submit" className="btn accent">
              Log in
            </button>

            {AUTH_CONFIG.showSeparators && <div className="separator">OR</div>}
          </form>
        )}

        <div className="links">
          {AUTH_CONFIG.showRegisterLink && (
            <a href="/register">Don’t have an account? Register</a>
          )}
          {AUTH_CONFIG.showForgotPasswordLink && (
            <a href="/forgot-password">Forgot your password?</a>
          )}
        </div>

        {AUTH_CONFIG.showRecaptchaBranding && (
          <p className="recaptcha">
            The site is protected by reCAPTCHA and the Google{" "}
            <a href="https://policies.google.com/privacy">Privacy Policy</a>{" "}
            and{" "}
            <a href="https://policies.google.com/terms">Terms of Service</a>{" "}
            apply.
          </p>
        )}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${THEME.bg};
          color: ${THEME.fg};
          padding: 2rem;
        }
        .card {
          background: #fff;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 360px;
          text-align: center;
        }
        h1 {
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          border: 1px solid ${THEME.btnBorder};
          background: ${THEME.btn};
          color: ${THEME.btnText};
          border-radius: 9999px;
          margin-bottom: 1rem;
          font-weight: 500;
          cursor: pointer;
        }
        .btn.accent {
          background: ${THEME.accent};
          border-color: ${THEME.accent};
          color: #fff;
        }
        .separator {
          position: relative;
          margin: 1.5rem 0;
          font-size: 0.875rem;
        }
        .separator::before,
        .separator::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: ${THEME.separator};
        }
        .separator::before { left: 0 }
        .separator::after  { right: 0 }

        form {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        form label {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          font-weight: 600;
        }
        form input {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid ${THEME.btnBorder};
          border-radius: 0.375rem;
        }
        .password-wrapper {
          position: relative;
        }

        .links {
          margin-top: 1rem;
        }
        .links a {
          display: block;
          font-size: 0.875rem;
          color: ${THEME.accent};
          text-decoration: none;
          margin-bottom: 0.5rem;
        }

        .recaptcha {
          margin-top: 1.5rem;
          font-size: 0.75rem;
          color: #666;
        }
      `}</style>
    </div>
  );
}
