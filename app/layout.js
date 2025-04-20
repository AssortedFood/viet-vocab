// app/layout.js
import SWRegister from "./sw-register";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppThemeProvider from "./theme-provider";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "vocab",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3D3A4B" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          margin: 0,
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SWRegister /> {/* ✅ Registers Service Worker */}
        <Providers>
          <AppThemeProvider>
            {children}
          </AppThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
