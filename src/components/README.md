# GSH HRIS Dashboard - Enhanced Employee Attendance

## Component Documentation

### EmployeeSearch Component

The `EmployeeSearch` component is an enhanced search component that combines:

1. Department selection (optional)
2. Employee dropdown search
3. Per page selection

#### Props:

- `setPerpage`: Function to set number of items per page
- `setSearchValue`: Function to set search value
- `searchValue`: Current search value
- `inputPlaceholder`: Placeholder text for search input
- `employees`: Array of employee objects to display in dropdown
- `loading`: Boolean indicating if employees are loading
- `managedDepartments`: Array of department objects
- `selectedDepartment`: ID of currently selected department
- `onDepartmentChange`: Function to handle department changes

#### Features:

- Shows department selection inline with search
- Displays employee dropdown with employee names and IDs
- Supports keyboard navigation (Arrow keys, Enter, Escape)
- Shows department name instead of dropdown when only one department is available

### LoadingIndicator Component

The `LoadingIndicator` component shows a loading overlay when data is being fetched, particularly useful for pagination state changes.

#### Props:

- `isLoading`: Boolean to control visibility of the indicator

## Implementation Details

### Pagination Loading Enhancement

To resolve the issue where pagination shows old data while loading:

1. Added `isLoadingPage` state in `ManagerEmployeeAttendance` component
2. Modified `getAttendanceByDepartment` function to set loading state and include a short delay
3. Added a `LoadingIndicator` to show a loading overlay during pagination
4. Updated `Pagination` component to set loading state before changing page
5. Improved styling for better visual feedback during loading states

### Professional Design Updates

1. Enhanced header with gradient background and icon
2. Improved table header with icons and gradient background
3. Enhanced pagination container with visual grouping
4. Added department selection with improved UI
5. Better visual separation of components with consistent shadow and border styles
6. Added transition animations for smoother user experience

## Usage Example

```jsx
// Example of using EmployeeSearch
<EmployeeSearch
  setPerpage={setPerpage}
  setSearchValue={setSearchValue}
  searchValue={searchValue}
  inputPlaceholder="Search by employee name..."
  employees={employees}
  loading={loading}
  managedDepartments={managedDepartments}
  selectedDepartment={selectedDepartment}
  onDepartmentChange={handleDepartmentChange}
/>

// Example of using LoadingIndicator
<LoadingIndicator isLoading={isLoading} />
```
