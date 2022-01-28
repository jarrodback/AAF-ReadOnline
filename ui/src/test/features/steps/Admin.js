const { Given, When, Then } = require("@cucumber/cucumber");
const { By } = require("selenium-webdriver");
const assert = require("assert");

const driver = require("../index");

Given(
    "the admmin should see {string} in their authorised requests",
    async function (name) {
        await driver
            .findElement(By.xpath("//td[text()='" + name + "']"))
            .isDisplayed();
    }
);

Then("the admin views their authorised page", async function () {
    await driver.sleep(1000);
    await driver.findElement(By.xpath("//span[text()='Admin']")).click();
    await driver.findElement(By.xpath("//a[text()='Authorise']")).click();

    let url = await driver.getCurrentUrl();
    assert.deepEqual(url, "http://localhost:8080/requests/authorise");
});

Then("the admin approves the request {string}", async function (name) {
    await driver.findElement(By.id(name)).click();
    await driver
        .findElement(By.xpath("//footer//button[text()='Approve']"))
        .click();
});
