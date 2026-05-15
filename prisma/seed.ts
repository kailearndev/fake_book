import * as bcrypt from 'bcrypt'
import { PrismaPg } from '@prisma/adapter-pg'
import {
    PrismaClient,
    Role,
    UserStatus,
} from '../generated/prisma/client'

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
    }),
})

async function main() {
    const adminEmail =
        process.env.ADMIN_EMAIL || 'admin@gmail.com'

    const adminPassword =
        process.env.ADMIN_PASSWORD || 'admin123'

    const hashedPassword = await bcrypt.hash(
        adminPassword,
        10,
    )

    await prisma.user.upsert({
        where: {
            email: adminEmail,
        },
        update: {
            roles: [Role.ADMIN],
            status: UserStatus.ACTIVE,
        },
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Super Admin',
            roles: [Role.ADMIN],
            status: UserStatus.ACTIVE,
        },
    })

    console.log('✅ Admin seed completed')
}

main()
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })