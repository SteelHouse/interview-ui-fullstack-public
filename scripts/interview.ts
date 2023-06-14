import { exec } from "child_process";
import { Command, Option } from "commander";

const program = new Command();

const interviewType = new Option(
  "-t, --type <interviewType>",
  "Which interview type?"
)
  .makeOptionMandatory()
  .choices(["fullstack", "backend", "frontend"]);

program
  .command("branch")
  .description("Create a branch for the interviewer without history")
  .argument("<string>", "branch name")
  .addOption(interviewType)
  .action((branchName, opts) => {
    console.log("create branch name", branchName, "from", opts.type);
    exec(`git checkout --orphan interview/${branchName}`, (err, std) => {
      if (err) throw new Error(err.message);

      exec(`git commit -am "${branchName} interview" && git push -u origin interview/${branchName}`);
    });
  });

program.parse();
