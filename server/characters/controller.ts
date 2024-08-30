import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma-client";
import type { Request, Response, NextFunction } from "express";
import { Readable } from "stream";

export async function getCharacters(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const params = new URLSearchParams(req.query as Record<string, any>);
  try {
    // Interviewee Task - get the name and limit params
    //  - apply them to the findParams/findParams.where
    const take = 10;
    const nameLike = '';

    const findParams: Prisma.CharactersFindManyArgs = {
      orderBy: { name: 'asc' },
      take: take > 0 ? take : undefined,
    };

    if (nameLike?.trim()?.length) {
      findParams.where = { name: { contains: nameLike } };
    }

    const characters = await prisma.characters.findMany(findParams);
    // calculate charactersCount - use prisma.characters.[method]
    const charactersCount = 0;

    const result = {
      count: charactersCount,
      characters,
    };
    res.status(200).json(result);
  } catch (error) {
    const result = { count: 0, characters: [], error };
    res.status(500).json(result);
  }
}

export async function downloadCharacters(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const characters = await prisma.characters.findMany({ take: 5 });
    const buffers = new Array();
    buffers.push(Buffer.from("ID, Name, Weight, Height, Species\n"));

    // Interviewee task
    //  push each character into the buffer matching header order above

    // Interviewee task
    //  set Content disposition and type to download a csv file
    res.setHeader("Content-Disposition", "");
    res.setHeader("Content-Type", "");

    const fileStream = Readable.from(Buffer.concat(buffers));
    fileStream.pipe(res);
  } catch (e) {
    res.status(500).send("Unable to download file");
  }
}
