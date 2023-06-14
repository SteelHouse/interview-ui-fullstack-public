import { PrismaClient } from "@prisma/client";
import { exit } from "process";
// import fetch from 'node-fetch';

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

    console.log("Seeding Users Complete");
    console.log("Seeding Characters");

    let max = 50;
    let url: string | null = `https://swapi.dev/api/people`;
    // preallocate memory
    let characters: Array<any> = new Array(50);
    let accumulater = 0;

    while (characters.lastIndexOf(null) < max && url) {
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
            const {name} = await sResp.json() as {name: string};
            return name;
          }
          return `Unknown`;
        })
      );

      for (let i = 0; i < results.length; i++) {
        const ch = results[i];
        characters[accumulater++] = {
          id: parseInt(ch.url.match(/(?<=people\/)\d+/).at(0), 10),
          name: ch.name,
          height: parseInt(ch.height === 'unknown' ? '0' : (ch.height ?? '0'), 10),
          weight: parseInt(ch.mass === 'unknown' ? '0' : (ch.mass ?? '0'), 10),
          hair_color: ch.hair_color ?? 'unknown',
          species: withSp[i],
          gender: ch.gender,
          birth_year: ch.birth_year,
        };
      }

      if (accumulater >= max) break;
      if (tot < 50) max = tot;
      url = next;
    }

    for await (const c of characters) {
      console.log('Seeding', c.name)
      await db.characters.create({
        data: {
          id: c.id,
          gender: c.gender,
          hair_color: c.hair_color,
          name: c.name,
          species: c.species,
          height: c.height,
          weight: c.weight,
        },
      });
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
