const { Given, When, Then } = require("@cucumber/cucumber");
const { Builder, By } = require("selenium-webdriver");
const assert = require("assert");
// var webdriver = require("selenium-webdriver");
// var driver = new webdriver.Builder().forBrowser("firefox").build();
// this.driver.wait(until.elementLocated(By.tagName("table")));

const driver = new Builder().forBrowser("firefox").build();

Given("user navigates to the web app", async function () {
    await driver.get("http://localhost:8080");
});

When("user enters the Valid username and password", async function () {
    let email = driver.findElement(By.id("email-input"));
    let password = driver.findElement(By.id("password-input"));

    email.sendKeys("user@rbo.com");
    password.sendKeys("f");
    driver.findElement(By.xpath('//button[text()="Login"]')).click();
});

Then("user should be successfully logged in to the app", async function () {
    await driver.sleep(2000);
    let url = await driver.getCurrentUrl();
    await driver.findElement(By.id("request-table")).isDisplayed();
    assert.deepEqual(url, "http://localhost:8080/requests");
});
