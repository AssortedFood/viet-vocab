// app/auth/signin/page.js
"use client";

import { useState, useEffect } from "react";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import styles from "./page.module.css";

// SVG logo imports
import GoogleIcon from "./icons/google.svg";
import FacebookIcon from "./icons/facebook.svg";
import GithubIcon from "./icons/github.svg";
import LinkedInIcon from "./icons/linkedin.svg";
import XIcon from "./icons/x.svg";

// ——— ATTEMPT TO LOAD AN EXTERNAL colors.js IF YOU'VE GOT ONE ———
let externalColors = {};
try {
  externalColors = require("../../colors").default || {};
} catch {
  externalColors = {};
}

// ——— CONFIGURE EVERYTHING HERE ———
const AUTH_CONFIG = {
  providers: {
    google:   true,
    facebook: true,
    x:        true, // "X" is used for Twitter
    github:   true,
    linkedin: true,
  },
  showEmailForm:          true,
  showRegisterLink:       true,
  showForgotPasswordLink: true,
  showSeparators:         true,
  showRecaptchaBranding:  true,
  colors: {
    bg:        "#f8f7ec",
    fg:        "#1b222c",
    btn:       "#fff",
    btnBorder: "#ccc",
    btnText:   "#1b222c",
    accent:    "#098842",
    separator: "#ccc",
  },
};
// ——— END CONFIG ———

const THEME = { ...AUTH_CONFIG.colors, ...externalColors };

const ICONS = {
  google: GoogleIcon,
  facebook: FacebookIcon,
  github: GithubIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
};

export default function SignInPage() {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    getProviders().then((prov) => setProviders(prov));
  }, []);

  if (!providers) return null;

  const enabledIds = Object.entries(AUTH_CONFIG.providers)
    .filter(([, enabled]) => enabled)
    .map(([id]) => id);

  const allProviders = enabledIds.map((id) => {
    const icon = ICONS[id] || null;
    const provider = providers[id];
    return provider
      ? { ...provider, logo: icon }
      : {
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1),
          logo: icon,
          callback: "/",
        };
  });

  return (
    <div
      className={styles.page}
      style={{ background: THEME.bg, color: THEME.fg }}
    >
      <div className={styles.card}>
        <h1 className={styles.heading}>Sign in to VietVocab</h1>

        {allProviders.length > 0 && (
          <>
            {allProviders.map((p) => (
              <button
                key={p.id}
                className={styles.btn}
                style={{
                  borderColor: THEME.btnBorder,
                  background: THEME.btn,
                  color: THEME.btnText,
                }}
                onClick={() => signIn(p.id, { callbackUrl: p.callback || "/" })}
              >
                {p.logo && (
                  <Image
                    src={p.logo}
                    alt={`${p.name} logo`}
                    width={20}
                    height={20}
                  />
                )}
                <span>Sign in with {p.name}</span>
              </button>
            ))}

            {AUTH_CONFIG.showSeparators && (
              <div
                className={styles.separator}
                style={{ "--sep-color": THEME.separator }}
              >
                OR
              </div>
            )}
          </>
        )}

        {AUTH_CONFIG.showEmailForm && (
          <form
            className={styles.form}
            action="/api/auth/callback/credentials"
            method="POST"
          >
            <input name="csrfToken" type="hidden" />

            <label>Email</label>
            <input name="email" type="email" required />

            <label>Password</label>
            <div className={styles.passwordWrapper}>
              <input name="password" type="password" required />
            </div>

            <button
              type="submit"
              className={`${styles.btn} ${styles.accent}`}
              style={{
                background: THEME.accent,
                borderColor: THEME.accent,
                color: "#fff",
              }}
            >
              Log in
            </button>

            {AUTH_CONFIG.showSeparators && (
              <div
                className={styles.separator}
                style={{ "--sep-color": THEME.separator }}
              >
                OR
              </div>
            )}
          </form>
        )}

        <div className={styles.links}>
          {AUTH_CONFIG.showRegisterLink && (
            <a href="/register">Don’t have an account? Register</a>
          )}
          {AUTH_CONFIG.showForgotPasswordLink && (
            <a href="/forgot-password">Forgot your password?</a>
          )}
        </div>

        {AUTH_CONFIG.showRecaptchaBranding && (
          <p className={styles.recaptcha}>
            The site is protected by reCAPTCHA and the Google{" "}
            <a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
            <a href="https://policies.google.com/terms">Terms of Service</a> apply.
          </p>
        )}
      </div>
    </div>
  );
}
