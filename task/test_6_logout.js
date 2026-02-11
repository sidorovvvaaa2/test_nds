const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const URL = 'https://app.evgenybelkin.ru';
const LOGIN = 'user_4';
const PASSWORD = '21y}><Il$14Y=';

describe('Services Form Tests', () => {
    let driver;

    beforeEach(async () => {
        const options = new chrome.Options();
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        await driver.get(URL);

        const loginField = await driver.wait(
            until.elementLocated(By.css('input[type="text"]')),
            10000,
        );
        await loginField.sendKeys(LOGIN);
        const passField = await driver.findElement(
            By.css('input[type="password"]'),
        );
        await passField.sendKeys(PASSWORD, Key.RETURN);
        await driver.wait(until.urlContains('/services'), 10000);
    });

    afterEach(async () => {
        await driver.quit();
    });
    const logoutBtn = await driver.wait(
        until.elementLocated(By.css('nav-link.btn.btn-link.logout')),
        5000
    );
    const logoutText = await logoutBtn.getText();
    expect(logoutText).toContain('Logout (user_4)');
    expect(await logoutBtn.isDisplayed()).toBe(true);

    await logoutBtn.click();

    const loginFieldAfter = await driver.wait(
        until.elementLocated(By.css('loginform-username')),
        5000
    );

    expect(await loginFieldAfter.isEnabled()).toBe(true);
    expect(await loginFieldAfter.isDisplayed()).toBe(true);

    const passFieldAfter = await driver.findElement(By.css('loginform-password'));
    expect(await passFieldAfter.isEnabled()).toBe(true);

    const loginBtnAfter = await driver.findElement(By.css('btn.btn-primary"]'));
    expect(await loginBtnAfter.isEnabled()).toBe(true);
    expect(await loginBtnAfter.isDisplayed()).toBe(true);
});

