const { Given, When, Then } = require("@cucumber/cucumber");
const { By } = require("selenium-webdriver");
const assert = require("assert");

const driver = require("../index");

Given("user navigates to the web app", async function () {
    await driver.get("http://localhost:8080");
});

Given("the user is logged into the web app as User", async function () {
    await driver.switchTo().newWindow("tab");
    await driver.get("http://localhost:8080");

    let email = driver.findElement(By.id("email-input"));
    let password = driver.findElement(By.id("password-input"));

    email.sendKeys("user@rbo.com");
    password.sendKeys("f");
    driver.findElement(By.xpath('//button[text()="Login"]')).click();

    await driver.sleep(2000);

    let url1 = await driver.getCurrentUrl();
    assert.deepEqual(url1, "http://localhost:8080/requests");
});

Given("the user is logged into the web app as Employee", async function () {
    // Opens a new tab and switches to new tab
    await driver.switchTo().newWindow("tab");
    await driver.sleep(2000);

    await driver.get("http://localhost:8080/login");

    let email = driver.findElement(By.id("email-input"));
    let password = driver.findElement(By.id("password-input"));

    email.sendKeys("employee@rbo.com");
    password.sendKeys("password123");
    driver.findElement(By.xpath('//button[text()="Login"]')).click();

    await driver.sleep(2000);

    let url1 = await driver.getCurrentUrl();
    assert.deepEqual(url1, "http://localhost:8080/requests");
});

Given("the user is logged into the web app as Admin", async function () {
    // Opens a new tab and switches to new tab
    await driver.switchTo().newWindow("tab");
    await driver.sleep(2000);

    await driver.get("http://localhost:8080/login");

    let email = driver.findElement(By.id("email-input"));
    let password = driver.findElement(By.id("password-input"));

    email.sendKeys("admin@rbo.com");
    password.sendKeys("admin");
    driver.findElement(By.xpath('//button[text()="Login"]')).click();

    await driver.sleep(2000);

    let url1 = await driver.getCurrentUrl();
    assert.deepEqual(url1, "http://localhost:8080/requests");
});

Given("the user is logged into the web app", async function () {
    let url = await driver.getCurrentUrl();
    assert.deepEqual(url, "http://localhost:8080/requests");
});

When("user enters the Valid username and password", async function () {
    let email = driver.findElement(By.id("email-input"));
    let password = driver.findElement(By.id("password-input"));

    email.sendKeys("user@rbo.com");
    password.sendKeys("f");
    driver.findElement(By.xpath('//button[text()="Login"]')).click();
});

When("user enters the Invalid username and password", async function () {
    let email = driver.findElement(By.id("email-input"));
    let password = driver.findElement(By.id("password-input"));

    email.sendKeys("user@rbo.com");
    password.sendKeys("f123");
    driver.findElement(By.xpath('//button[text()="Login"]')).click();
    await driver.sleep(1000);
});

Then("user should be successfully logged in to the app", async function () {
    await driver.sleep(1000);
    let url = await driver.getCurrentUrl();
    assert.deepEqual(url, "http://localhost:8080/requests");
});

Then("user should see a login error message", async function () {
    let notification_message = await driver
        .findElement(
            By.xpath(
                '//* [text()[contains(.,"Your email or password is incorrect")]]'
            )
        )
        .getText();

    assert.deepEqual(
        notification_message,
        "Your email or password is incorrect."
    );
});

Then("the user should log out", async function () {
    await driver.findElement(By.xpath("//em")).click();
    await driver
        .findElement(By.xpath('//* [text()[contains(.,"Sign Out")]]'))
        .click();

    await driver.sleep(1000);

    let url = await driver.getCurrentUrl();
    assert.deepEqual(url, "http://localhost:8080/login");
});
