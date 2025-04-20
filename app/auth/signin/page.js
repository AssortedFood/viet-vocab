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
    bg:        "#fafafa", // Background
    fg:        "#212121", // Foreground text
    btn:       "#ffffff", // Button background
    btnBorder: "#e0e0e0", // Button border
    btnText:   "#212121", // Button text
    accent:    "#1976d2", // Primary accent (Blue 700)
    separator: "#bdbdbd", // Separator lines
  }
};
// ——— END CONFIG ———

const THEME = { ...AUTH_CONFIG.colors, ...externalColors };

const ICONS = {
  google:   GoogleIcon,
  facebook: FacebookIcon,
  github:   GithubIcon,
  linkedin: LinkedInIcon,
  x:        XIcon,
};

export default function SignInPage() {
  const [providers, setProviders] = useState(null);

  // Fetch NextAuth providers
  useEffect(() => {
    getProviders().then((prov) => setProviders(prov));
  }, []);

  // Apply CSS variable overrides to :root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-bg",        THEME.bg);
    root.style.setProperty("--color-fg",        THEME.fg);
    root.style.setProperty("--color-btn",       THEME.btn);
    root.style.setProperty("--color-btnBorder", THEME.btnBorder);
    root.style.setProperty("--color-btnText",   THEME.btnText);
    root.style.setProperty("--color-accent",    THEME.accent);
    root.style.setProperty("--color-separator", THEME.separator);

    return () => {
      // clean up on unmount
      root.style.removeProperty("--color-bg");
      root.style.removeProperty("--color-fg");
      root.style.removeProperty("--color-btn");
      root.style.removeProperty("--color-btnBorder");
      root.style.removeProperty("--color-btnText");
      root.style.removeProperty("--color-accent");
      root.style.removeProperty("--color-separator");
    };
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
    <div className={styles.page}>
      <div className={styles.cardMargin}>
        <div className={styles.card}>
          <h1 className={styles.heading}>Sign in to Vocab</h1>

          {allProviders.length > 0 && (
            <>
              {allProviders.map((p) => (
                <button
                  key={p.id}
                  className={styles.btn}
                  onClick={() =>
                    signIn(p.id, { callbackUrl: p.callback || "/" })
                  }
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
                <div className={styles.separator}>OR</div>
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

              <button type="submit" className={`${styles.btn} ${styles.accent}`}>
                Log in
              </button>

              {AUTH_CONFIG.showSeparators && (
                <div className={styles.separator}>OR</div>
              )}
            </form>
          )}

          <div className={styles.links}>
            {AUTH_CONFIG.showRegisterLink && (
              <p className={styles.loginText}>
                Don’t have an account?
                <a href="/register">Register</a>
              </p>
            )}
            {AUTH_CONFIG.showForgotPasswordLink && (
              <a href="/forgot-password" className={styles.forgotLink}>
                Forgot your password?
              </a>
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
    </div>
  );
}
