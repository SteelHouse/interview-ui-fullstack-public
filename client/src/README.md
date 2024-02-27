# The Interview - Mntn Star Wars

You will be tasked to assist the Jedi in completing several challenges to stop The Dark Side.  Should you accomplish all tasks, they will cease to exist.

## Getting started
1. Run `npm run bootstrap`
    - will install dependencies, seed the database, and start the client and server apps.

## Restarting Server
1. Stop the server
2. Run `npm start`

## Server
Running port `5001`

## Client
Running port `5002`

## Goals
Build a highly scalable web app  to stop <span style="color: lightgray; text-shadow: 1px 1px 1px red;font-size:1.1rem;">The Sith</span> from their terror.

Well, not really.  You will only need to attempt the following:

### Authentication
1. Set up the [./pages/Login.tsx](./pages/Login.tsx) to handle sending `Basic authentication` to the `[POST] /auth/login` route.
2. Validate the user in `[POST] /auth/login` and create a jwt `token` and add token to user record [auth/controller.ts](../../server/auth/controller.ts)
    - Reject any from the `Dark Side` trying to log in
3. Set up an authentication middleware to ensure <span style="color: lightgray; text-shadow: 1px 1px 1px red;font-size:1.1rem;">The Sith</span> are not able to access the Application. [middleware/authentication.ts](../../server/middleware/authentication.ts)
    - _(optional)_ Add in `cors` to make sure only the MNTN Star Wars UI can access the api's.
    - can disable / remove if needed
4. Hook up the `[GET] /me` api to return the logged in user.

### Star Wars Characters
1. Retrieve and Render the list of characters in [./pages/Characters.tsx](./pages/Characters.tsx), which includes displaying;
    - Name
    - Gender
    - Birth Year
    - Species Name
    - Height
    - Weight
    - Hair Color
2. Add styles to support character display in the following [./pages/characters.css](./pages/characters.css)
    - Layouts
      - default 1 per row
      - screen >= `30rem`, `2` per row
      - screen >= `40rem`, `3` per row
      - screen >= `70rem`, `4` per row
    - Spacing between character cards `1.5rem`
3. Add ability to search by name containing
    - Add an input to the Characters page
    - Update the [characters/controller.ts getCharacters](../../server/characters/controller.ts) to support taking in a name parameter and quering the characters.
    - _(optional - talking point)_ performance concerns
4. Add ability to set a page size on the [characters/controller.ts getCharacters](../../server/characters/controller.ts) of `20`, `50`, and `all`.
5. Add the Active Character Modal
    - Styling: [./pages/characters.css](./pages/characters.css):
        - Style the modal overlay so it scrolls with pages and covers all content
        - Style modal so it is centered and scrolls with page;
    - Modal Contents: [./pages/Characters.tsx](./pages/Characters.tsx)
        - Render the name and species in the modal
        - Closing modal should null out the active character

## Database

## Tests
