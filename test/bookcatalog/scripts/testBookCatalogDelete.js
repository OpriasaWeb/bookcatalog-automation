const { By, Builder, until, Key } = require("selenium-webdriver")
const assert = require("assert")

describe("Test delete functionality of Book Catalog", async () => {
  let driver

  before(async () => {
    driver = await new Builder().forBrowser("MicrosoftEdge").build()
    await driver.get("http://localhost/bookcatalog/views/bookcatalog.php")
  })

  after(async () => {
    await driver.quit()
  })



  // Functions or methods here
  async function assertUrl(url){
    assert.strictEqual(url, "http://localhost/bookcatalog/views/bookcatalog.php")
  }

  async function clickDelete(id){
    let existenceDeleteButton = await driver.wait(until.elementLocated(By.xpath(`//button[@id='delete' and @value='${id}']`)), 2000)
    await driver.wait(until.elementIsVisible(existenceDeleteButton), 2000)
    let deleteButton = await driver.findElement(By.xpath(`//button[@id='delete' and @value='${id}']`))
    await deleteButton.click()
  }

  async function cancelDelete(){
    let cancelButton = await driver.findElement(By.xpath(`//button[@id='canceldelete']`))
    await cancelButton.click()
  }

  async function deleteBook(){
    let deleteButton = await driver.findElement(By.xpath(`//button[@id='deletebook']`))
    await deleteButton.click()
  }

  async function okButtonModal(id){
    let okMessage = await driver.findElement(By.xpath(`//button[@id='${id}']`))
    await okMessage.click()
  }

  it("Verify if user is able to see modal of delete", async () => {

    // Assert current link
    let currentUrl = await driver.getCurrentUrl();
    assertUrl(currentUrl)

    await clickDelete('77')

    // Assert
    let deleteModal = await driver.wait(until.elementLocated(By.id("delvalidationmssg")), 2000)
    await driver.wait(until.elementIsVisible(deleteModal), 2000)
    let validationMessage = await driver.findElement(By.id("delvalidationmssg"))

    assert.strictEqual(await validationMessage.getText(), "Are you sure to delete this book?")

  })

  it("Verify if user is able to go back after delete modal pop up", async () => {
    await cancelDelete()
  })

  it("Verify if user is able to delete book", async () => {
    await clickDelete("77")

    await deleteBook()

    // Assert
    let deleteModal = await driver.wait(until.elementLocated(By.id("deletemessage")), 2000)
    await driver.wait(until.elementIsVisible(deleteModal), 2000)
    let validationMessage = await driver.findElement(By.id("deletemessage"))

    assert.strictEqual(await validationMessage.getText(), "Delete successfully!")

    await okButtonModal("okdelete")

  })


})