import { exec } from "child_process";
import { Command, Option } from "commander";
import { exit } from "process";
import chalk from 'chalk';

const program = new Command();

const interviewType = new Option(
  "-t, --type <interviewType>",
  "Which interview type?"
)
  .makeOptionMandatory()
  .choices(["fullstack", "backend", "frontend"]);

const isLocal = new Option(
  "-l, --local",
  "Local install for testing?"
);
  

program
  .command("branch")
  .description("Create a branch for the interviewer without history")
  .argument("<string>", "branch name")
  .addOption(isLocal)
  .addOption(interviewType)
  .action(async (branchName, opts) => {
    console.log("create branch name", branchName, "from", opts.type);
    try {
      await asyncExec(`git fetch origin`);
      await asyncExec(`git checkout ${opts.type}`);
      await asyncExec(`git checkout --orphan interview/${branchName} ${opts.type}`);
      await asyncExec(`git commit -am "${branchName} interview" && git push --set-upstream git@github.com:SteelHouse/interview-ui-fullstack-public.git`);

      if (opts.local) {
        const stars = 45;
        const message = 'Run `npm start`';
        const padL = (stars / 2) + (Math.floor(message.length / 2));
        console.log('Installing server dependencies');
        await asyncExec(`npm install`);
        console.log('Installing client dependencies');
        await asyncExec(`cd ./client && npm install && cd ..`);

        console.log(chalk.green('*' .repeat(stars)));
        console.log(chalk.green('*' .repeat(stars)));
        console.log(chalk.green(message.padStart(padL)));
        console.log(chalk.green('*' .repeat(stars)));
        console.log(chalk.green('*' .repeat(stars)));
      }
      exit(0);
    } catch (error) {
      console.error('Unable to start the program', error);
      exit(0);
    } finally {
      console.log(`Thanks for stopping by`);
    }
  });

program.parse();

async function asyncExec(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, std) => {
      if (err) reject(err)
      else resolve(1);
    });
  });
}
