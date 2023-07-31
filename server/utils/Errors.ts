export class DarkSideError extends Error {
  constructor(message: string = `You are not permitted`) {
    super(message, {
      cause: `You are the Dark Side`,
    });
  }
}