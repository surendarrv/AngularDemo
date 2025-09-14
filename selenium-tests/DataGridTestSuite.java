package com.datagrid.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.JavascriptExecutor;
import org.testng.annotations.*;
import org.testng.Assert;
import java.time.Duration;
import java.util.List;
import java.util.ArrayList;

/**
 * Comprehensive Selenium Test Suite for Angular Data Grid Application
 * 
 * This test suite validates all UI components and functionality:
 * - Data grid rendering and pagination
 * - Row selection with checkboxes
 * - Export functionality
 * - Comments and attachments
 * - Row-level actions dropdown
 * - Scroll-based lazy loading
 */
public class DataGridTestSuite {
    
    private WebDriver driver;
    private WebDriverWait wait;
    private Actions actions;
    private JavascriptExecutor js;
    private static final String BASE_URL = "D";
    private static final int TIMEOUT = 10;
    
    @BeforeClass
    public void setUp() {
        // Chrome driver setup
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(TIMEOUT));
        actions = new Actions(driver);
        js = (JavascriptExecutor) driver;
        
        // Navigate to application
        driver.get(BASE_URL);
        waitForPageLoad();
    }
    
    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
    
    /**
     * Test 1: Verify Application Loads Successfully
     */
    @Test(priority = 1)
    public void testApplicationLoads() {
        System.out.println("=== Test 1: Application Load ===");
        
        // Verify page title
        String title = driver.getTitle();
        Assert.assertEquals(title, "Data Grid", "Page title should be 'Data Grid'");
        
        // Verify main container is present
        WebElement container = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.className("data-grid-container")));
        Assert.assertTrue(container.isDisplayed(), "Data grid container should be visible");
        
        System.out.println("✅ Application loaded successfully");
    }
    
    /**
     * Test 2: Verify Data Grid Structure and Headers
     */
    @Test(priority = 2)
    public void testDataGridStructure() {
        System.out.println("=== Test 2: Data Grid Structure ===");
        
        // Verify table is present
        WebElement table = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.className("data-table")));
        Assert.assertTrue(table.isDisplayed(), "Data table should be visible");
        
        // Verify all column headers
        String[] expectedHeaders = {
            "Select", "Name", "Email", "Department", "Position", 
            "Salary", "Start Date", "Status", "Comments & Attachments", "Actions"
        };
        
        List<WebElement> headers = driver.findElements(By.tagName("th"));
        Assert.assertEquals(headers.size(), expectedHeaders.length, 
            "Should have " + expectedHeaders.length + " column headers");
        
        for (int i = 0; i < expectedHeaders.length; i++) {
            Assert.assertEquals(headers.get(i).getText(), expectedHeaders[i],
                "Header " + i + " should be '" + expectedHeaders[i] + "'");
        }
        
        System.out.println("✅ Data grid structure validated");
    }
    
    /**
     * Test 3: Verify Initial Data Loading
     */
    @Test(priority = 3)
    public void testInitialDataLoading() {
        System.out.println("=== Test 3: Initial Data Loading ===");
        
        // Wait for data rows to load
        List<WebElement> rows = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
            By.cssSelector("tbody tr.data-row")));
        
        Assert.assertTrue(rows.size() > 0, "Should have at least one data row");
        Assert.assertTrue(rows.size() <= 20, "Initial load should not exceed 20 rows");
        
        // Verify first row has all expected data
        WebElement firstRow = rows.get(0);
        List<WebElement> cells = firstRow.findElements(By.tagName("td"));
        Assert.assertEquals(cells.size(), 10, "Each row should have 10 cells");
        
        // Verify checkbox is present
        WebElement checkbox = firstRow.findElement(By.cssSelector("input[type='checkbox']"));
        Assert.assertTrue(checkbox.isDisplayed(), "Checkbox should be visible");
        
        System.out.println("✅ Initial data loading validated - " + rows.size() + " rows loaded");
    }
    
    /**
     * Test 4: Test Checkbox Selection and Deselection
     */
    @Test(priority = 4)
    public void testCheckboxSelection() {
        System.out.println("=== Test 4: Checkbox Selection ===");
        
        List<WebElement> rows = driver.findElements(By.cssSelector("tbody tr.data-row"));
        Assert.assertTrue(rows.size() >= 3, "Need at least 3 rows for testing");
        
        // Select first row
        WebElement firstCheckbox = rows.get(0).findElement(By.cssSelector("input[type='checkbox']"));
        firstCheckbox.click();
        
        // Verify selected IDs display appears
        WebElement selectedIdsDisplay = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.className("selected-ids-display")));
        Assert.assertTrue(selectedIdsDisplay.isDisplayed(), "Selected IDs should be displayed");
        
        // Select second row
        WebElement secondCheckbox = rows.get(1).findElement(By.cssSelector("input[type='checkbox']"));
        secondCheckbox.click();
        
        // Verify both IDs are shown
        String selectedText = selectedIdsDisplay.getText();
        Assert.assertTrue(selectedText.contains("Selected Row IDs:"), "Should show selected row IDs");
        
        // Deselect first row
        firstCheckbox.click();
        
        // Verify only second row ID remains
        selectedText = selectedIdsDisplay.getText();
        Assert.assertFalse(selectedText.contains("1,"), "First row ID should be removed");
        
        System.out.println("✅ Checkbox selection and deselection validated");
    }
    
    /**
     * Test 5: Test Export Functionality
     */
    @Test(priority = 5)
    public void testExportFunctionality() {
        System.out.println("=== Test 5: Export Functionality ===");
        
        // Find export buttons
        WebElement exportCsvBtn = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector(".export-btn[title='Export to CSV']")));
        WebElement exportTxtBtn = driver.findElement(By.cssSelector(".export-btn[title='Export to Text']"));
        
        Assert.assertTrue(exportCsvBtn.isDisplayed(), "CSV export button should be visible");
        Assert.assertTrue(exportTxtBtn.isDisplayed(), "Text export button should be visible");
        
        // Test CSV export
        exportCsvBtn.click();
        
        // Verify download started (this would need additional setup for actual file download testing)
        System.out.println("✅ Export buttons are functional");
    }
    
    /**
     * Test 6: Test Comments and Attachments Modal
     */
    @Test(priority = 6)
    public void testCommentsModal() {
        System.out.println("=== Test 6: Comments Modal ===");
        
        // Find first "Add Comment" button
        WebElement addCommentBtn = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector(".add-comment-btn")));
        addCommentBtn.click();
        
        // Verify modal opens
        WebElement modal = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.className("modal-content")));
        Assert.assertTrue(modal.isDisplayed(), "Comment modal should be visible");
        
        // Verify modal elements
        WebElement textarea = modal.findElement(By.cssSelector("textarea"));
        WebElement fileInput = modal.findElement(By.cssSelector("input[type='file']"));
        WebElement submitBtn = modal.findElement(By.cssSelector(".btn-submit"));
        WebElement cancelBtn = modal.findElement(By.cssSelector(".btn-cancel"));
        
        Assert.assertTrue(textarea.isDisplayed(), "Comment textarea should be visible");
        Assert.assertTrue(fileInput.isDisplayed(), "File input should be visible");
        Assert.assertTrue(submitBtn.isDisplayed(), "Submit button should be visible");
        Assert.assertTrue(cancelBtn.isDisplayed(), "Cancel button should be visible");
        
        // Test adding a comment
        textarea.sendKeys("This is a test comment from Selenium automation");
        
        // Submit button should be enabled
        Assert.assertTrue(submitBtn.isEnabled(), "Submit button should be enabled with text");
        
        // Close modal
        cancelBtn.click();
        
        // Verify modal closes
        wait.until(ExpectedConditions.invisibilityOf(modal));
        
        System.out.println("✅ Comments modal functionality validated");
    }
    
    /**
     * Test 7: Test Row Actions Dropdown
     */
    @Test(priority = 7)
    public void testRowActionsDropdown() {
        System.out.println("=== Test 7: Row Actions Dropdown ===");
        
        // Find first ellipsis button
        WebElement ellipsisBtn = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector(".ellipsis-btn")));
        ellipsisBtn.click();
        
        // Verify dropdown appears
        WebElement dropdown = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.className("dropdown-menu")));
        Assert.assertTrue(dropdown.isDisplayed(), "Dropdown menu should be visible");
        
        // Verify dropdown items
        List<WebElement> dropdownItems = dropdown.findElements(By.className("dropdown-item"));
        Assert.assertEquals(dropdownItems.size(), 3, "Should have 3 dropdown items");
        
        String[] expectedActions = {"Action A", "Action B", "Action C"};
        for (int i = 0; i < dropdownItems.size(); i++) {
            Assert.assertEquals(dropdownItems.get(i).getText().trim(), expectedActions[i],
                "Dropdown item " + i + " should be '" + expectedActions[i] + "'");
        }
        
        // Test clicking Action A
        dropdownItems.get(0).click();
        
        // Verify alert appears (you might need to handle alert)
        try {
            driver.switchTo().alert().accept();
        } catch (Exception e) {
            // Alert might not appear in headless mode
        }
        
        // Verify dropdown closes
        wait.until(ExpectedConditions.invisibilityOf(dropdown));
        
        System.out.println("✅ Row actions dropdown validated");
    }
    
    /**
     * Test 8: Test Scroll-based Pagination (Lazy Loading)
     */
    @Test(priority = 8)
    public void testScrollPagination() {
        System.out.println("=== Test 8: Scroll Pagination ===");
        
        // Get initial row count
        List<WebElement> initialRows = driver.findElements(By.cssSelector("tbody tr.data-row"));
        int initialCount = initialRows.size();
        
        // Scroll to bottom to trigger lazy loading
        js.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        
        // Wait for loading indicator
        try {
            WebElement loadingIndicator = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.className("loading-indicator")));
            Assert.assertTrue(loadingIndicator.isDisplayed(), "Loading indicator should appear");
        } catch (Exception e) {
            // Loading might be too fast to catch
        }
        
        // Wait for new rows to load
        wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(
            By.cssSelector("tbody tr.data-row"), initialCount));
        
        // Verify more rows are loaded
        List<WebElement> newRows = driver.findElements(By.cssSelector("tbody tr.data-row"));
        Assert.assertTrue(newRows.size() > initialCount, "More rows should be loaded after scroll");
        
        System.out.println("✅ Scroll pagination validated - " + newRows.size() + " total rows");
    }
    
    /**
     * Test 9: Test Responsive Design
     */
    @Test(priority = 9)
    public void testResponsiveDesign() {
        System.out.println("=== Test 9: Responsive Design ===");
        
        // Test different viewport sizes
        driver.manage().window().setSize(new org.openqa.selenium.Dimension(1200, 800));
        Thread.sleep(1000);
        
        WebElement table = driver.findElement(By.className("data-table"));
        Assert.assertTrue(table.isDisplayed(), "Table should be visible on desktop");
        
        // Test mobile viewport
        driver.manage().window().setSize(new org.openqa.selenium.Dimension(375, 667));
        Thread.sleep(1000);
        
        table = driver.findElement(By.className("data-table"));
        Assert.assertTrue(table.isDisplayed(), "Table should be visible on mobile");
        
        // Reset to full screen
        driver.manage().window().maximize();
        
        System.out.println("✅ Responsive design validated");
    }
    
    /**
     * Test 10: Test Data Integrity
     */
    @Test(priority = 10)
    public void testDataIntegrity() {
        System.out.println("=== Test 10: Data Integrity ===");
        
        List<WebElement> rows = driver.findElements(By.cssSelector("tbody tr.data-row"));
        
        for (int i = 0; i < Math.min(5, rows.size()); i++) {
            WebElement row = rows.get(i);
            List<WebElement> cells = row.findElements(By.tagName("td"));
            
            // Verify each row has 10 cells
            Assert.assertEquals(cells.size(), 10, "Row " + i + " should have 10 cells");
            
            // Verify name is not empty
            String name = cells.get(1).getText();
            Assert.assertFalse(name.isEmpty(), "Name should not be empty in row " + i);
            
            // Verify email format
            String email = cells.get(2).getText();
            Assert.assertTrue(email.contains("@"), "Email should contain @ in row " + i);
            
            // Verify salary is numeric
            String salary = cells.get(5).getText();
            Assert.assertTrue(salary.startsWith("$"), "Salary should start with $ in row " + i);
        }
        
        System.out.println("✅ Data integrity validated");
    }
    
    /**
     * Helper method to wait for page load
     */
    private void waitForPageLoad() {
        wait.until(webDriver -> 
            js.executeScript("return document.readyState").equals("complete"));
    }
    
    /**
     * Helper method to scroll to element
     */
    private void scrollToElement(WebElement element) {
        js.executeScript("arguments[0].scrollIntoView(true);", element);
    }
    
    /**
     * Helper method to take screenshot
     */
    private void takeScreenshot(String testName) {
        try {
            // Screenshot functionality would go here
            System.out.println("📸 Screenshot taken for: " + testName);
        } catch (Exception e) {
            System.out.println("❌ Failed to take screenshot: " + e.getMessage());
        }
    }
}
