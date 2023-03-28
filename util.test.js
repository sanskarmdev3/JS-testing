const { generateText, validateInput, checkAndGenerate } = require("./util");
const puppeteer = require("puppeteer");

// generateText (Unit Test)

test("should output name and age", () => {
  const text = generateText("Max", 29);
  expect(text).toBe("Max (29 years old)");
  const text2 = generateText("Anna", 23);
  expect(text2).toBe("Anna (23 years old)");
});

test("should output data-less text", () => {
  const text = generateText("", null);
  expect(text).toBe(" (null years old)");
  const text2 = generateText();
  expect(text2).toBe("undefined (undefined years old)");
});

// validateInput (Unit Test)

test("should output false for data-less input with all true rules", () => {
  const result = validateInput(null, true, true);
  expect(result).toBe(false);
});

test("should output false for empty input with all rules", () => {
  const result = validateInput(null, true, false);
  expect(result).toBe(false);
});

test("should output false for non-number input with all rules", () => {
  const result = validateInput("abc", false, true);
  expect(result).toBe(false);
});

// checkAndUpdate (Integration Test)
test("should generate a valid text output", () => {
  const text = checkAndGenerate("Max", 23);
  expect(text).toBe("Max (23 years old)");
});

test("should generate false result a invalid text", () => {
  const text = checkAndGenerate("Max", "abc");
  expect(text).toBe(false);
});

// End to End Testing

test("should create element with text and correct class", async () => {
  // create and launch browser using puppeteer.
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,
    args: ["--window-size=1920,1080"],
  });

  // create new page in browser.
  const page = await browser.newPage();

  const url = "file:///home/sakura/Downloads/js-testing/index.html";

  // Go to our html file link.
  await page.goto(url);

  // Lets simulate
  await page.click("input#name");
  await page.type("input#name", "Anna");
  await page.click("input#age");
  await page.type("input#age", "26");
  await page.click("#btnAddUser");
  const itemText = await page.$eval(".user-item", (el) => el.textContent);
  expect(itemText).toBe("Anna (26 years old)");
}, 10000);
