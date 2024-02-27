import { PrismaClient } from "@prisma/client";
import { exit } from "process";
import chalk from "chalk";
import path from "path";
import characterJson from './characters.json';


const db = new PrismaClient();

async function main() {
  console.log("Seeding DB");
  try {
    console.log("Seeding Users");

    await db.user.create({
      data: {
        id: 1,
        email: `luke_skywalker@jedi.com`,
        name: `Luke Skywalker`,
        password: `lspassword`,
        role: `jedi`,
      },
    });
    await db.user.create({
      data: {
        id: 2,
        email: `darth_sidious@thedarkside.com`,
        name: `Darth Sidious`,
        password: `dspassword`,
        role: `dark_side`,
      },
    });

    console.log(chalk.blueBright("-").repeat(50));
    console.log(chalk.blueBright("Seeding Users Complete"));
    console.log(chalk.blueBright("-").repeat(50));
    console.log("\n");

    console.log(chalk.blueBright("-").repeat(50));
    console.log(chalk.blueBright("Begin Seeding Characters"));
    console.log(chalk.blueBright("-").repeat(50));
    console.log("\n");

    if (characterJson) {
      for (const c of characterJson) {
        await db.characters.create({
          data: c,
        });
      }
    }

    const ct = await db.characters.count();

    console.log("Seeding Characters Complete", ct, "seeded");
    console.log("Seeding DB Complete");
  } catch (err) {
    console.warn("Issue seeding Database", err);
  } finally {
    console.log("Disconnecting DB");
    await db.$disconnect();
  }
}

main().then(() => exit(0));
