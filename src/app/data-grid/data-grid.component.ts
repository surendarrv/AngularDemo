import { Component, OnInit, OnDestroy } from '@angular/core';
import { CollectionView } from '@grapecity/wijmo';

interface DataItem {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  startDate: Date;
  status: string;
  comments?: Comment[];
}

interface Comment {
  id: string;
  text: string;
  timestamp: Date;
  attachments?: string[];
}

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit, OnDestroy {
  data: CollectionView;
  selectedIds: string = '';
  selectedRowIds: Set<number> = new Set();
  displayedData: DataItem[] = [];
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 0;
  isLoading: boolean = false;
  
  // Comment modal properties
  showCommentModal: boolean = false;
  showViewCommentsModal: boolean = false;
  selectedItem: DataItem | null = null;
  newComment: string = '';
  selectedFiles: File[] = [];
  
  // Dropdown properties
  showDropdown: boolean = false;
  dropdownRowId: number | null = null;
  
  // Test code viewer properties
  showTestCodeModal: boolean = false;
  selectedTestLanguage: string = 'java';
  
  // Salary editing properties
  editingSalaryId: number | null = null;
  editingSalary: number = 0;
  updatedSalaryIds: Set<number> = new Set();
  
  // Code display modals
  showESQLModal: boolean = false;
  showMainframeModal: boolean = false;
  selectedEmployeeForCode: DataItem | null = null;

  constructor() {
    this.data = new CollectionView(this.generateSyntheticData());
    this.totalPages = Math.ceil(this.data.items.length / this.pageSize);
    this.loadMoreData();
  }

  ngOnInit(): void {
    // Add scroll event listener
    window.addEventListener('scroll', this.onScroll.bind(this));
    // Load comments from localStorage
    this.loadCommentsFromStorage();
  }

  ngOnDestroy(): void {
    // Remove scroll event listener
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  private generateSyntheticData(): DataItem[] {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Legal'];
    const positions = ['Manager', 'Senior Developer', 'Developer', 'Analyst', 'Coordinator', 'Specialist', 'Director', 'Assistant'];
    const statuses = ['Active', 'Inactive', 'Pending', 'On Leave'];
    const names = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma', 'Chris', 'Anna'];
    const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    const data: DataItem[] = [];
    
    for (let i = 1; i <= 1000; i++) {
      const firstName = names[Math.floor(Math.random() * names.length)];
      const lastName = surnames[Math.floor(Math.random() * surnames.length)];
      
      data.push({
        id: i,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        department: departments[Math.floor(Math.random() * departments.length)],
        position: positions[Math.floor(Math.random() * positions.length)],
        salary: Math.floor(Math.random() * 100000) + 30000,
        startDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
    
    return data;
  }

  onRowSelect(item: DataItem, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    
    if (checkbox.checked) {
      // Add to selected rows
      this.selectedRowIds.add(item.id);
    } else {
      // Remove from selected rows
      this.selectedRowIds.delete(item.id);
    }
    
    // Update the display string
    this.updateSelectedIdsDisplay();
  }

  private updateSelectedIdsDisplay(): void {
    if (this.selectedRowIds.size === 0) {
      this.selectedIds = '';
    } else {
      this.selectedIds = Array.from(this.selectedRowIds).sort((a, b) => a - b).join(', ');
    }
  }

  isRowSelected(item: DataItem): boolean {
    return this.selectedRowIds.has(item.id);
  }

  onScroll(): void {
    if (this.isLoading || this.currentPage >= this.totalPages) {
      return;
    }

    // Check if user has scrolled to bottom of page
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Load more data when user is near the bottom (within 100px)
    if (scrollTop + windowHeight >= documentHeight - 100) {
      this.loadMoreData();
    }
  }

  loadMoreData(): void {
    if (this.isLoading || this.currentPage > this.totalPages) {
      return;
    }

    this.isLoading = true;
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      const newData = this.data.items.slice(startIndex, endIndex);
      
      this.displayedData = [...this.displayedData, ...newData];
      this.currentPage++;
      this.isLoading = false;
    }, 800); // Increased delay to show loading animation
  }

  getLoadingProgress(): number {
    if (!this.isLoading) return 0;
    const totalRecords = this.data.items.length;
    const loadedRecords = this.displayedData.length;
    return Math.min((loadedRecords / totalRecords) * 100, 100);
  }

  exportToExcel(): void {
    // Simple CSV export
    const csvContent = this.generateCSV();
    this.downloadFile(csvContent, 'data-grid.csv', 'text/csv');
  }

  exportToPdf(): void {
    // Simple text export as PDF alternative
    const textContent = this.generateText();
    this.downloadFile(textContent, 'data-grid.txt', 'text/plain');
  }

  private generateCSV(): string {
    const headers = ['ID', 'Name', 'Email', 'Department', 'Position', 'Salary', 'Start Date', 'Status'];
    const csvRows = [headers.join(',')];
    
    this.data.items.forEach(item => {
      const row = [
        item.id,
        `"${item.name}"`,
        `"${item.email}"`,
        `"${item.department}"`,
        `"${item.position}"`,
        item.salary,
        item.startDate.toLocaleDateString(),
        `"${item.status}"`
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  private generateText(): string {
    let text = 'Data Grid Export\n';
    text += '================\n\n';
    
    this.data.items.forEach(item => {
      text += `ID: ${item.id}\n`;
      text += `Name: ${item.name}\n`;
      text += `Email: ${item.email}\n`;
      text += `Department: ${item.department}\n`;
      text += `Position: ${item.position}\n`;
      text += `Salary: $${item.salary.toLocaleString()}\n`;
      text += `Start Date: ${item.startDate.toLocaleDateString()}\n`;
      text += `Status: ${item.status}\n`;
      text += '---\n';
    });
    
    return text;
  }

  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Comment functionality
  openCommentModal(item: DataItem): void {
    this.selectedItem = item;
    this.showCommentModal = true;
    this.newComment = '';
    this.selectedFiles = [];
  }

  closeCommentModal(): void {
    this.showCommentModal = false;
    this.selectedItem = null;
    this.newComment = '';
    this.selectedFiles = [];
  }

  // View Comments functionality
  viewComments(item: DataItem): void {
    this.selectedItem = item;
    this.showViewCommentsModal = true;
    this.closeDropdown();
  }

  closeViewCommentsModal(): void {
    this.showViewCommentsModal = false;
    this.selectedItem = null;
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  submitComment(): void {
    if (!this.selectedItem || !this.newComment.trim()) {
      return;
    }

    const comment: Comment = {
      id: this.generateCommentId(),
      text: this.newComment.trim(),
      timestamp: new Date(),
      attachments: this.selectedFiles.map(file => file.name)
    };

    // Initialize comments array if it doesn't exist
    if (!this.selectedItem.comments) {
      this.selectedItem.comments = [];
    }

    // Add comment to the item
    this.selectedItem.comments.push(comment);

    // Update the displayed data
    const index = this.displayedData.findIndex(item => item.id === this.selectedItem!.id);
    if (index !== -1) {
      this.displayedData[index] = { ...this.selectedItem };
    }

    // Update the main data source
    const mainIndex = this.data.items.findIndex(item => item.id === this.selectedItem!.id);
    if (mainIndex !== -1) {
      this.data.items[mainIndex] = { ...this.selectedItem };
    }

    // Save to localStorage for persistence
    this.saveCommentsToStorage();

    this.closeCommentModal();
  }

  getCommentCount(item: DataItem): number {
    return item.comments ? item.comments.length : 0;
  }

  getLatestComment(item: DataItem): string {
    if (!item.comments || item.comments.length === 0) {
      return 'No comments';
    }
    const latest = item.comments[item.comments.length - 1];
    return latest.text.length > 50 ? latest.text.substring(0, 50) + '...' : latest.text;
  }

  private generateCommentId(): string {
    return 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private saveCommentsToStorage(): void {
    const commentsData = this.data.items.map(item => ({
      id: item.id,
      comments: item.comments || []
    }));
    localStorage.setItem('gridComments', JSON.stringify(commentsData));
  }

  private loadCommentsFromStorage(): void {
    const stored = localStorage.getItem('gridComments');
    if (stored) {
      try {
        const commentsData = JSON.parse(stored);
        this.data.items.forEach(item => {
          const storedItem = commentsData.find((c: any) => c.id === item.id);
          if (storedItem) {
            item.comments = storedItem.comments.map((comment: any) => ({
              ...comment,
              timestamp: new Date(comment.timestamp)
            }));
          }
        });
      } catch (error) {
        console.error('Error loading comments from storage:', error);
      }
    }
  }

  // Dropdown functionality
  toggleDropdown(event: Event, rowId: number): void {
    event.stopPropagation();
    
    if (this.dropdownRowId === rowId && this.showDropdown) {
      this.closeDropdown();
    } else {
      this.dropdownRowId = rowId;
      this.showDropdown = true;
    }
  }

  closeDropdown(): void {
    this.showDropdown = false;
    this.dropdownRowId = null;
  }

  onActionClick(action: string, item: DataItem): void {
    console.log(`Action ${action} clicked for item:`, item.name);
    
    // Handle different actions
    switch (action) {
      case 'A':
        this.handleActionA(item);
        break;
      case 'B':
        this.handleActionB(item);
        break;
      case 'C':
        this.handleActionC(item);
        break;
    }
    
    this.closeDropdown();
  }

  private handleActionA(item: DataItem): void {
    alert(`Action A executed for ${item.name} (${item.department})`);
    // Add your specific logic for Action A here
  }

  private handleActionB(item: DataItem): void {
    alert(`Action B executed for ${item.name} (${item.position})`);
    // Add your specific logic for Action B here
  }

  private handleActionC(item: DataItem): void {
    alert(`Action C executed for ${item.name} (ID: ${item.id})`);
    // Add your specific logic for Action C here
  }

  isDropdownOpen(rowId: number): boolean {
    return this.showDropdown && this.dropdownRowId === rowId;
  }

  // Test code viewer functionality
  openTestCodeModal(): void {
    this.showTestCodeModal = true;
  }

  closeTestCodeModal(): void {
    this.showTestCodeModal = false;
  }

  selectTestLanguage(language: string): void {
    this.selectedTestLanguage = language;
  }

  getTestCode(): string {
    if (this.selectedTestLanguage === 'java') {
      return this.getJavaTestCode();
    } else if (this.selectedTestLanguage === 'python') {
      return this.getPythonTestCode();
    } else if (this.selectedTestLanguage === 'javascript') {
      return this.getJavaScriptTestCode();
    }
    return '';
  }

  private getJavaTestCode(): string {
    return `package com.datagrid.tests;

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

public class DataGridTestSuite {
    private WebDriver driver;
    private WebDriverWait wait;
    private static final String BASE_URL = "http://localhost:4200";
    
    @BeforeClass
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.get(BASE_URL);
    }
    
    @Test(priority = 1)
    public void testApplicationLoads() {
        String title = driver.getTitle();
        Assert.assertEquals(title, "Data Grid");
        
        WebElement container = wait.until(ExpectedConditions
            .presenceOfElementLocated(By.className("data-grid-container")));
        Assert.assertTrue(container.isDisplayed());
    }
    
    @Test(priority = 2)
    public void testCheckboxSelection() {
        List<WebElement> rows = driver.findElements(By.cssSelector("tbody tr.data-row"));
        WebElement firstCheckbox = rows.get(0).findElement(By.cssSelector("input[type='checkbox']"));
        firstCheckbox.click();
        
        WebElement selectedDisplay = wait.until(ExpectedConditions
            .presenceOfElementLocated(By.className("selected-ids-display")));
        Assert.assertTrue(selectedDisplay.isDisplayed());
    }
    
    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}`;
  }

  private getPythonTestCode(): string {
    return `import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class DataGridTestSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.wait = WebDriverWait(cls.driver, 10)
        cls.driver.get("http://localhost:4200")
    
    def test_application_loads(self):
        title = self.driver.title
        self.assertEqual(title, "Data Grid")
        
        container = self.wait.until(EC.presence_of_element_located(
            (By.CLASS_NAME, "data-grid-container")))
        self.assertTrue(container.is_displayed())
    
    def test_checkbox_selection(self):
        rows = self.driver.find_elements(By.CSS_SELECTOR, "tbody tr.data-row")
        first_checkbox = rows[0].find_element(By.CSS_SELECTOR, "input[type='checkbox']")
        first_checkbox.click()
        
        selected_display = self.wait.until(EC.presence_of_element_located(
            (By.CLASS_NAME, "selected-ids-display")))
        self.assertTrue(selected_display.is_displayed())
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()`;
  }

  private getJavaScriptTestCode(): string {
    return `const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

class DataGridTestSuite {
    constructor() {
        this.driver = null;
        this.wait = null;
    }
    
    async setUp() {
        const options = new chrome.Options();
        options.addArguments('--start-maximized');
        
        this.driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        this.wait = new until.WebDriverWait(this.driver, 10000);
        await this.driver.get('http://localhost:4200');
    }
    
    async testApplicationLoads() {
        const title = await this.driver.getTitle();
        console.assert(title === 'Data Grid', 'Page title should be Data Grid');
        
        const container = await this.wait.until(
            until.elementLocated(By.className('data-grid-container')));
        const isDisplayed = await container.isDisplayed();
        console.assert(isDisplayed, 'Container should be displayed');
    }
    
    async testCheckboxSelection() {
        const rows = await this.driver.findElements(By.css('tbody tr.data-row'));
        const firstCheckbox = await rows[0].findElement(By.css('input[type="checkbox"]'));
        await firstCheckbox.click();
        
        const selectedDisplay = await this.wait.until(
            until.elementLocated(By.className('selected-ids-display')));
        const isDisplayed = await selectedDisplay.isDisplayed();
        console.assert(isDisplayed, 'Selected display should be visible');
    }
    
    async tearDown() {
        if (this.driver) {
            await this.driver.quit();
        }
    }
}

// Run tests
async function runTests() {
    const testSuite = new DataGridTestSuite();
    try {
        await testSuite.setUp();
        await testSuite.testApplicationLoads();
        await testSuite.testCheckboxSelection();
    } finally {
        await testSuite.tearDown();
    }
}

runTests();`;
  }

  copyTestCodeToClipboard(): void {
    const testCode = this.getTestCode();
    navigator.clipboard.writeText(testCode).then(() => {
      // You could add a toast notification here
      console.log('Test code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy test code: ', err);
    });
  }

  // Simple salary editing functionality
  startEdit(employeeId: number): void {
    this.editingSalaryId = employeeId;
    // Find the item and set the editing salary
    const item = this.data.items.find(d => d.id === employeeId);
    if (item) {
      this.editingSalary = item.salary;
    }
    console.log(`Started editing employee ${employeeId}`);
  }

  cancelEdit(): void {
    this.editingSalaryId = null;
    this.editingSalary = 0;
    console.log('Cancelled editing');
  }

  saveSalarySimple(item: DataItem): void {
    const salary = this.editingSalary;
    
    // Validation
    if (isNaN(salary)) {
      alert('Please enter a valid number');
      return;
    }
    
    if (salary % 1 !== 0) {
      alert('Error: Decimals are not allowed for salary values.');
      return;
    }

    if (salary > 200000) {
      alert('Error: Salary cannot exceed $200,000.');
      return;
    }

    if (salary < 0) {
      alert('Error: Salary cannot be negative.');
      return;
    }

    // Update the salary
    item.salary = salary;
    
    // Update displayed data
    const index = this.displayedData.findIndex(d => d.id === item.id);
    if (index !== -1) {
      this.displayedData[index] = { ...item };
    }

    // Update main data source
    const mainIndex = this.data.items.findIndex(d => d.id === item.id);
    if (mainIndex !== -1) {
      this.data.items[mainIndex] = { ...item };
    }

    // Mark as updated and show code icons
    this.updatedSalaryIds.add(item.id);
    this.selectedEmployeeForCode = item;
    
    // Close editing mode
    this.cancelEdit();
    
    // Show success message
    alert(`Salary updated successfully!\n\nAPI: v1/api/updatesalary\nRequest: {employeeId: ${item.id}, newSalary: ${salary}}\n\nESQL and Mainframe code generation icons are now available.`);
    
    // Mock backend service call
    this.mockBackendUpdate(item.id, salary);
  }

  hasUpdatedSalary(id: number): boolean {
    const hasUpdated = this.updatedSalaryIds.has(id);
    console.log(`Checking if employee ${id} has updated salary: ${hasUpdated}`);
    console.log('Updated salary IDs:', Array.from(this.updatedSalaryIds));
    return hasUpdated;
  }

  async saveSalary(item: DataItem): Promise<void> {
    console.log(`saveSalary called for employee ${item.id}, editingSalary: ${this.editingSalary}`);
    
    // Validation
    if (this.editingSalary % 1 !== 0) {
      alert('Error: Decimals are not allowed for salary values.');
      return;
    }

    if (this.editingSalary > 200000) {
      alert('Error: Salary cannot exceed $200,000.');
      return;
    }

    if (this.editingSalary < 0) {
      alert('Error: Salary cannot be negative.');
      return;
    }

    // Update the local data immediately
    console.log(`Updating salary for employee ${item.id} from ${item.salary} to ${this.editingSalary}`);
    item.salary = this.editingSalary;
    
    // Update displayed data
    const index = this.displayedData.findIndex(d => d.id === item.id);
    if (index !== -1) {
      this.displayedData[index] = { ...item };
      console.log(`Updated displayed data for employee ${item.id}, new salary: ${this.displayedData[index].salary}`);
    }

    // Update main data source
    const mainIndex = this.data.items.findIndex(d => d.id === item.id);
    if (mainIndex !== -1) {
      this.data.items[mainIndex] = { ...item };
      console.log(`Updated main data for employee ${item.id}, new salary: ${this.data.items[mainIndex].salary}`);
    }

    // Store the new salary before canceling edit mode
    const newSalary = this.editingSalary;
    
    // Mark as updated and show code icons immediately after save
    this.updatedSalaryIds.add(item.id);
    this.selectedEmployeeForCode = item;
    
    // Close editing mode
    this.cancelEdit();
    
    // Show success message with API information
    alert(`Salary updated successfully!\n\nAPI: v1/api/updatesalary\nRequest: {employeeId: ${item.id}, newSalary: ${newSalary}}\n\nESQL and Mainframe code generation icons are now available.`);
    
    // Mock backend service call (in background)
    this.mockBackendUpdate(item.id, newSalary);
  }

  // Mock backend service
  private async mockBackendUpdate(employeeId: number, newSalary: number): Promise<void> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      console.log(`Mock API Call: v1/api/updatesalary`);
      console.log(`Request: {employeeId: ${employeeId}, newSalary: ${newSalary}}`);
      console.log(`Response: 200 OK - Salary updated in EMP_SALARY table`);
      
      // In a real application, this would update the database
      // UPDATE EMP_SALARY SET SALARY = ${newSalary} WHERE EMP_ID = ${employeeId}
      
    } catch (error) {
      console.error('Mock API call failed:', error);
    }
  }

  // HTTP service for salary update
  private async updateSalaryAPI(employeeId: number, newSalary: number): Promise<boolean> {
    try {
      const response = await fetch('v1/api/updatesalary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: employeeId,
          newSalary: newSalary
        })
      });

      return response.status === 200;
    } catch (error) {
      console.error('API call failed:', error);
      return false;
    }
  }

  // Code display functionality
  showESQLCode(item: DataItem): void {
    this.selectedEmployeeForCode = item;
    this.showESQLModal = true;
  }

  showMainframeCode(item: DataItem): void {
    this.selectedEmployeeForCode = item;
    this.showMainframeModal = true;
  }

  closeESQLModal(): void {
    this.showESQLModal = false;
    this.selectedEmployeeForCode = null;
  }

  closeMainframeModal(): void {
    this.showMainframeModal = false;
    this.selectedEmployeeForCode = null;
  }

  getESQLCode(): string {
    if (!this.selectedEmployeeForCode) return '';
    
    return `-- ESQL Code for Update Salary API
-- Endpoint: v1/api/updatesalary
-- Employee ID: ${this.selectedEmployeeForCode.id}
-- New Salary: $${this.selectedEmployeeForCode.salary.toLocaleString()}
-- Table: EMP_SALARY

CREATE COMPUTE MODULE UpdateSalaryAPI
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        DECLARE employeeId INTEGER;
        DECLARE newSalary DECIMAL(10,2);
        DECLARE updateCount INTEGER;
        
        -- Get input parameters from API request
        SET employeeId = InputRoot.JSON.Data.employeeId;
        SET newSalary = InputRoot.JSON.Data.newSalary;
        
        -- Validate input parameters
        IF employeeId IS NULL OR newSalary IS NULL THEN
            SET OutputRoot.JSON.Data.error = 'Invalid input parameters';
            SET OutputRoot.JSON.Data.status = 'ERROR';
            RETURN FALSE;
        END IF;
        
        -- Validate salary constraints
        IF newSalary > 200000 THEN
            SET OutputRoot.JSON.Data.error = 'Salary cannot exceed $200,000';
            SET OutputRoot.JSON.Data.status = 'ERROR';
            RETURN FALSE;
        END IF;
        
        IF newSalary < 0 THEN
            SET OutputRoot.JSON.Data.error = 'Salary cannot be negative';
            SET OutputRoot.JSON.Data.status = 'ERROR';
            RETURN FALSE;
        END IF;
        
        -- Update salary in EMP_SALARY table
        UPDATE Database.EMP_SALARY 
        SET SALARY = newSalary,
            LAST_UPDATED = CURRENT_TIMESTAMP,
            UPDATED_BY = 'SYSTEM'
        WHERE EMP_ID = employeeId;
        
        -- Check if update was successful
        SET updateCount = ROW_COUNT;
        
        IF updateCount > 0 THEN
            SET OutputRoot.JSON.Data.status = 'SUCCESS';
            SET OutputRoot.JSON.Data.message = 'Salary updated successfully in EMP_SALARY table';
            SET OutputRoot.JSON.Data.employeeId = employeeId;
            SET OutputRoot.JSON.Data.newSalary = newSalary;
            SET OutputRoot.JSON.Data.rowsAffected = updateCount;
            RETURN TRUE;
        ELSE
            SET OutputRoot.JSON.Data.error = 'Employee not found in EMP_SALARY table';
            SET OutputRoot.JSON.Data.status = 'ERROR';
            RETURN FALSE;
        END IF;
    END;
END MODULE;

-- API Request Format:
-- POST v1/api/updatesalary
-- {
--   "employeeId": ${this.selectedEmployeeForCode.id},
--   "newSalary": ${this.selectedEmployeeForCode.salary}
-- }

-- API Response Format:
-- {
--   "status": "SUCCESS",
--   "message": "Salary updated successfully in EMP_SALARY table",
--   "employeeId": ${this.selectedEmployeeForCode.id},
--   "newSalary": ${this.selectedEmployeeForCode.salary},
--   "rowsAffected": 1
-- }`;
  }

  getMainframeCode(): string {
    if (!this.selectedEmployeeForCode) return '';
    
    return `// Mainframe BI Engine Code for Salary Update
// Employee ID: ${this.selectedEmployeeForCode.id}
// New Salary: $${this.selectedEmployeeForCode.salary.toLocaleString()}
// Table: EMP_SALARY
// API: v1/api/updatesalary

IDENTIFICATION DIVISION.
PROGRAM-ID. UPDATESAL.
AUTHOR. SYSTEM.
DATE-WRITTEN. ${new Date().toLocaleDateString()}.

ENVIRONMENT DIVISION.
INPUT-OUTPUT SECTION.
FILE-CONTROL.
    SELECT EMP-SALARY-FILE ASSIGN TO EMPDB
           ORGANIZATION IS INDEXED
           ACCESS MODE IS DYNAMIC
           RECORD KEY IS EMP-ID
           FILE STATUS IS WS-FILE-STATUS.

DATA DIVISION.
FILE SECTION.
FD  EMP-SALARY-FILE.
01  EMP-SALARY-RECORD.
    05  EMP-ID                PIC 9(8).
    05  EMP-NAME              PIC X(50).
    05  EMP-EMAIL             PIC X(100).
    05  EMP-DEPARTMENT        PIC X(30).
    05  EMP-POSITION          PIC X(30).
    05  EMP-SALARY            PIC 9(8)V99.
    05  EMP-START-DATE        PIC X(10).
    05  EMP-STATUS            PIC X(20).
    05  LAST-UPDATED          PIC X(26).
    05  UPDATED-BY            PIC X(10).

WORKING-STORAGE SECTION.
01  WS-FILE-STATUS            PIC XX.
01  WS-INPUT-DATA.
    05  WS-EMPLOYEE-ID        PIC 9(8) VALUE ${this.selectedEmployeeForCode.id}.
    05  WS-NEW-SALARY         PIC 9(8)V99 VALUE ${this.selectedEmployeeForCode.salary}.
01  WS-RESPONSE.
    05  WS-STATUS             PIC X(10).
    05  WS-MESSAGE            PIC X(100).
    05  WS-ERROR-CODE         PIC X(10).

PROCEDURE DIVISION.
MAIN-PARAGRAPH.
    PERFORM INITIALIZE-PROGRAM
    PERFORM VALIDATE-INPUT
    IF WS-STATUS = 'SUCCESS'
        PERFORM UPDATE-SALARY-IN-EMP-SALARY
    END-IF
    PERFORM DISPLAY-RESULT
    STOP RUN.

INITIALIZE-PROGRAM.
    MOVE 'INIT' TO WS-STATUS
    MOVE SPACES TO WS-MESSAGE
    MOVE SPACES TO WS-ERROR-CODE.

VALIDATE-INPUT.
    // Validate employee ID from API request
    IF WS-EMPLOYEE-ID = ZERO
        MOVE 'ERROR' TO WS-STATUS
        MOVE 'Invalid Employee ID' TO WS-MESSAGE
        EXIT PARAGRAPH
    END-IF
    
    // Validate salary constraints
    IF WS-NEW-SALARY > 200000
        MOVE 'ERROR' TO WS-STATUS
        MOVE 'Salary cannot exceed $200,000' TO WS-MESSAGE
        EXIT PARAGRAPH
    END-IF
    
    IF WS-NEW-SALARY < 0
        MOVE 'ERROR' TO WS-STATUS
        MOVE 'Salary cannot be negative' TO WS-MESSAGE
        EXIT PARAGRAPH
    END-IF
    
    MOVE 'SUCCESS' TO WS-STATUS.

UPDATE-SALARY-IN-EMP-SALARY.
    OPEN I-O EMP-SALARY-FILE
    IF WS-FILE-STATUS NOT = '00'
        MOVE 'ERROR' TO WS-STATUS
        MOVE 'EMP_SALARY database connection failed' TO WS-MESSAGE
        EXIT PARAGRAPH
    END-IF
    
    MOVE WS-EMPLOYEE-ID TO EMP-ID
    READ EMP-SALARY-FILE
    IF WS-FILE-STATUS = '00'
        // Update salary in EMP_SALARY table
        MOVE WS-NEW-SALARY TO EMP-SALARY
        MOVE FUNCTION CURRENT-DATE TO LAST-UPDATED
        MOVE 'SYSTEM' TO UPDATED-BY
        REWRITE EMP-SALARY-RECORD
        IF WS-FILE-STATUS = '00'
            MOVE 'SUCCESS' TO WS-STATUS
            MOVE 'Salary updated successfully in EMP_SALARY table' TO WS-MESSAGE
        ELSE
            MOVE 'ERROR' TO WS-STATUS
            MOVE 'Failed to update salary in EMP_SALARY table' TO WS-MESSAGE
        END-IF
    ELSE
        MOVE 'ERROR' TO WS-STATUS
        MOVE 'Employee not found in EMP_SALARY table' TO WS-MESSAGE
    END-IF
    
    CLOSE EMP-SALARY-FILE.

DISPLAY-RESULT.
    DISPLAY 'API: v1/api/updatesalary'
    DISPLAY 'Table: EMP_SALARY'
    DISPLAY 'Status: ' WS-STATUS
    DISPLAY 'Message: ' WS-MESSAGE
    IF WS-STATUS = 'SUCCESS'
        DISPLAY 'Employee ID: ' WS-EMPLOYEE-ID
        DISPLAY 'New Salary: $' WS-NEW-SALARY
        DISPLAY 'Updated in EMP_SALARY table successfully'
    END-IF.

// API Request Format:
// POST v1/api/updatesalary
// {
//   "employeeId": ${this.selectedEmployeeForCode.id},
//   "newSalary": ${this.selectedEmployeeForCode.salary}
// }

// Database Update:
// UPDATE EMP_SALARY 
// SET SALARY = ${this.selectedEmployeeForCode.salary},
//     LAST_UPDATED = CURRENT_TIMESTAMP,
//     UPDATED_BY = 'SYSTEM'
// WHERE EMP_ID = ${this.selectedEmployeeForCode.id};`;
  }

  copyESQLCodeToClipboard(): void {
    const esqlCode = this.getESQLCode();
    navigator.clipboard.writeText(esqlCode).then(() => {
      console.log('ESQL code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy ESQL code: ', err);
    });
  }

  copyMainframeCodeToClipboard(): void {
    const mainframeCode = this.getMainframeCode();
    navigator.clipboard.writeText(mainframeCode).then(() => {
      console.log('Mainframe code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy Mainframe code: ', err);
    });
  }
}
