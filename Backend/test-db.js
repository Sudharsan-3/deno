// const { PrismaClient } = require('@prisma/client');
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    // Try to create a test user
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: "test123"
      }
    });
    console.log("Created user:", user);
    
    // Try to read it back
    const users = await prisma.user.findMany();
    console.log("All users:", users);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();