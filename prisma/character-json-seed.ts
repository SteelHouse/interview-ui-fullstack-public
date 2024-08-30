import { PrismaClient } from "@prisma/client";
import { exit } from "process";
import chalk from "chalk";
import path from "path";
import { writeFile } from "fs/promises";

const db = new PrismaClient();

async function main() {
  let max = 50;
  let url: string | null = `https://swapi.dev/api/people`;
  // preallocate memory
  let characters: Array<any> = new Array(max);
  let accumulater = 0;

  console.log(chalk.blueBright("-").repeat(50));
  console.log(
    chalk.blueBright("Begin Fetching characters to generate seed file")
  );
  console.log(chalk.blueBright("-").repeat(50));
  console.log("\n");

  try {
    while (characters.lastIndexOf(null) < max && url) {
      console.log(chalk.green("*").repeat(50));
      console.log(chalk.greenBright(`fetching ${url}`));
      console.log(chalk.green("*").repeat(50));
      // @ts-ignore-next-line
      const resp = await fetch(url);
      const {
        count: tot,
        next,
        results,
      } = (await resp.json()) as {
        count: number;
        next: string | null;
        results: any[];
      };
      const withSp = await Promise.all(
        results.map(async (r) => {
          if (r.species?.length) {
            // @ts-ignore-next-line
            const sResp = await fetch(r.species[0]);
            const { name } = (await sResp.json()) as { name: string };
            return name;
          }
          return `Unknown`;
        })
      );

      for (let i = 0; i < results.length; i++) {
        const ch = results[i];
        console.log(`Building character`, ch.name);
        characters[accumulater++] = {
          id: parseInt(ch.url.match(/(?<=people\/)\d+/).at(0), 10),
          name: ch.name,
          height: parseInt(
            ch.height === "unknown" ? "0" : ch.height ?? "0",
            10
          ),
          weight: parseInt(ch.mass === "unknown" ? "0" : ch.mass ?? "0", 10),
          hair_color: ch.hair_color ?? "unknown",
          species: withSp[i],
          gender: ch.gender,
          birth_year: ch.birth_year,
        };
      }

      console.log("\n");

      if (accumulater >= max) break;
      if (tot < max) max = tot;
      url = next;
    }

    const chS = `[
      ${characters.map((c) => JSON.stringify(c)).join(',\r\n')}
    ]`;
    
    await writeFile(path.join(__dirname, 'characters.json'), chS);
  
    console.log("Seed file generated for seeding database");
  } catch (err) {
    console.warn("Issue generating seed file", err);
  }
}

main().then(() => exit(0));
