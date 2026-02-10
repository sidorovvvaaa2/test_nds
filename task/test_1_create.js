const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const URL = 'https://app.evgenybelkin.ru';
const LOGIN = 'user_4';
const PASSWORD = '21y}><Il$14Y=';

describe('Services Form Tests - Create Service', () => {
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

    test('Создание услуги - успешный сценарий', async () => {
        // Считаем элементы ДО создания
        const listItemsBefore = await driver.findElements(By.css('.list-group'));
        const initialCount = listItemsBefore.length;

        // Заполняем форму по точным ID селекторам
        await driver.findElement(By.id('serviceform-name')).clear();
        await driver.findElement(By.id('serviceform-name')).sendKeys('New Premium Service');

        await driver.findElement(By.id('serviceform-quantity')).clear();
        await driver.findElement(By.id('serviceform-quantity')).sendKeys('10');

        await driver.findElement(By.id('serviceform-price')).clear();
        await driver.findElement(By.id('serviceform-price')).sendKeys('150.50');

        await driver.findElement(By.id('serviceform-tax')).clear();
        await driver.findElement(By.id('serviceform-tax')).sendKeys('20.00');

        await driver.findElement(By.id('serviceform-gross')).clear();
        await driver.findElement(By.id('serviceform-gross')).sendKeys('180.60');

        // Нажимаем кнопку "Добавить" по точному селектору
        const addButton = await driver.wait(
            until.elementLocated(By.css('button.btn.btn-primary')),
            5000
        );
        expect(await addButton.getText()).toContain('Добавить');
        await addButton.click();

        // 1. Проверяем алерт успеха alert-success alert alert-dismissible
        const successAlert = await driver.wait(
            until.elementLocated(By.css('.alert-success.alert.alert-dismissible')),
            5000
        );
        const alertText = await successAlert.textContent || await successAlert.getText();
        expect(alertText).toContain('Услуга успешно создана.');

        // 2. Проверяем появление новой записи в list-group
        const listItemsAfter = await driver.findElements(By.css('.list-group'));
        expect(listItemsAfter.length).toBe(initialCount + 1);

        // 3. Проверяем, что новая запись содержит название услуги
        const newItem = listItemsAfter[listItemsAfter.length - 1];
        const itemText = await newItem.getText();
        expect(itemText).toContain('New Premium Service');

        // 4. Проверяем data-key='N' у новой записи (если есть)
        const dataKey = await newItem.getAttribute('data-key');
        console.log('New item data-key:', dataKey); // Для отладки

        console.log(`Услуга создана: ${initialCount} → ${listItemsAfter.length}`);
    });
});