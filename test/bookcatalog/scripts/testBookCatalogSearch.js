const { By, Builder, until, Key } = require("selenium-webdriver")
const assert = require("assert")

describe("Test search functionality of Book Catalog", async () => {
  let driver

  before(async () => {
    driver = await new Builder().forBrowser("MicrosoftEdge").build()
    await driver.get("http://localhost/bookcatalog/views/bookcatalog.php")
  })

  after(async () => {
    await driver.quit()
  })

  async function searchBook(title){
    await driver.findElement(By.id("search-book")).sendKeys(title, Key.RETURN)
  }

  async function clearForm(name){
    const clearField = await driver.findElement(By.xpath(`//input[@id='${name}']`))
    await clearField.sendKeys(Key.CONTROL, 'a') 
    await clearField.sendKeys(Key.BACK_SPACE)
    // await clearField.sendKeys(Key.RETURN)
  }

  async function noDataAvailable(text){
    let dataTable = await driver.wait(until.elementLocated(By.className("dt-empty")), 2000)
    await driver.wait(until.elementIsVisible(dataTable), 2000)

    let dataTableResult = await driver.findElement(By.className("dt-empty"))

    // Assert
    assert.strictEqual(await dataTableResult.getText(), text)
  }

  // async function hasDataAvailable(text){
  //   let dataTable = await driver.wait(until.elementLocated(By.xpath("//table[@id='myTable']/tbody/tr[1]/td[1]")), 10000)
  //   await driver.wait(until.elementIsVisible(dataTable), 10000)

  //   let isbnColumn = driver.findElement(By.xpath("//table[@id='myTable']/tbody/tr[1]/td[1]"));
  //   let cellText = await isbnColumn.getText();

  //   // Assert
  //   assert.equal(cellText, text)
  // }

  it("Verify if user is able to search book in search form, 'Phi' title", async () => {

    await searchBook("Phi")

    await noDataAvailable("No data available in table")

    await clearForm("search-book")

  })

  it("Verify if user is able to search book in search form, 'Cham' title", async () => {

    await searchBook("Cham")

    await noDataAvailable("No data available in table")

    await clearForm("search-book")

  })

  it("Verify if user is able to search book in search form, 'The' title", async () => {

    await searchBook("The")

    // await hasDataAvailable("The Battle of the Labyrinth")
    let dataTable = await driver.wait(until.elementLocated(By.id("myTable")), 10000)
    await driver.wait(until.elementIsVisible(dataTable), 10000)

    let isbnColumn = driver.findElement(By.xpath("//table[@id='myTable']/tbody/tr[1]/td[1]"));
    let cellText = await isbnColumn.getText();

    console.log(cellText)

    // Assert
    assert.equal(cellText, "The Battle of the Labyrinth")

    await clearForm("search-book")
  })

  it("Verify if user is able to search book in search form, 'Highly' title", async () => {

    await searchBook("Highly")

    // await hasDataAvailable("7 Highly Effective People")
    let dataTable = await driver.wait(until.elementLocated(By.id("myTable")), 10000)
    await driver.wait(until.elementIsVisible(dataTable), 10000)

    let isbnColumn = driver.findElement(By.xpath("//table[@id='myTable']/tbody/tr[1]/td[1]"));
    let cellText = await isbnColumn.getText();

    console.log(cellText)

    // Assert
    assert.equal(cellText, "7 Highly Effective People")

    await clearForm("search-book")

  })

  it("Verify if user is able to search book in search form, 'Ship' title", async () => {

    await searchBook("Ship")

    await noDataAvailable("No data available in table")

    await clearForm("search-book")

  })

  it("Verify if user is able to search book in search form, 'qweqwewqewqe' title", async () => {

    await searchBook("qweqwewqewqe")

    await noDataAvailable("No data available in table")

    await clearForm("search-book")

  })

})