import { createCipheriv, createDecipheriv } from 'crypto';

// Добавьте проверку на серверную среду
if (typeof window !== 'undefined') {
  throw new Error('Crypto functions can only be used server-side');
}

const algorithm = 'aes-256-cbc';

const key = Buffer.from('d07a7d84a8f5b3e9c1f2a6b5c8d3e1f7a2b4c6d8e3f1a5b7c9d2e4f6a8b3c5', 'hex');
const iv = Buffer.from('1a2b3c4d5e6f78901234567890abcdef', 'hex');

export function encryptData(data: string): string {
  if (typeof window !== 'undefined') {
    // Клиентская реализация (например, Web Crypto API)
    return window.btoa(data); // Простейший пример, замените на реальное шифрование
  } else {
    // Серверная реализация
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
}
export function decryptData(encrypted: string): string {
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}