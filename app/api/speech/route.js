// app/api/speech/route.js
"use server";
import { textToSpeech } from "../../../lib/elevenlabs";

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text) {
      return new Response("Missing text parameter.", { status: 400 });
    }
    const audioBuffer = await textToSpeech(text);
    return new Response(audioBuffer, {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("Error in ElevenLabs API endpoint:", error);
    return new Response("Failed to convert text to speech.", { status: 500 });
  }
}
