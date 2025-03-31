// lib/elevenlabs.js
import axios from "axios";

/**
 * Converts text to speech using ElevenLabs REST API with custom options
 * and returns the audio data as a Node Buffer.
 *
 * @param {string} text - The text to convert.
 * @returns {Promise<Buffer>} - The binary audio data.
 */
export async function textToSpeech(text) {
  const API_KEY = process.env.ELEVENLABS_API_KEY;
  // In your example, the voice ID is "JBFqnCBsd6RMkjVDRZzb"
  const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

  // Use the options you provided:
  const options = {
    method: "POST",
    url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    headers: {
      accept: "audio/mpeg",
      "content-type": "application/json",
      "xi-api-key": API_KEY,
    },
    data: {
      output_format: "mp3_44100_128",
      text: text, // Pass your text here.
      model_id: "eleven_flash_v2_5",
      language_code: "vi",
    },
    responseType: "arraybuffer", // Get binary data.
  };

  try {
    const response = await axios.request(options);
    return Buffer.from(response.data);
  } catch (error) {
    console.error("ElevenLabs conversion error:", error.response?.data || error);
    throw error;
  }
}
