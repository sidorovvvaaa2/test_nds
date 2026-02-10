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

    test('Ошибка валидации формы - некорректные значения', async () => {
        // Ждем появления формы создания услуги и заполняем некорректными данными
        await driver.wait(until.elementLocated(By.css('input[name="name"]')), 5000);

        // Тестовые данные с намеренными ошибками для срабатывания валидации
        const invalidData = {
            name: '',           // Пустое наименование
            quantity: '0',      // Количество < 1
            price: '0',         // Цена < 0.01
            tax: '-5',          // Отрицательный НДС
            gross: '0'          // Цена с НДС < 0.01
        };

        // Заполняем поля некорректными значениями
        const nameField = await driver.findElement(By.css('input[name="name"]'));
        await nameField.clear();
        await nameField.sendKeys(invalidData.name); // Оставляем пустым

        const quantityField = await driver.findElement(By.css('input[name="quantity"]'));
        await quantityField.clear();
        await quantityField.sendKeys(invalidData.quantity);
        const priceField = await driver.findElement(By.css('input[name="price"]'));
        await priceField.clear();
        await priceField.sendKeys(invalidData.price);

        const taxField = await driver.findElement(By.css('input[name="tax"]'));
        await taxField.clear();
        await taxField.sendKeys(invalidData.tax);

        const grossField = await driver.findElement(By.css('input[name="gross"]'));
        await grossField.clear();
        await grossField.sendKeys(invalidData.gross);


        // Нажимаем кнопку "Добавить"
        const addButton = await driver.wait(
            until.elementLocated(By.css('button.btn.btn-primary')),
            5000
        );
        await addButton.click();

        const error = await driver.wait(
            until.elementLocated(By.css('.invalid-feedback')),
            3000
        );

        const errorText = await error.getText();
        expect(errorText.length).toBeGreaterThan(0); // Есть текст ошибки
        expect(errorText).toMatch(/Необходимо заполнить|должно быть не меньше/i); // Ключевые слова

        console.log('Ошибка валидации:', errorText);
    });
});