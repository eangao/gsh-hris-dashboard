# GSH HRIS Design System Documentation

## Overview

This design system provides a consistent and professional UI framework for the GSH HRIS Dashboard. It ensures visual consistency, accessibility, and maintainability across all components.

## Design Philosophy

### 🎨 Color Scheme

- **Primary Blue**: Professional and trustworthy
- **Secondary Grays**: Clean and modern
- **Status Colors**: Intuitive and accessible
- **Gradients**: Subtle and professional

### 🧩 Component Architecture

- **Reusable**: Components can be used across different pages
- **Accessible**: Built with ARIA attributes and keyboard navigation
- **Responsive**: Mobile-first approach
- **Consistent**: Follows established patterns

## File Structure

```
src/
├── utils/
│   └── designSystem.js          # Design tokens and utilities
├── components/
│   └── ui/
│       └── index.js             # Reusable UI components
└── pages/
    └── [various pages using the design system]
```

## 🎯 Design Tokens

### Colors

```javascript
// Primary Colors
primary: {
  500: '#3B82F6',  // Main primary blue
  600: '#2563EB',  // Darker blue for hover states
  // ... other shades
}

// Secondary Colors
secondary: {
  500: '#64748B',  // Main gray
  900: '#0F172A',  // Dark slate for text
  // ... other shades
}
```

### Typography

```javascript
typography: {
  pageTitle: 'text-2xl font-bold text-gray-900 mb-6',
  sectionTitle: 'text-xl font-semibold text-gray-800 mb-4',
  cardTitle: 'text-lg font-medium text-gray-900 mb-2',
  bodyText: 'text-gray-700 text-sm',
  secondaryText: 'text-gray-500 text-xs',
}
```

### Spacing

```javascript
spacing: {
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6',
  xl: 'space-y-8',
}
```

## 🧱 Core Components

### 1. Layout Components

#### PageContainer

```jsx
import { PageContainer } from "../components/ui";

<PageContainer>{/* Your page content */}</PageContainer>;
```

#### PageHeader

```jsx
import { PageHeader } from "../components/ui";

<PageHeader
  title="Page Title"
  subtitle="Optional subtitle"
  actions={[<Button key="1">Action Button</Button>]}
/>;
```

#### Card

```jsx
import { Card } from "../components/ui";

<Card variant="elevated">{/* Card content */}</Card>;

// Variants: base, elevated, interactive, compact, statistic
```

#### Section

```jsx
import { Section } from "../components/ui";

<Section title="Section Title">{/* Section content */}</Section>;
```

### 2. Form Components

#### Input

```jsx
import { Input } from "../components/ui";

<Input
  label="Email Address"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleInputChange}
  required
  error={errors.email}
/>;
```

#### Select

```jsx
import { Select } from "../components/ui";

<Select
  label="Department"
  name="department"
  options={[
    { value: "hr", label: "Human Resources" },
    { value: "it", label: "Information Technology" },
  ]}
  value={formData.department}
  onChange={handleInputChange}
  required
/>;
```

#### Button

```jsx
import { Button } from "../components/ui";

<Button variant="primary" size="md" loading={isLoading}>
  Submit
</Button>;

// Variants: primary, secondary, danger, success, warning, ghost, link
// Sizes: sm, md, lg
```

### 3. Data Display Components

#### Badge

```jsx
import { Badge } from "../components/ui";

<Badge variant="success">Active</Badge>;

// Variants: success, warning, error, info, neutral
```

#### StatusBadge

```jsx
import { StatusBadge } from "../components/ui";

<StatusBadge status="Present" lateMinutes={15} />;
// Automatically handles Present, Late, Absent, Off statuses
```

#### StatCard

```jsx
import { StatCard } from "../components/ui";

<StatCard
  title="Total Employees"
  value="1,234"
  subtitle="Active employees"
  icon={<BiUser className="w-6 h-6 text-blue-500" />}
  trend={{
    value: "+12%",
    positive: true,
    label: "from last month",
  }}
/>;
```

#### Table

```jsx
import { Table } from "../components/ui";

const columns = [
  { key: "name", header: "Name" },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

<Table columns={columns} data={tableData} loading={isLoading} />;
```

### 4. Feedback Components

#### LoadingSpinner

```jsx
import { LoadingSpinner } from "../components/ui";

<LoadingSpinner size="lg" />;
// Sizes: sm, md, lg
```

#### LoadingSkeleton

```jsx
import { LoadingSkeleton } from "../components/ui";

<LoadingSkeleton lines={3} />;
```

#### Modal

```jsx
import { Modal } from "../components/ui";

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Modal Title"
>
  {/* Modal content */}
</Modal>;
```

## 🎨 Background System

### MainLayout Background

```jsx
// Applied in MainLayout.jsx
className = "bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40";
```

### Component Backgrounds

```javascript
backgrounds: {
  main: 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40',
  card: 'bg-white',
  sidebar: 'bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900',
  header: 'bg-white',
  overlay: 'bg-black/50 backdrop-blur-sm',
}
```

## 📱 Responsive Design

### Grid System

```jsx
// 3-column grid that collapses on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// 2-column grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Cards */}
</div>
```

### Responsive Utilities

```javascript
containers: {
  page: 'p-4 lg:p-6 max-w-7xl mx-auto',
  cardGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  flexRow: 'flex flex-col sm:flex-row gap-4',
}
```

## 🔧 Usage Examples

### Dashboard Page

```jsx
import React from "react";
import {
  PageContainer,
  PageHeader,
  StatCard,
  Card,
  Button,
  Section,
} from "../components/ui";

const Dashboard = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your HRIS system"
        actions={[<Button key="export">Export Report</Button>]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value="1,234"
          icon={<BiUser className="w-6 h-6 text-blue-500" />}
        />
        {/* More stat cards */}
      </div>

      {/* Content */}
      <Section title="Recent Activity">
        <Card>{/* Content */}</Card>
      </Section>
    </PageContainer>
  );
};
```

### Form Page

```jsx
import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  Card,
  Input,
  Select,
  Button,
} from "../components/ui";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({});

  return (
    <PageContainer>
      <PageHeader title="Employee Registration" />

      <Card>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="primary" type="submit">
              Save Employee
            </Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};
```

## 🚀 Implementation Guidelines

### 1. Always Use Design System Components

```jsx
// ✅ Good
<Button variant="primary">Submit</Button>

// ❌ Avoid
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Submit
</button>
```

### 2. Consistent Spacing

```jsx
// ✅ Good - using design system spacing
<div className="space-y-6">
  <Section title="Profile">
    <Card>Content</Card>
  </Section>
</div>

// ❌ Avoid - custom spacing
<div className="mt-4 mb-8">
  <h2 className="mb-3">Profile</h2>
  <div className="bg-white p-5">Content</div>
</div>
```

### 3. Page Structure

```jsx
// ✅ Recommended page structure
const MyPage = () => {
  return (
    <PageContainer>
      <PageHeader title="Page Title" subtitle="Description" />

      {/* Main content */}
      <div className="space-y-6">
        <Section title="Section 1">
          <Card>Content</Card>
        </Section>

        <Section title="Section 2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>Content 1</Card>
            <Card>Content 2</Card>
          </div>
        </Section>
      </div>
    </PageContainer>
  );
};
```

## 📊 Migration Guide

### From Old to New Components

1. **Replace custom buttons:**

```jsx
// Old
<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  Submit
</button>

// New
<Button variant="primary">Submit</Button>
```

2. **Replace custom cards:**

```jsx
// Old
<div className="bg-white p-6 rounded-lg shadow">
  Content
</div>

// New
<Card>Content</Card>
```

3. **Replace custom status badges:**

```jsx
// Old
<span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
  Present
</span>

// New
<StatusBadge status="Present" />
```

4. **Replace page containers:**

```jsx
// Old
<div className="p-6">
  <h1 className="text-2xl font-bold mb-6">Title</h1>
  Content
</div>

// New
<PageContainer>
  <PageHeader title="Title" />
  Content
</PageContainer>
```

## 🛠️ Customization

### Extending the Design System

```jsx
// In your component file
import { utils } from "../utils/designSystem";

const customButtonClass = utils.cn(
  "base-button-classes",
  "custom-modification",
  conditionalClass && "conditional-classes"
);
```

### Adding New Variants

```jsx
// In designSystem.js
buttons: {
  // ... existing variants
  custom: 'bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg',
}
```

## 🔍 Testing

### Component Testing

```jsx
// Test component with design system
import { render, screen } from "@testing-library/react";
import { Button } from "../components/ui";

test("button renders correctly", () => {
  render(<Button variant="primary">Click me</Button>);
  expect(screen.getByRole("button")).toHaveClass("bg-blue-500");
});
```

## 📈 Performance Considerations

1. **Tree Shaking**: Import only what you need

```jsx
// ✅ Good
import { Button, Card } from "../components/ui";

// ❌ Avoid
import * as UI from "../components/ui";
```

2. **Memoization**: Components are already optimized
3. **CSS Classes**: Using Tailwind's utility classes for optimal performance

## 🚀 Next Steps

1. **Migration**: Update existing pages to use the design system
2. **Testing**: Add tests for all components
3. **Documentation**: Keep this documentation updated
4. **Accessibility**: Ensure all components meet WCAG guidelines
5. **Performance**: Monitor bundle size and optimize as needed

## 📞 Support

For questions or suggestions about the design system:

- Check this documentation first
- Review existing component implementations
- Follow the established patterns for new components
- Maintain consistency across the application

---

_This design system is a living document and will evolve with the application's needs._
