import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const algorithm = 'aes-256-cbc'
const key = Buffer.from(process.env.CRYPTO_SECRET_KEY!, 'hex')
const iv = Buffer.from(process.env.CRYPTO_IV!, 'hex')

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

// можно дописать рандом