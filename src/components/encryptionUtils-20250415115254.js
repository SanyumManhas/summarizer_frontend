// src/utils/encryptionUtils.js

const SECRET_KEY = process.env.REACT_APP_SECRETKEY; // Must be 16 bytes (AES-128)

// Convert string to ArrayBuffer
const textToArrayBuffer = (text) => new TextEncoder().encode(text);

// Convert ArrayBuffer to hex string
const bufferToHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

// Generate a random IV (Initialization Vector)
const generateIV = () => window.crypto.getRandomValues(new Uint8Array(16));

// Encrypt function
export const encryptPassword = async (password) => {
  const iv = generateIV();
  const key = await crypto.subtle.importKey(
    "raw",
    textToArrayBuffer(SECRET_KEY),
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    textToArrayBuffer(password)
  );

  return {
    encryptedData: bufferToHex(encryptedBuffer),
    iv: bufferToHex(iv),
  };
};
