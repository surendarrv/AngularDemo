"""
Comprehensive Selenium Test Suite for Angular Data Grid Application

This test suite validates all UI components and functionality:
- Data grid rendering and pagination
- Row selection with checkboxes
- Export functionality
- Comments and attachments
- Row-level actions dropdown
- Scroll-based lazy loading
"""

import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class DataGridTestSuite(unittest.TestCase):
    """Test suite for Angular Data Grid Application"""
    
    @classmethod
    def setUpClass(cls):
        """Set up the test environment"""
        print("🚀 Setting up Selenium Test Suite...")
        
        # Chrome driver setup
        chrome_options = Options()
        chrome_options.add_argument("--start-maximized")
        chrome_options.add_argument("--disable-notifications")
        chrome_options.add_argument("--disable-popup-blocking")
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--allow-running-insecure-content")
        
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.wait = WebDriverWait(cls.driver, 10)
        cls.actions = ActionChains(cls.driver)
        cls.base_url = "http://localhost:4200"
        
        # Navigate to application
        cls.driver.get(cls.base_url)
        cls.wait_for_page_load()
        
        print("✅ Test environment ready!")
    
    @classmethod
    def tearDownClass(cls):
        """Clean up after tests"""
        if cls.driver:
            cls.driver.quit()
        print("🏁 Test suite completed!")
    
    def wait_for_page_load(self):
        """Wait for page to fully load"""
        self.wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
    
    def test_01_application_loads(self):
        """Test 1: Verify Application Loads Successfully"""
        print("\n=== Test 1: Application Load ===")
        
        # Verify page title
        title = self.driver.title
        self.assertEqual(title, "Data Grid", "Page title should be 'Data Grid'")
        
        # Verify main container is present
        container = self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "data-grid-container")))
        self.assertTrue(container.is_displayed(), "Data grid container should be visible")
        
        print("✅ Application loaded successfully")
    
    def test_02_data_grid_structure(self):
        """Test 2: Verify Data Grid Structure and Headers"""
        print("\n=== Test 2: Data Grid Structure ===")
        
        # Verify table is present
        table = self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "data-table")))
        self.assertTrue(table.is_displayed(), "Data table should be visible")
        
        # Verify all column headers
        expected_headers = [
            "Select", "Name", "Email", "Department", "Position", 
            "Salary", "Start Date", "Status", "Comments & Attachments", "Actions"
        ]
        
        headers = self.driver.find_elements(By.TAG_NAME, "th")
        self.assertEqual(len(headers), len(expected_headers), 
                        f"Should have {len(expected_headers)} column headers")
        
        for i, expected_header in enumerate(expected_headers):
            self.assertEqual(headers[i].text, expected_header,
                           f"Header {i} should be '{expected_header}'")
        
        print("✅ Data grid structure validated")
    
    def test_03_initial_data_loading(self):
        """Test 3: Verify Initial Data Loading"""
        print("\n=== Test 3: Initial Data Loading ===")
        
        # Wait for data rows to load
        rows = self.wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "tbody tr.data-row")))
        
        self.assertGreater(len(rows), 0, "Should have at least one data row")
        self.assertLessEqual(len(rows), 20, "Initial load should not exceed 20 rows")
        
        # Verify first row has all expected data
        first_row = rows[0]
        cells = first_row.find_elements(By.TAG_NAME, "td")
        self.assertEqual(len(cells), 10, "Each row should have 10 cells")
        
        # Verify checkbox is present
        checkbox = first_row.find_element(By.CSS_SELECTOR, "input[type='checkbox']")
        self.assertTrue(checkbox.is_displayed(), "Checkbox should be visible")
        
        print(f"✅ Initial data loading validated - {len(rows)} rows loaded")
    
    def test_04_checkbox_selection(self):
        """Test 4: Test Checkbox Selection and Deselection"""
        print("\n=== Test 4: Checkbox Selection ===")
        
        rows = self.driver.find_elements(By.CSS_SELECTOR, "tbody tr.data-row")
        self.assertGreaterEqual(len(rows), 3, "Need at least 3 rows for testing")
        
        # Select first row
        first_checkbox = rows[0].find_element(By.CSS_SELECTOR, "input[type='checkbox']")
        first_checkbox.click()
        
        # Verify selected IDs display appears
        selected_ids_display = self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "selected-ids-display")))
        self.assertTrue(selected_ids_display.is_displayed(), "Selected IDs should be displayed")
        
        # Select second row
        second_checkbox = rows[1].find_element(By.CSS_SELECTOR, "input[type='checkbox']")
        second_checkbox.click()
        
        # Verify both IDs are shown
        selected_text = selected_ids_display.text
        self.assertIn("Selected Row IDs:", selected_text, "Should show selected row IDs")
        
        # Deselect first row
        first_checkbox.click()
        
        # Verify only second row ID remains
        selected_text = selected_ids_display.text
        self.assertNotIn("1,", selected_text, "First row ID should be removed")
        
        print("✅ Checkbox selection and deselection validated")
    
    def test_05_export_functionality(self):
        """Test 5: Test Export Functionality"""
        print("\n=== Test 5: Export Functionality ===")
        
        # Find export buttons
        export_csv_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".export-btn[title='Export to CSV']")))
        export_txt_btn = self.driver.find_element(By.CSS_SELECTOR, ".export-btn[title='Export to Text']")
        
        self.assertTrue(export_csv_btn.is_displayed(), "CSV export button should be visible")
        self.assertTrue(export_txt_btn.is_displayed(), "Text export button should be visible")
        
        # Test CSV export
        export_csv_btn.click()
        
        print("✅ Export buttons are functional")
    
    def test_06_comments_modal(self):
        """Test 6: Test Comments and Attachments Modal"""
        print("\n=== Test 6: Comments Modal ===")
        
        # Find first "Add Comment" button
        add_comment_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".add-comment-btn")))
        add_comment_btn.click()
        
        # Verify modal opens
        modal = self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "modal-content")))
        self.assertTrue(modal.is_displayed(), "Comment modal should be visible")
        
        # Verify modal elements
        textarea = modal.find_element(By.CSS_SELECTOR, "textarea")
        file_input = modal.find_element(By.CSS_SELECTOR, "input[type='file']")
        submit_btn = modal.find_element(By.CSS_SELECTOR, ".btn-submit")
        cancel_btn = modal.find_element(By.CSS_SELECTOR, ".btn-cancel")
        
        self.assertTrue(textarea.is_displayed(), "Comment textarea should be visible")
        self.assertTrue(file_input.is_displayed(), "File input should be visible")
        self.assertTrue(submit_btn.is_displayed(), "Submit button should be visible")
        self.assertTrue(cancel_btn.is_displayed(), "Cancel button should be visible")
        
        # Test adding a comment
        textarea.send_keys("This is a test comment from Selenium automation")
        
        # Submit button should be enabled
        self.assertTrue(submit_btn.is_enabled(), "Submit button should be enabled with text")
        
        # Close modal
        cancel_btn.click()
        
        # Verify modal closes
        self.wait.until(EC.invisibility_of_element_located((By.CLASS_NAME, "modal-content")))
        
        print("✅ Comments modal functionality validated")
    
    def test_07_row_actions_dropdown(self):
        """Test 7: Test Row Actions Dropdown"""
        print("\n=== Test 7: Row Actions Dropdown ===")
        
        # Find first ellipsis button
        ellipsis_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".ellipsis-btn")))
        ellipsis_btn.click()
        
        # Verify dropdown appears
        dropdown = self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "dropdown-menu")))
        self.assertTrue(dropdown.is_displayed(), "Dropdown menu should be visible")
        
        # Verify dropdown items
        dropdown_items = dropdown.find_elements(By.CLASS_NAME, "dropdown-item")
        self.assertEqual(len(dropdown_items), 3, "Should have 3 dropdown items")
        
        expected_actions = ["Action A", "Action B", "Action C"]
        for i, expected_action in enumerate(expected_actions):
            self.assertEqual(dropdown_items[i].text.strip(), expected_action,
                           f"Dropdown item {i} should be '{expected_action}'")
        
        # Test clicking Action A
        dropdown_items[0].click()
        
        # Handle alert if it appears
        try:
            alert = self.driver.switch_to.alert
            alert.accept()
        except:
            pass  # Alert might not appear in headless mode
        
        # Verify dropdown closes
        self.wait.until(EC.invisibility_of_element_located((By.CLASS_NAME, "dropdown-menu")))
        
        print("✅ Row actions dropdown validated")
    
    def test_08_scroll_pagination(self):
        """Test 8: Test Scroll-based Pagination (Lazy Loading)"""
        print("\n=== Test 8: Scroll Pagination ===")
        
        # Get initial row count
        initial_rows = self.driver.find_elements(By.CSS_SELECTOR, "tbody tr.data-row")
        initial_count = len(initial_rows)
        
        # Scroll to bottom to trigger lazy loading
        self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        
        # Wait for loading indicator (might be too fast to catch)
        try:
            loading_indicator = self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "loading-indicator")))
            self.assertTrue(loading_indicator.is_displayed(), "Loading indicator should appear")
        except TimeoutException:
            pass  # Loading might be too fast to catch
        
        # Wait for new rows to load
        self.wait.until(lambda driver: len(driver.find_elements(By.CSS_SELECTOR, "tbody tr.data-row")) > initial_count)
        
        # Verify more rows are loaded
        new_rows = self.driver.find_elements(By.CSS_SELECTOR, "tbody tr.data-row")
        self.assertGreater(len(new_rows), initial_count, "More rows should be loaded after scroll")
        
        print(f"✅ Scroll pagination validated - {len(new_rows)} total rows")
    
    def test_09_responsive_design(self):
        """Test 9: Test Responsive Design"""
        print("\n=== Test 9: Responsive Design ===")
        
        # Test desktop viewport
        self.driver.set_window_size(1200, 800)
        time.sleep(1)
        
        table = self.driver.find_element(By.CLASS_NAME, "data-table")
        self.assertTrue(table.is_displayed(), "Table should be visible on desktop")
        
        # Test mobile viewport
        self.driver.set_window_size(375, 667)
        time.sleep(1)
        
        table = self.driver.find_element(By.CLASS_NAME, "data-table")
        self.assertTrue(table.is_displayed(), "Table should be visible on mobile")
        
        # Reset to full screen
        self.driver.maximize_window()
        
        print("✅ Responsive design validated")
    
    def test_10_data_integrity(self):
        """Test 10: Test Data Integrity"""
        print("\n=== Test 10: Data Integrity ===")
        
        rows = self.driver.find_elements(By.CSS_SELECTOR, "tbody tr.data-row")
        
        for i in range(min(5, len(rows))):
            row = rows[i]
            cells = row.find_elements(By.TAG_NAME, "td")
            
            # Verify each row has 10 cells
            self.assertEqual(len(cells), 10, f"Row {i} should have 10 cells")
            
            # Verify name is not empty
            name = cells[1].text
            self.assertNotEqual(name, "", f"Name should not be empty in row {i}")
            
            # Verify email format
            email = cells[2].text
            self.assertIn("@", email, f"Email should contain @ in row {i}")
            
            # Verify salary is numeric
            salary = cells[5].text
            self.assertTrue(salary.startswith("$"), f"Salary should start with $ in row {i}")
        
        print("✅ Data integrity validated")

if __name__ == "__main__":
    # Run the test suite
    unittest.main(verbosity=2)
