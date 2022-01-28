const { Given, When, Then } = require("@cucumber/cucumber");
const { By } = require("selenium-webdriver");
const assert = require("assert");

const driver = require("../index");

Given(
    "the employee should see {string} in their assigned requests",
    async function (name) {
        await driver
            .findElement(By.xpath("//td[text()='" + name + "']"))
            .isDisplayed();
    }
);

Then("the employee should navigate to the assign page", async function () {
    await driver.sleep(1000);
    await driver.findElement(By.xpath("//a[text()='Assign Requests']")).click();

    let url = await driver.getCurrentUrl();
    assert.deepEqual(url, "http://localhost:8080/requests/assign");
});

Then(
    "the employee should assign {string} to themselves",
    async function (name) {
        await driver.findElement(By.id(name)).click();
        await driver.findElement(By.xpath("//button[text()='Yes']")).click();
    }
);

Then("the employee should navigate to their assigned page", async function () {
    await driver.sleep(1000);
    await driver.findElement(By.xpath("//a[text()='Requests']")).click();

    let url = await driver.getCurrentUrl();
    assert.deepEqual(url, "http://localhost:8080/requests");
});

Then("the employee should put {string} into review.", async function (name) {
    await driver.findElement(By.id(name)).click();
    await driver.findElement(By.xpath("//button[text()='Yes']")).click();
});

Then(
    "the employee should ask the user to add {string} to the request",
    async function (message) {
        await driver.findElement(By.id("comment-input")).sendKeys(message);
        await driver
            .findElement(By.xpath("//button[text()='Confirm']"))
            .click();
    }
);

Then(
    "the employee should set {string} to require more information",
    async function (name) {
        await driver.findElement(By.id(name)).click();
    }
);

Then("the employee should approve the request {string}", async function (name) {
    await driver.findElement(By.id(name)).click();
});

Then(
    "the employee decides the cost is actually {int} and approves it",
    async function (cost) {
        await driver.findElement(By.id("cost-input")).clear();
        await driver.findElement(By.id("cost-input")).sendKeys(cost);

        await driver
            .findElement(By.xpath("//footer//button[text()='Approve']"))
            .click();
    }
);
