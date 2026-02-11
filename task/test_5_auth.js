const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const APP_URL = 'https://app.evgenybelkin.ru';
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

describe('Авторизация - полный тест', () => {
    let driver;

    beforeEach(async () => {
        const options = new chrome.Options();
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.get(APP_URL);
    });

    afterEach(async () => {
        if (driver) await driver.quit();
    });

    test('Успешная авторизация с Remember Me', async () => {
        // 1. Ввод логина
        const loginField = await driver.wait(
            until.elementLocated(By.css('loginform-username')),
            10000
        );
        await loginField.clear();
        await loginField.sendKeys(LOGIN);

        // 2. Ввод пароля
        const passField = await driver.findElement(By.css('loginform-password'));
        await passField.clear();
        await passField.sendKeys(PASSWORD);

        // 3. Галочка Remember Me
        const rememberCheckbox = await driver.findElement(By.css('input[type="checkbox"], .form-check-input'));
        const isChecked = await rememberCheckbox.isSelected();
        if (!isChecked) {
            await rememberCheckbox.click();
        }
        expect(await rememberCheckbox.isSelected()).toBe(true);

        // 4. Кнопка Login
        const loginBtn = await driver.findElement(By.css('btn.btn-primary'));
        expect(await loginBtn.getText()).toContain('login');
        await loginBtn.click();

        // 5. Проверка успешного входа - исчезновение формы логина
        await driver.wait(
            until.stalenessOf(loginField),
            5000
        );

        // 6. Проверка появления страницы услуг
        await driver.wait(
            until.elementLocated(By.css('.list-group')),
            10000
        );

        // 7. Проверка кнопки Logout
        const logoutBtn = await driver.findElement(By.css('a:contains("Logout"), .logout, [href*="logout"]'));
        const logoutText = await logoutBtn.getText();
        expect(logoutText).toMatch(/Logout|Выход/i);
        expect(await logoutBtn.isDisplayed()).toBe(true);

    });

    test('Негативный - неверный логин', async () => {
        const loginField = await driver.findElement(By.css('loginform-username'));
        await loginField.sendKeys('wrong_user');

        const passField = await driver.findElement(By.css('loginform-password'));
        await passField.sendKeys(PASSWORD);

        const loginBtn = await driver.findElement(By.css('button[name="login-button"]'));
        await loginBtn.click();

        const error = await driver.wait(
            until.elementLocated(By.css('.invalid-feedback')),
            5000
        );
        const errorText = await error.getText();
        expect(errorText).toMatch(/неверный|invalid|error/i);
    });
});
    });
});
