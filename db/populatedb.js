#!/usr/bin/env node

import * as dotenv from "dotenv";
import { Client } from "pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Please provide DATABASE_URL in your .env file");
  process.exit(1);
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Connecting to database and seeding with Prisma...");

  try {
    // 1. Clear old data using Prisma's transactional safety
    console.log("Clearing old data...");
    await prisma.$transaction([
      prisma.messages.deleteMany(),
      prisma.users.deleteMany(),
    ]);

    // 2. Hash passwords
    console.log("Hashing passwords...");
    const hashedPassword1 = await bcrypt.hash("guest123", 10);
    const hashedPassword2 = await bcrypt.hash("member123", 10);
    const hashedPassword3 = await bcrypt.hash("admin123", 10);

    // 3. Insert Users and their nested Messages together
    console.log("Inserting users and messages...");

    // Create Guest User and their message
    await prisma.users.create({
      data: {
        first_name: "John",
        last_name: "Doe",
        username: "johndoe",
        password: hashedPassword1,
        is_member: false,
        is_admin: false,
        messages: {
          create: {
            title: "Hello World!",
            text: "This is my first message here. Super excited!",
          },
        },
      },
    });

    // Create Member User and their message
    await prisma.users.create({
      data: {
        first_name: "Luna",
        last_name: "Lovegood",
        username: "luna",
        password: hashedPassword2,
        is_member: true,
        is_admin: false,
        messages: {
          create: {
            title: "Secret Plushie Club",
            text: "The secret code is so cozy. Glad to be a member!",
          },
        },
      },
    });

    // Create Admin User and their message
    await prisma.users.create({
      data: {
        first_name: "Boss",
        last_name: "Admin",
        username: "admin",
        password: hashedPassword3,
        is_member: true,
        is_admin: true,
        messages: {
          create: {
            title: "System Announcement",
            text: "Welcome to Members Only! Keep it friendly and clean.",
          },
        },
      },
    });

    console.log("Done! Database successfully populated.");
  } catch (err) {
    console.error("Error populating database:", err);
  } finally {
    // Disconnect safely from the Prisma client instance
    await prisma.$disconnect();
  }
}

main();
