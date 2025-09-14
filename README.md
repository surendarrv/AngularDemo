# Angular Data Grid Demo

A comprehensive Angular application featuring an advanced data grid with multiple enterprise-level features.

## Features

### 🗂️ Data Grid
- **1000 rows** of synthetic employee data with 8 columns
- **Infinite scroll pagination** with lazy loading and skeleton UI
- **Row selection** with checkboxes and unique ID display
- **Export functionality** - CSV and Text file generation
- **Responsive design** with modern UI/UX

### 💬 Comments & Attachments
- **Row-level actions** via ellipsis menu
- **Add comments** and attach files for each row
- **Persistent storage** using localStorage
- **View existing comments** in modal popup

### 💰 Salary Management
- **Inline editing** with pencil icon
- **Real-time validation**:
  - No decimal values allowed
  - Maximum salary: $200,000
  - No negative values
- **Mock API integration** with `v1/api/updatesalary`
- **Code generation** for ESQL and Mainframe BI Engine

### 🧪 Testing
- **Selenium test suites** in Java, Python, and JavaScript
- **Comprehensive test coverage** for all UI interactions
- **Test code viewer** with copy-to-clipboard functionality

## Technology Stack

- **Angular 16.1.0** with TypeScript
- **Font Awesome** icons
- **CSS3** with modern styling
- **Selenium WebDriver** for testing
- **Local Storage** for data persistence

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Angular CLI
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/Angular-demo.git
cd Angular-demo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── data-grid/
│   │   ├── data-grid.component.ts    # Main component logic
│   │   ├── data-grid.component.html  # Template with grid UI
│   │   └── data-grid.component.css   # Styling
│   ├── app.component.*               # Root component
│   └── app.module.ts                 # App module configuration
├── styles.css                        # Global styles
└── index.html                        # Main HTML file

selenium-tests/
├── DataGridTestSuite.java            # Java Selenium tests
├── data_grid_test_suite.py           # Python Selenium tests
├── requirements.txt                  # Python dependencies
└── pom.xml                          # Maven configuration
```

## Usage

### Data Grid Operations
- **Select rows**: Click checkboxes to select multiple rows
- **Export data**: Click the export icon in the header
- **Scroll pagination**: Scroll down to load more data
- **Row actions**: Click the ellipsis (⋯) icon for row-specific actions

### Salary Editing
1. Click the pencil icon next to any salary
2. Enter the new salary value
3. Click "SAVE" to update
4. View generated ESQL and Mainframe code

### Comments & Attachments
1. Click the ellipsis icon on any row
2. Select "Add Comment" or "View Comments"
3. Add comments and attach files as needed

## API Integration

The application includes mock API integration for salary updates:

**Endpoint**: `v1/api/updatesalary`
**Method**: POST
**Request Body**:
```json
{
  "employeeId": 123,
  "newSalary": 75000
}
```

## Testing

### Running Selenium Tests

#### Java (Maven)
```bash
cd selenium-tests
mvn test
```

#### Python
```bash
cd selenium-tests
pip install -r requirements.txt
python data_grid_test_suite.py
```

## Code Generation

After successful salary updates, the application generates:

### ESQL Code
```sql
UPDATE EMPLOYEE_TABLE 
SET SALARY = 75000 
WHERE EMPLOYEE_ID = 123;
```

### Mainframe BI Engine Code
```cobol
MOVE 75000 TO WS-NEW-SALARY
MOVE 123 TO WS-EMPLOYEE-ID
PERFORM UPDATE-EMPLOYEE-SALARY
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Created by Surendar R V (surendar.rv@gmail.com)

---

**Note**: This is a demo application showcasing Angular development best practices and enterprise-level features.