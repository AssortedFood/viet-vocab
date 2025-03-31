// testTTS.js
import fetch from "node-fetch"; // For Node versions without global fetch
import { writeFile } from "fs/promises";

(async () => {
  try {
    const response = await fetch("http://localhost:3002/api/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Xin chào, đây là một thử nghiệm" }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    await writeFile("output.mp3", audioBuffer);
    console.log("Audio file saved as output.mp3");
  } catch (error) {
    console.error("Error during API test:", error);
  }
})();
