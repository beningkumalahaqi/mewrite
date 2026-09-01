import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'

config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create user
  const email = process.env.SEED_EMAIL || 'author@mewrite.app'
  const password = process.env.SEED_PASSWORD || 'haqiz'
  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
    },
  })

  console.log(`User created: ${email}`)

  // Create author
  const existingAuthor = await prisma.author.findFirst()
  if (!existingAuthor) {
    await prisma.author.create({
      data: {
        id: 'author-1',
        name: 'HaqiZ',
        bio: 'Writer. Reader. Occasionally both at the same time.',
      },
    })
  }

  console.log('Author created: HaqiZ')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
