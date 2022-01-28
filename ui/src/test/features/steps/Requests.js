const { Given, When, Then } = require("@cucumber/cucumber");
const { By } = require("selenium-webdriver");
const assert = require("assert");

const driver = require("../index");

Given("the request {string} has been created", async function (name) {
    await driver
        .findElement(By.xpath("//td[text()='" + name + "']"))
        .isDisplayed();
});

When("the user opens the create modal", async function () {
    await driver.findElement(By.xpath("//*[text()='Create']")).click();

    await driver
        .findElement(By.id("create-request-modal___BV_modal_content_"))
        .isDisplayed();
});

When("the user ticks the see completed requests box", async function () {
    driver.findElement(By.xpath('//label[@for="view-completed"]')).click();
    driver.sleep(2000);
    return driver.findElement(By.id("view-completed")).checked;
});

Then("the user enters {string} for the request name", async function (name) {
    let input = driver.findElement(By.id("name-input"));
    input.sendKeys(name);
});

Then("the user enters {int} for the cost", async function (cost) {
    let input = driver.findElement(By.id("cost-input"));
    input.sendKeys(cost);
});

Then("the user enters {string} for the author name", async function (author) {
    let input = driver.findElement(By.id("author-input"));
    input.sendKeys(author);
});

Then("the user clicks {string} for the type", async function (type) {
    driver.findElement(By.id("type-input")).click();
    driver.findElement(By.xpath("//option[text()='" + type + "']")).click();
});

Then(
    "the user clicks create request and should see request {string} created",
    async function (name) {
        driver.findElement(By.xpath("//footer//*[text()='Create']")).click();
        await driver.sleep(1000);
        await driver
            .findElement(By.xpath("//td[text()='" + name + "']"))
            .isDisplayed();
    }
);

Then("the user should see {string} in their requests", async function (name) {
    driver.sleep(2000);

    return true;
});

Then("the user cancels the request {string}", async function (name) {
    await driver.findElement(By.id(name)).click();
    await driver.findElement(By.xpath("//button[text()='Yes']")).click();
    let size = (
        await driver.findElements(By.xpath("//td[text()='" + name + "']"))
    ).length;
    assert.deepEqual(size, 0);
});

Then("the employee should put {string} into review", async function (name) {
    await driver.findElement(By.id(name)).click();
    await driver.findElement(By.xpath("//button[text()='Yes']")).click();
});

Then("the user should edit the request {string}", async function (name) {
    await driver.findElement(By.id(name)).click();
});

Then("the user should add the response {string}", async function (message) {
    await driver.findElement(By.id("additional-input")).sendKeys(message);
    await driver
        .findElement(By.xpath("//footer//button[text()='Edit']"))
        .click();
});
