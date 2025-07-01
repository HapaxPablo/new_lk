import { createCipheriv, createDecipheriv } from 'crypto'

const algorithm = 'aes-256-cbc'

// Для клиентской и серверной части
const key = Buffer.from(
  process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY || 
  process.env.CRYPTO_SECRET_KEY || 
  '', 'hex'
)

const iv = Buffer.from(
  process.env.NEXT_PUBLIC_CRYPTO_IV || 
  process.env.CRYPTO_IV || 
  '', 'hex'
)

// Проверка только в серверной среде
if (typeof window === 'undefined') {
  if (!key.length || !iv.length) {
    throw new Error('CRYPTO_SECRET_KEY and CRYPTO_IV must be defined')
  }
  if (key.length !== 32) {
    throw new Error('Invalid CRYPTO_SECRET_KEY length. Must be 32 bytes')
  }
  if (iv.length !== 16) {
    throw new Error('Invalid CRYPTO_IV length. Must be 16 bytes')
  }
}

export function encryptData(data: string): string {
  const cipher = createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

export function decryptData(encrypted: string): string {
  const decipher = createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}