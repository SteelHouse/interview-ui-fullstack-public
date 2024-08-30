# Interviewee Tasks
[The Real ReAdME.md](./client/src/README.md)


# Interview Builders
## Getting latest code
- For `main` just do a `git pull`
- For any other branch, must do a `git pull --rebase`
  - code will be force pushed from the `fullstack`, `backend`, and `frontend` branches when updating code.

## Updating the code
- Code changes are done on the `main` branch for any code that must be carried across the `fullstack`, `backend`, and `frontend` branches.
- Rebase each `<branch>` onto `main` e.g.: `git rebase main`
- Force push changes back up `git push --force`