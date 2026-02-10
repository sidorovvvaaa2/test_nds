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

    test('Удаление услуги', async () => {
        // Ждем появления списка услуг и нажимаем первую кнопку delete
        const deleteBtn = await driver.wait(
            until.elementLocated(By.css('.div:nth-child(1) > div > div:nth-child(2) > span.badge.bg-danger.rounded-pill')),
            5000
        );
        await deleteBtn.click();

        // Окошка подтверждения нет, сразу проверяем исчезновение элемента
        const listItems = await driver.findElements(By.css('.list-group'));
        const initialCount = listItems.length;
        // Ждем исчезновения выбранной записи из list-group
        await driver.wait(async () => {
            const currentItems = await driver.findElements(By.css('.list-group'));
            return currentItems.length < initialCount;
        }, 5000);

        // Проверяем что количество list-group уменьшилось
        const afterDeleteCount = await driver.findElements(By.css('.list-group')).then(els => els.length);
        expect(afterDeleteCount).toBe(initialCount - 1);
    });
});