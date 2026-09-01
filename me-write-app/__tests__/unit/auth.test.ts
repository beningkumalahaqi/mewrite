import { describe, it, expect } from 'vitest'
import bcrypt from 'bcryptjs'

describe('Password Hashing', () => {
  it('hashes password correctly', async () => {
    const password = 'testpassword'
    const hash = await bcrypt.hash(password, 12)
    expect(hash).not.toBe(password)
    expect(hash.length).toBeGreaterThan(0)
  })

  it('compares correct password', async () => {
    const password = 'testpassword'
    const hash = await bcrypt.hash(password, 12)
    const result = await bcrypt.compare(password, hash)
    expect(result).toBe(true)
  })

  it('rejects incorrect password', async () => {
    const password = 'testpassword'
    const hash = await bcrypt.hash(password, 12)
    const result = await bcrypt.compare('wrongpassword', hash)
    expect(result).toBe(false)
  })
})
