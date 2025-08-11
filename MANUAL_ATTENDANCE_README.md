# Manual Attendance Feature

## Overview

The manual attendance feature allows managers to log time entries for employees who have duty schedules but lack biometric data due to system issues or missed scans.

## Implementation

### Components Added

1. **ManualAttendanceModal.jsx** - Modal component for manual time entry
2. **Updated EmployeeAttendance.jsx** - Added clickable empty time slots
3. **Updated attendanceReducer.js** - Added API call for manual attendance

### API Integration

The feature uses the following backend endpoint:

```
POST /hris/attendances/manual-attendance
```

Expected payload:

```javascript
{
  employeeId: "objectId",
  date: "ISO date string",
  type: "CheckIn" | "CheckOut",
  time: "HH:MM format",
  timeType: "morningIn" | "morningOut" | "afternoonIn" | "afternoonOut" | "timeIn" | "timeOut",
  remarks: "string (required)"
}
```

### Features

#### When Manual Attendance is Allowed

- Employee has a duty schedule (scheduleType === "duty")
- The specific time slot is empty (no existing time log)
- Excludes employees who are off, on holiday, or on leave

#### Time Slot Types

- **Standard Schedule**: morningIn, morningOut, afternoonIn, afternoonOut
- **Shifting Schedule**: timeIn, timeOut

#### UI Indicators

- Empty time slots show as clickable buttons with "✏️" icon
- Hover effects and visual feedback for clickable slots
- Non-manual slots appear as regular "--:--" text

### User Experience

1. **Manager View**: Click on empty time slot
2. **Modal Opens**: Shows employee info, schedule, and form
3. **Fill Form**: Enter time (HH:MM format) and mandatory remarks
4. **Submit**: Saves to database and updates UI immediately
5. **Success**: Modal closes and table refreshes

### Integration Example

```jsx
// In parent component (e.g., ManagerEmployeeAttendance.jsx)
const handleManualAttendanceSuccess = useCallback(() => {
  // Refresh attendance data
  if (availableDutySchedules.length > 0 && currentScheduleIndex >= 0) {
    const currentSchedule = availableDutySchedules[currentScheduleIndex];
    if (currentSchedule?._id) {
      dispatch(
        fetchAttendanceByDepartment({
          scheduleId: currentSchedule._id,
        })
      );
    }
  }
}, [availableDutySchedules, currentScheduleIndex, dispatch]);

// Pass to EmployeeAttendance component
<EmployeeAttendance
  // ... other props
  onManualAttendanceSuccess={handleManualAttendanceSuccess}
/>;
```

### Backend Schema

```javascript
const manualAttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["CheckIn", "CheckOut"],
    required: true,
  },
  remarks: {
    type: String,
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
```

### Validation Rules

1. **Time Format**: Must be valid HH:MM (24-hour format)
2. **Remarks**: Required field for audit trail
3. **Employee**: Must have valid duty schedule
4. **Date**: Must match attendance record date
5. **Permissions**: Only managers/HR can add manual attendance

### Error Handling

- Form validation with real-time feedback
- API error display in modal
- Network error handling
- State management for loading states

### Security Considerations

- Authentication required (`authMiddleware`)
- User permissions verified
- Audit trail through `createdBy` field
- Mandatory remarks for accountability

## Testing

To test the feature:

1. Navigate to attendance page (Manager/HR/Director)
2. Select department with duty schedules
3. Find employee with duty but missing time logs
4. Click on empty time slot (shows ✏️ icon)
5. Fill form and submit
6. Verify immediate UI update and database persistence

## Files Modified

- `src/components/ManualAttendanceModal.jsx` (new)
- `src/components/employee/EmployeeAttendance.jsx` (updated)
- `src/store/Reducers/attendanceReducer.js` (updated)
- `src/pages/dashboard/manager/attendance/ManagerEmployeeAttendance.jsx` (updated)

## Future Enhancements

- Bulk manual attendance entry
- Time range validation against shift schedules
- Approval workflow for manual entries
- Detailed audit logs and reporting
- Mobile-responsive modal improvements
