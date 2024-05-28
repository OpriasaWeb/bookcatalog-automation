const { By, Builder, until, Key } = require("selenium-webdriver")
const { Select } = require("selenium-webdriver/lib/select")
const assert = require("assert")

describe("Test add new book functionality of Book Catalog", async () => {
  let driver

  before(async () => {
    driver = await new Builder().forBrowser("MicrosoftEdge").build()
    await driver.get("http://localhost/bookcatalog/views/bookcatalog.php")
  })

  after(async () => {
    await driver.quit()
  })

  // Built-in functions
  async function clickAdd(){
    let addButton = await driver.findElement(By.xpath("//button[@class='btn btn-success addbook' and @type='button']"))
    await addButton.click()
  }

  async function okButtonValidation(id){
    let okMessage = await driver.findElement(By.xpath(`//button[@id='${id}']`))
    await okMessage.click()
  }

  async function addItButton(){
    let addIt = await driver.findElement(By.xpath("//button[@id='addbook' and @type='button']"))
    await addIt.click()
  }

  async function clearForm(name){
    const clearField = await driver.findElement(By.xpath(`//input[@id='${name}']`))
    await clearField.sendKeys(Key.CONTROL, 'a') 
    await clearField.sendKeys(Key.BACK_SPACE)
  }

  async function fillInForm(id, keys){
    let title = await driver.findElement(By.id(`${id}`))
    await title.sendKeys(keys)
  }


  describe("Test add functionality with wrong credentials or information details", async () => {

    it("Verify if user is unable to add new book with empty forms and select category selected", async () => {
      await clickAdd()

      await addItButton()

      // Assert
      let validationMessage = await driver.findElement(By.id("errormessage"))
      assert.strictEqual(await validationMessage.getText(), "Please fill-up everything.")

      await okButtonValidation("okMessage")
    })

    it("Verify if user is unable to add new book with empty Title", async () => {
      // ISBN
      await fillInForm("isbn" ,"1")

      // Author
      await fillInForm("author" ,"Rick Riordan")

      // Publisher
      await fillInForm("publisher" ,"Manila Times")

      // Category
      let addCategory = await driver.findElement(By.xpath("//select[@id='category']"))

      // Create instance of Select
      const addSelectCategory = new Select(addCategory)
      await addSelectCategory.selectByVisibleText("Non-fiction")

      await addItButton()

      // Assert
      let validationMessage = await driver.findElement(By.id("errormessage"))
      assert.strictEqual(await validationMessage.getText(), "Please fill-up everything.")

      await okButtonValidation("okMessage")
    })

    it("Verify if user is unable to add new book with empty ISBN", async () => {

      // Title
      await fillInForm("title" ,"7 Highly Effective People")

      // Clear ISBN
      await clearForm("isbn")

      await addItButton()

      // Assert
      let validationMessage = await driver.findElement(By.id("errormessage"))
      assert.strictEqual(await validationMessage.getText(), "Please fill-up everything.")

      await okButtonValidation("okMessage")
    })

    it("Verify if user is unable to add new book with empty Author", async () => {

      // Clear author
      await clearForm("author")

      // isbn
      await fillInForm("isbn" ,"3")

      await addItButton()

      // Assert
      let validationMessage = await driver.findElement(By.id("errormessage"))
      assert.strictEqual(await validationMessage.getText(), "Please fill-up everything.")

      await okButtonValidation("okMessage")
    })

    it("Verify if user is unable to add new book with empty Publisher", async () => {

      // Clear publisher
      await clearForm("publisher")

      // Author
      await fillInForm("author" ,"Rick Riordan")

      await addItButton()

      // Assert
      let validationMessage = await driver.findElement(By.id("errormessage"))
      assert.strictEqual(await validationMessage.getText(), "Please fill-up everything.")

      await okButtonValidation("okMessage")
    })

    it("Verify if user is unable to add new bookwith unselected category", async () => {

      // publisher
      await fillInForm("publisher" ,"Manila Times")

      // Category
      let addCategory = await driver.findElement(By.xpath("//select[@id='category']"))

      // Create instance of Select
      const addSelectCategory = new Select(addCategory)
      await addSelectCategory.selectByVisibleText("Select category")

      await addItButton()

      // Assert
      let validationMessage = await driver.findElement(By.id("errormessage"))
      assert.strictEqual(await validationMessage.getText(), "Please fill-up everything.")

      await okButtonValidation("okMessage")
    })

    it("Verify if user is unable to add new book with string or not a number detail in the ISBN form", async () => {

      // Clear ISBN
      await clearForm("isbn")

      // ISBN
      await fillInForm("isbn" ,"BC-0005")

      // Category
      let addCategory = await driver.findElement(By.xpath("//select[@id='category']"))

      // Create instance of Select
      const addSelectCategory = new Select(addCategory)
      await addSelectCategory.selectByVisibleText("Anime")

      await addItButton()

      // Assert
      let successMessage = await driver.wait(until.elementLocated(By.id("successmessage")), 5000)
      await driver.wait(until.elementIsVisible(successMessage), 5000)
      let validationMessage = await driver.findElement(By.id("successmessage"))

      assert.strictEqual(await validationMessage.getText(), "Successfully add new book!")

      await okButtonValidation("okMessageSuccess")

      // Data Table
      let isbnColumn = driver.findElement(By.xpath("//table[@id='myTable']/tbody/tr[1]/td[2]"));
      let cellText = await isbnColumn.getText();
      assert.strictEqual(cellText, "0", "This is bug. User is able to add new book and returns to 0 the ISBN detail instead of BC-0005")
    })

    it("Verify if user is able to go back by clicking back button after clicking the Add green button", async () => {

      clickAdd()
      
      // Click back
      let backFromAdd = await driver.findElement(By.id("backadd"))
      await backFromAdd.click()

      clickAdd()

    })

    it("Verify if user is able to go back by clicking back button after clicking the Add green button", async () => {

      // Title
      await fillInForm("title" ,"BC-0005")

      // ISBN
      await fillInForm("isbn" ,"5")

      // Author
      await fillInForm("author" ,"Rick Riordan")

      // Publisher
      await fillInForm("publisher" ,"Manila Times")

      // Category
      let addCategory = await driver.findElement(By.xpath("//select[@id='category']"))

      // Create instance of Select
      const addSelectCategory = new Select(addCategory)
      await addSelectCategory.selectByVisibleText("Fiction")

      // Click back
      let backFromAdd = await driver.findElement(By.id("backadd"))
      await backFromAdd.click()

      // Re-click add green button
      await clickAdd()

      // Assert empty values here
      let title = await driver.findElement(By.id("title")).getText()
      let isbn = await driver.findElement(By.id("isbn")).getText()
      let author = await driver.findElement(By.id("author")).getText()
      let publisher = await driver.findElement(By.id("publisher")).getText()

      // Assert that the category is reset
      let reCategory = await driver.findElement(By.xpath("//select[@id='category']"))
      let selectedCategory = await reCategory.findElement(By.xpath("//option[@value='-100']"))
      let selectedText = await selectedCategory.getText()

      assert.strictEqual(title, "");
      assert.strictEqual(isbn, "");
      assert.strictEqual(author, "");
      assert.strictEqual(publisher, "");
      assert.strictEqual(selectedText, "Select category");

    })

    it("Verify if user is able to add new book with filled-in forms and selected category", async () => {

      // Title
      await fillInForm("title" ,"The Battle of the Labyrinth")

      // ISBN
      await fillInForm("isbn" ,"6")

      // Author
      await fillInForm("author" ,"Rick Riordan")

      // Publisher
      await fillInForm("publisher" ,"Manila Times")

      // Category
      let addCategory = await driver.findElement(By.xpath("//select[@id='category']"))

      // Create instance of Select
      const addSelectCategory = new Select(addCategory)
      await addSelectCategory.selectByVisibleText("Fiction")

      await addItButton()

      // Assert
      let successMessage = await driver.wait(until.elementLocated(By.id("successmessage")), 5000)
      await driver.wait(until.elementIsVisible(successMessage), 5000)
      let validationMessage = await driver.findElement(By.id("successmessage"))

      assert.strictEqual(await validationMessage.getText(), "Successfully add new book!")

      await okButtonValidation("okMessageSuccess")

    })

  })

  // describe("Test add functionality with correct credentials or information details", async () => {
    
  // })

})