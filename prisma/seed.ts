// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    await seedData()
    await runDataMigrations()
}

async function seedData() {
    await seedUsers()
}

async function runDataMigrations() {
    console.log('No migrations to run currently.')
}

// Seed Users Function
async function seedUsers() {
    const users = await prisma.user.findMany()
    if (users.length > 0) {
        console.log('Users exist, skipping seeding.')
        return
    }

    console.log('No existing users found. Proceeding to create an admin user...');

    // Encrypt the password
    const hashedPassword = await bcrypt.hash('12345678', 10);

    await prisma.user.create({
        data: {
            role: 'ADMIN', 
            password: hashedPassword,
            name: 'Admin',
        },
    });

    console.log('Admin user seeded successfully.')
}


main()
    .then(async () => {
        await prisma.$disconnect()
        console.log('Seeding completed successfully.')
    })
    .catch(async (e) => {
        console.error('Error during seeding:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
