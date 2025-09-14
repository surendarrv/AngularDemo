# Selenium Test Suite for Angular Data Grid Application

This directory contains comprehensive Selenium automation tests for the Angular Data Grid application.

## 📁 Test Files

- **`DataGridTestSuite.java`** - Complete Java/TestNG test suite
- **`data_grid_test_suite.py`** - Python unittest test suite  
- **`requirements.txt`** - Python dependencies
- **`pom.xml`** - Maven configuration for Java tests

## 🎯 Test Coverage

The test suite validates all major functionality:

### ✅ Core Features
- **Application Loading** - Verifies page loads correctly
- **Data Grid Structure** - Validates table headers and layout
- **Initial Data Loading** - Checks first 20 rows load properly
- **Checkbox Selection** - Tests select/deselect functionality
- **Export Functionality** - Validates CSV/Text export buttons
- **Comments Modal** - Tests comment and attachment features
- **Row Actions Dropdown** - Validates ellipsis menu (A, B, C actions)
- **Scroll Pagination** - Tests lazy loading on scroll
- **Responsive Design** - Validates mobile/desktop layouts
- **Data Integrity** - Verifies data format and completeness

## 🚀 Quick Start

### Java/TestNG Setup
```bash
# Prerequisites
- Java 11+
- Maven
- Chrome browser
- ChromeDriver in PATH

# Run tests
mvn clean test
```

### Python Setup
```bash
# Prerequisites  
- Python 3.7+
- Chrome browser
- ChromeDriver in PATH

# Install dependencies
pip install -r requirements.txt

# Run tests
python data_grid_test_suite.py
```

### JavaScript Setup
```bash
# Prerequisites
- Node.js
- Chrome browser  
- ChromeDriver in PATH

# Install dependencies
npm install selenium-webdriver

# Run tests
node test_suite.js
```

## 🔧 Configuration

### Chrome Driver Setup
1. Download ChromeDriver from [chromedriver.chromium.org](https://chromedriver.chromium.org/)
2. Add to system PATH
3. Ensure Chrome browser is installed

### Test Configuration
- **Base URL**: `http://localhost:4200`
- **Timeout**: 10 seconds
- **Browser**: Chrome (maximized)
- **Headless**: Can be enabled by adding `--headless` to Chrome options

## 📊 Test Reports

### Java/TestNG
- HTML reports generated in `target/surefire-reports/`
- Allure reports: `mvn allure:report`

### Python
- Console output with detailed results
- Can be extended with pytest-html for HTML reports

## 🎨 Test Features

### Visual Validation
- Screenshot capture on failures
- Element visibility checks
- Responsive design testing

### Data Validation
- Row count verification
- Data format validation
- Email format checking
- Salary format validation

### Interaction Testing
- Click events
- Form submissions
- Modal interactions
- Dropdown selections

## 🔍 Test Scenarios

### 1. Application Load Test
```java
@Test
public void testApplicationLoads() {
    String title = driver.getTitle();
    Assert.assertEquals(title, "Data Grid");
}
```

### 2. Checkbox Selection Test
```java
@Test  
public void testCheckboxSelection() {
    WebElement checkbox = driver.findElement(By.cssSelector("input[type='checkbox']"));
    checkbox.click();
    // Verify selection display appears
}
```

### 3. Modal Interaction Test
```java
@Test
public void testCommentsModal() {
    WebElement addCommentBtn = driver.findElement(By.cssSelector(".add-comment-btn"));
    addCommentBtn.click();
    // Verify modal opens and elements are present
}
```

## 🛠️ Customization

### Adding New Tests
1. Create new test method following naming convention
2. Add appropriate assertions
3. Include proper error handling
4. Update documentation

### Modifying Selectors
- Update CSS selectors in test methods
- Ensure selectors are stable and unique
- Test selectors in browser dev tools first

### Environment Configuration
- Modify `BASE_URL` for different environments
- Adjust timeouts based on application performance
- Add environment-specific configurations

## 📈 Best Practices

### Test Design
- **Independent Tests**: Each test should run independently
- **Clear Assertions**: Use descriptive assertion messages
- **Proper Cleanup**: Always clean up resources in teardown
- **Wait Strategies**: Use explicit waits instead of sleep

### Maintenance
- **Regular Updates**: Keep selectors updated with UI changes
- **Version Control**: Track test changes with application changes
- **Documentation**: Keep test documentation current
- **CI/CD Integration**: Integrate with build pipelines

## 🐛 Troubleshooting

### Common Issues
1. **ChromeDriver Version Mismatch**: Ensure ChromeDriver matches Chrome version
2. **Element Not Found**: Check if selectors are correct and elements are loaded
3. **Timeout Issues**: Increase wait times for slow environments
4. **Permission Issues**: Ensure ChromeDriver has execute permissions

### Debug Tips
- Enable verbose logging
- Take screenshots on failures
- Use browser dev tools to verify selectors
- Check console for JavaScript errors

## 📞 Support

For issues or questions:
1. Check this README first
2. Review test logs and screenshots
3. Verify application is running on localhost:4200
4. Ensure all prerequisites are installed

---

**Happy Testing! 🚀**
