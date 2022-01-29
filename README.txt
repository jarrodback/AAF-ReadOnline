Link to the video walkthrough:


/******************
*      Setup      *
******************/

Server DIR - /AAF/server/
UI DIR - /AAF/ui

Server - Navigate to server dir and run 'npm run demo'
The demo script will clear and repopulate the database with test data in the TEST database.
This is needed for the frontend gui-testing too.
The real database isn't populated but can be used with 'npm start'

UI - Navigate ui dir and run 'npm run serve'

User accounts: password (some ignore the validation 
to make it easier to type and was done before valdiation was introduced)
"user@rbo.com: f"
"employee@rbo.com: password123"
"admin@rbo.com: admin"

/******************
*     Testing     *
******************/

Server - To run the server integration and unit tests run 'npm test' in the server directory.

UI - Navigate to the UI directory and run 'npm run test-gui'. If you get failing results restart the server with 'npm run demo' to clear the database.
   - To run the unit/integration tests, run 'npm test' in the same dir.

A running version is built and deployed on the Azure Labs VM with manually added test data if you don't want to use the script.
The repopulate script if needed to run manually is /AAF/server/seeding/seed.js