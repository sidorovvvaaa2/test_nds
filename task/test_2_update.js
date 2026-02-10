const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const URL = 'https://app.evgenybelkin.ru';
const LOGIN = 'user_4';
const PASSWORD = '21y}><Il$14Y=';

describe('Services Form Tests - Edit Service', () => {
    let driver;

    beforeEach(async () => {
        const options = new chrome.Options();
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.get(URL);

        // Логин
        const loginField = await driver.wait(until.elementLocated(By.css('input[type="text"]')), 10000);
        await loginField.sendKeys(LOGIN);
        const passField = await driver.findElement(By.css('input[type="password"]'));
        await passField.sendKeys(PASSWORD, Key.RETURN);
        await driver.wait(until.urlContains('/services'), 10000);
    });

    afterEach(async () => {
        await driver.quit();
    });

    test('Изменение услуги - полный сценарий', async () => {
        // 1. Клик по первой кнопке Edit (badge с link)
        const editBadge = await driver.wait(
            until.elementLocated(By.css('span.badge.bg-warning a[href*="/site/index?id="]')),
            10000
        );
        expect(await editBadge.getText()).toBe('Edit');
        await editBadge.click();

        // 2. Ждем загрузки формы редактирования и заполняем поля
        await driver.wait(until.elementLocated(By.css('input[name="name"]')), 5000);

        // Очищаем и заполняем все поля
        await driver.findElement(By.css('input[name="name"]')).clear();
        await driver.findElement(By.css('input[name="name"]')).sendKeys('Updated Service Premium');

        await driver.findElement(By.css('input[name="quantity"]')).clear();
        await driver.findElement(By.css('input[name="quantity"]')).sendKeys('15');

        await driver.findElement(By.css('input[name="price"]')).clear();
        await driver.findElement(By.css('input[name="price"]')).sendKeys('250');

        await driver.findElement(By.css('input[name="tax"]')).clear();
        await driver.findElement(By.css('input[name="tax"]')).sendKeys('22');

        await driver.findElement(By.css('input[name="gross"]')).clear();
        await driver.findElement(By.css('input[name="gross"]')).sendKeys('305');

        // 3. Клик по кнопке "Изменить"
        const changeBtn = await driver.wait(
            until.elementLocated(By.css('button.btn.btn-primary:not([data-bs-dismiss])')),
            5000
        );
        expect(await changeBtn.getText()).toContain('Изменить');
        await changeBtn.click();

        // 4. Проверка алерта успеха
        const successAlert = await driver.wait(
            until.elementLocated(By.css('.alert-success.alert.alert-dismissible')),
            5000
        );
        const alertText = await successAlert.textContent || await successAlert.getText();
        expect(alertText).toContain('Услуга успешно изменена.');

        // Опционально: закрываем алерт
        const closeBtn = await successAlert.findElement(By.css('button.btn-close'));
        await closeBtn.click();

        // 5. Проверка обновления в таблице
        const updatedRow = await driver.wait(
            until.elementLocated(By.css('.list-group-item')),
            5000
        );
        expect(await updatedRow.getText()).toContain('Updated Service Premium');
    });
});
