import CryptoJS from 'crypto-js';

/**
 * Generates a random order ID
 * @returns A random string to use as order ID
 */
export const generateOrderId = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 16 }, 
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

/**
 * Creates a SHA-256 hash of the provided data
 * @param data The data to hash
 * @returns The SHA-256 hash as a hex string
 */
export const hashData = (data: string): string => {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
};

/**
 * Verifies a transaction hash against an order ID
 * In a real application, this would verify the transaction on the blockchain
 * @param transactionHash The transaction hash to verify
 * @param orderId The order ID to verify against
 * @returns True if the transaction is valid
 */
export const verifyPaymentHash = (transactionHash: string, orderId: string): boolean => {
  // In a real application, this would check the blockchain
  // For demo purposes, we'll just check if the hash is valid format and not empty
  if (!transactionHash || transactionHash.length < 10) {
    return false;
  }
  
  // Create a verification hash that combines the transaction and order ID
  // In a real app, this would verify the transaction exists on the blockchain
  const verificationData = `${transactionHash}:${orderId}:${Date.now()}`;
  const verificationHash = hashData(verificationData);
  
  // For demo purposes, we'll consider the transaction valid if it has a valid format
  // In a real app, you would verify the transaction on the blockchain
  return transactionHash.length >= 10 && /^[a-f0-9]+$/i.test(transactionHash);
};