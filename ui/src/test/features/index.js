const { Builder } = require("selenium-webdriver");

const driver = new Builder().forBrowser("firefox").build();
module.exports = driver;

//Note: Database needs to be empty before tests are run.
