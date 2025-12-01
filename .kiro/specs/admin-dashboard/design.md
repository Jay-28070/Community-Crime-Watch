# Admin Dashboard Design Document

## Overview

The Admin Dashboard is a specialized web application for police administrators to manage case assignments, monitor officer workload, and track case progress. The system provides a centralized command center with real-time updates, intuitive filtering, and comprehensive case management capabilities. The interface uses a distinctive sea blue/green (teal/cyan) color scheme to differentiate it from both user-facing (blue) and officer-facing (red) interfaces while maintaining design consistency with the existing application.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Dashboard UI                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Hero       │  │   Stats      │  │   Filters    │      │
│  │   Section    │  │   Dashboard  │  │   Panel      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Case Grid / List View                      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Case       │  │   Officer    │  │   Assignment │      │
│  │   Detail     │  │   Management │  │   Modal      │      │
│  │   Modal      │  │   Panel      │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Admin Dashboard Controller                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Case       │  │   Officer    │  │   Filter     │      │
│  │   Manager    │  │   Manager    │  │   Manager    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Firebase Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Firestore   │  │     Auth     │  │   Storage    │      │
│  │  (Database)  │  │ (Admin Auth) │  │  (Evidence)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Firestore (NoSQL database)
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage (for evidence files)
- **Styling**: Custom CSS with sea blue/green theme
- **Icons**: SVG icons matching existing design system

## Components and Interfaces

### 1. Navigation Bar

**Purpose**: Provide branding, user identification, and logout functionality

**Structure**:
```html
<nav class="admin-nav">
  <div class="main-logo admin-logo">
    <img src="logo.svg" />
    <span>Admin Dashboard</span>
  </div>
  <div class="admin-info">
    <span class="admin-name">Administrator Name</span>
    <button class="logout-btn">Logout</button>
  </div>
</nav>
```

**Styling**:
- Background: White with subtle shadow
- Logo: Sea blue/green accent
- Fixed position at top
- Height: 70px

### 2. Hero Section

**Purpose**: Welcome administrators and provide context

**Structure**:
```html
<div class="admin-hero">
  <div class="hero-background">
    <div class="hero-circle"></div>
  </div>
  <div class="hero-content">
    <div class="hero-badge">
      <svg><!-- Shield icon --></svg>
      <span>Administrative Command Center</span>
    </div>
    <h1>Case Management Dashboard</h1>
    <p>Monitor, assign, and track all cases across your department</p>
  </div>
</div>
```

**Styling**:
- Background: Radial gradient (sea blue/green: #17a2b8 to #20c997)
- Text: White
- Padding: 80px 20px 50px
- Animated circles in background

### 3. Statistics Dashboard

**Purpose**: Display key metrics at a glance

**Structure**:
```html
<div class="stats-dashboard">
  <div class="stat-card">
    <div class="stat-icon"><!-- Icon --></div>
    <div class="stat-number">125</div>
    <div class="stat-label">Total Cases</div>
  </div>
  <!-- More stat cards -->
</div>
```

**Metrics**:
- Total Cases
- Pending Cases
- In Progress Cases
- Resolved Cases
- Average Resolution Time
- Active Officers

**Styling**:
- Cards: White background, rounded corners (15px)
- Icons: Sea blue/green gradient background
- Numbers: Large, bold font
- Grid layout: 3 columns on desktop, 2 on tablet, 1 on mobile

### 4. Filter Panel

**Purpose**: Allow administrators to filter and search cases

**Structure**:
```html
<div class="filter-panel">
  <input type="text" class="search-bar" placeholder="Search cases..." />
  <select class="filter-select" id="status-filter">
    <option value="all">All Status</option>
    <option value="pending">Pending</option>
    <option value="in-progress">In Progress</option>
    <option value="resolved">Resolved</option>
  </select>
  <select class="filter-select" id="priority-filter">
    <option value="all">All Priorities</option>
    <option value="critical">Critical</option>
    <option value="high">High</option>
    <option value="medium">Medium</option>
    <option value="low">Low</option>
  </select>
  <select class="filter-select" id="officer-filter">
    <option value="all">All Officers</option>
    <!-- Dynamic officer list -->
  </select>
  <button class="clear-filters-btn">Clear Filters</button>
</div>
```

**Functionality**:
- Real-time search filtering
- Multiple filter combination
- Clear all filters button
- Responsive layout

**Styling**:
- Background: Light gray (#f8f9fa)
- Inputs: White with sea blue/green focus border
- Border radius: 10px
- Padding: 20px

### 5. Case Grid

**Purpose**: Display all cases in a card-based layout

**Structure**:
```html
<div class="cases-grid">
  <div class="case-card" data-case-id="123">
    <div class="case-header">
      <span class="case-id">#123</span>
      <span class="case-priority critical">Critical</span>
    </div>
    <h3 class="case-title">Armed Robbery</h3>
    <p class="case-description">Description...</p>
    <div class="case-meta">
      <span class="case-status">In Progress</span>
      <span class="case-date">2 hours ago</span>
    </div>
    <div class="case-officer">
      <img src="officer-avatar.jpg" />
      <span>Officer Smith</span>
    </div>
    <div class="case-actions">
      <button class="view-btn">View Details</button>
      <button class="assign-btn">Assign/Reassign</button>
    </div>
  </div>
</div>
```

**Card States**:
- Default: White background
- Hover: Slight elevation, sea blue/green border
- Unassigned: Yellow left border
- Critical: Red accent

**Styling**:
- Grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- Gap: 20px
- Card padding: 20px
- Border radius: 15px
- Box shadow: 0 4px 15px rgba(0,0,0,0.1)

### 6. Case Detail Modal

**Purpose**: Show comprehensive case information

**Structure**:
```html
<div class="modal" id="case-detail-modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Case #123 - Armed Robbery</h2>
      <button class="close-btn">×</button>
    </div>
    <div class="modal-body">
      <div class="case-info-section">
        <h3>Case Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <strong>Type:</strong> <span>Armed Robbery</span>
          </div>
          <!-- More info items -->
        </div>
      </div>
      <div class="case-timeline">
        <h3>Progress Timeline</h3>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <strong>Case Created</strong>
            <p>Initial report filed by citizen</p>
            <span class="timeline-time">2 hours ago</span>
          </div>
        </div>
        <!-- More timeline items -->
      </div>
      <div class="case-evidence">
        <h3>Evidence</h3>
        <div class="evidence-grid">
          <!-- Evidence thumbnails -->
        </div>
      </div>
      <div class="admin-actions">
        <button class="update-status-btn">Update Status</button>
        <button class="add-note-btn">Add Note</button>
        <button class="export-btn">Export Report</button>
      </div>
    </div>
  </div>
</div>
```

**Styling**:
- Modal overlay: rgba(0,0,0,0.5)
- Modal content: White, max-width 900px
- Border radius: 20px
- Timeline: Vertical line with dots
- Sea blue/green accents

### 7. Assignment Modal

**Purpose**: Assign or reassign officers to cases

**Structure**:
```html
<div class="modal" id="assignment-modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Assign Officer to Case #123</h2>
      <button class="close-btn">×</button>
    </div>
    <div class="modal-body">
      <div class="current-assignment" *ngIf="hasAssignment">
        <p>Currently assigned to: <strong>Officer Smith</strong></p>
      </div>
      <div class="officer-list">
        <div class="officer-card" data-officer-id="1">
          <img src="officer-avatar.jpg" class="officer-avatar" />
          <div class="officer-info">
            <strong>Officer John Smith</strong>
            <span class="badge-number">Badge #1234</span>
            <div class="workload-indicator">
              <div class="workload-bar" style="width: 60%"></div>
              <span>6 active cases</span>
            </div>
          </div>
          <button class="select-officer-btn">Select</button>
        </div>
        <!-- More officer cards -->
      </div>
    </div>
  </div>
</div>
```

**Workload Indicators**:
- Low (0-3 cases): Green
- Moderate (4-6 cases): Yellow
- High (7+ cases): Red

**Styling**:
- Officer cards: Horizontal layout
- Avatar: 50px circle
- Workload bar: Progress bar with color coding
- Select button: Sea blue/green

### 8. Officer Management Panel

**Purpose**: View and manage officer workload

**Structure**:
```html
<div class="officer-panel">
  <h2>Officer Management</h2>
  <div class="officer-grid">
    <div class="officer-summary-card">
      <div class="officer-header">
        <img src="avatar.jpg" />
        <div>
          <strong>Officer Smith</strong>
          <span>Badge #1234</span>
        </div>
      </div>
      <div class="officer-stats">
        <div class="stat">
          <span class="stat-label">Active Cases</span>
          <span class="stat-value">6</span>
        </div>
        <div class="stat">
          <span class="stat-label">Resolution Rate</span>
          <span class="stat-value">85%</span>
        </div>
      </div>
      <button class="view-cases-btn">View Cases</button>
    </div>
  </div>
</div>
```

**Styling**:
- Grid: 4 columns on desktop
- Cards: White with hover effect
- Stats: Inline display
- Sea blue/green accents

## Data Models

### Case Model

```javascript
{
  id: string,                    // Unique case identifier
  title: string,                 // Case title/summary
  type: string,                  // Crime type (theft, assault, etc.)
  description: string,           // Detailed description
  priority: string,              // low, medium, high, critical
  status: string,                // pending, in-progress, under-review, resolved, closed
  location: {
    address: string,
    latitude: number,
    longitude: number
  },
  reportedBy: {
    userId: string,
    name: string,
    contact: string
  },
  assignedOfficer: {
    officerId: string,
    name: string,
    badgeNumber: string,
    assignedAt: timestamp
  } | null,
  timeline: [
    {
      id: string,
      type: string,              // created, assigned, status-change, note, evidence-added
      description: string,
      author: {
        id: string,
        name: string,
        role: string             // admin, officer, system
      },
      timestamp: timestamp
    }
  ],
  evidence: [
    {
      id: string,
      type: string,              // photo, video, document
      url: string,
      uploadedBy: string,
      uploadedAt: timestamp
    }
  ],
  createdAt: timestamp,
  updatedAt: timestamp,
  resolvedAt: timestamp | null,
  resolutionSummary: string | null
}
```

### Officer Model

```javascript
{
  id: string,                    // Unique officer identifier
  name: string,                  // Full name
  badgeNumber: string,           // Badge number
  email: string,                 // Contact email
  phone: string,                 // Contact phone
  rank: string,                  // Officer rank
  department: string,            // Department/division
  activeCases: [string],         // Array of case IDs
  caseCount: number,             // Current active case count
  totalCasesResolved: number,    // Historical count
  resolutionRate: number,        // Percentage (0-100)
  averageResolutionTime: number, // In hours
  status: string,                // active, on-leave, inactive
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Admin Model

```javascript
{
  id: string,                    // Unique admin identifier
  name: string,                  // Full name
  email: string,                 // Contact email
  role: string,                  // admin
  permissions: [string],         // Array of permission strings
  department: string,            // Department
  createdAt: timestamp,
  lastLogin: timestamp
}
```

### Timeline Entry Model

```javascript
{
  id: string,
  caseId: string,
  type: string,                  // created, assigned, reassigned, status-change, note, evidence-added, exported
  description: string,
  details: object,               // Type-specific details
  author: {
    id: string,
    name: string,
    role: string
  },
  timestamp: timestamp
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Case Display Completeness
*For any* set of cases in the database, when the dashboard loads, all cases should be displayed in the case grid with all required fields (ID, title, type, priority, status, assigned officer, date) visible.
**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Filter Consistency
*For any* combination of filters (status, priority, officer), the displayed cases should match all selected filter criteria, and no cases that don't match should be displayed.
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 3: Search Accuracy
*For any* search query, all displayed cases should contain the search term in either the case ID, title, or description fields.
**Validates: Requirements 2.1**

### Property 4: Assignment Validation
*For any* case assignment operation, the system should verify that the selected officer exists and is active before completing the assignment.
**Validates: Requirements 3.6**

### Property 5: Workload Update Consistency
*For any* case assignment or reassignment, the workload counts for all affected officers should be updated immediately and accurately reflect the number of active cases.
**Validates: Requirements 3.5, 4.4**

### Property 6: Timeline Chronological Order
*For any* case timeline, all entries should be ordered chronologically with the most recent entry first, and each entry should have a valid timestamp.
**Validates: Requirements 5.3, 5.4**

### Property 7: Status Transition Validity
*For any* status update operation, the new status should be a valid status value (pending, in-progress, under-review, resolved, closed), and a timeline entry should be created.
**Validates: Requirements 7.2, 7.3**

### Property 8: Reassignment Atomicity
*For any* case reassignment, both the old officer's workload and the new officer's workload should be updated, or neither should be updated (atomic operation).
**Validates: Requirements 4.3, 4.4**

### Property 9: Statistics Accuracy
*For any* dashboard statistics display, the counts should accurately reflect the current state of cases in the database (total, pending, in-progress, resolved).
**Validates: Requirements 9.1, 9.5**

### Property 10: Officer Workload Calculation
*For any* officer, the displayed workload count should equal the number of cases where that officer is assigned and the case status is not "resolved" or "closed".
**Validates: Requirements 6.2, 6.4**

### Property 11: Theme Consistency
*For any* UI element (buttons, cards, gradients), the colors used should be from the sea blue/green palette (#17a2b8, #20c997, #0dcaf0) or their variations.
**Validates: Requirements 8.1, 8.2, 8.3, 8.5**

### Property 12: Modal Display Isolation
*For any* modal that is opened, only one modal should be visible at a time, and the background should be overlaid to prevent interaction with underlying elements.
**Validates: Requirements 3.1, 5.1**

### Property 13: Note Attribution
*For any* administrative note added to a case, the note should be saved with the administrator's name and a timestamp, and should appear in the timeline.
**Validates: Requirements 10.2, 10.3, 10.5**

### Property 14: Export Data Completeness
*For any* case export operation, the exported file should contain all case information including description, location, evidence references, and timeline entries.
**Validates: Requirements 12.3, 12.4**

### Property 15: Responsive Layout Adaptation
*For any* screen size, the layout should adapt appropriately: 3-column grid on desktop (>1024px), 2-column on tablet (768-1024px), and 1-column on mobile (<768px).
**Validates: Requirements 11.1, 11.2**

## Error Handling

### Authentication Errors
- **Scenario**: User is not authenticated or session expires
- **Handling**: Redirect to login page with return URL
- **User Feedback**: "Session expired. Please log in again."

### Authorization Errors
- **Scenario**: User is not an administrator
- **Handling**: Redirect to appropriate dashboard (police or user)
- **User Feedback**: "Access denied. Administrator privileges required."

### Network Errors
- **Scenario**: Firebase connection fails
- **Handling**: Show retry button, cache last known state
- **User Feedback**: "Connection error. Retrying..."

### Assignment Errors
- **Scenario**: Officer is no longer active or case is already assigned
- **Handling**: Refresh officer list, show current assignment
- **User Feedback**: "Unable to assign. Please refresh and try again."

### Validation Errors
- **Scenario**: Invalid data in forms (empty fields, invalid formats)
- **Handling**: Highlight invalid fields, prevent submission
- **User Feedback**: Specific error message per field

### Data Loading Errors
- **Scenario**: Cases or officers fail to load
- **Handling**: Show error state with retry option
- **User Feedback**: "Failed to load data. Click to retry."

### Export Errors
- **Scenario**: Export generation fails
- **Handling**: Log error, show user-friendly message
- **User Feedback**: "Export failed. Please try again."

## Testing Strategy

### Unit Testing

**Framework**: Jest or Vitest

**Test Coverage**:
1. **Filter Functions**
   - Test case filtering by status
   - Test case filtering by priority
   - Test case filtering by officer
   - Test combined filters
   - Test search functionality

2. **Data Transformation**
   - Test case data formatting
   - Test timeline sorting
   - Test workload calculations
   - Test statistics aggregation

3. **Validation Functions**
   - Test officer existence validation
   - Test status transition validation
   - Test form input validation
   - Test date/time validation

4. **UI State Management**
   - Test modal open/close
   - Test filter state updates
   - Test case selection
   - Test error state handling

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run a minimum of 100 iterations

**Test Tagging**: Each property-based test must include a comment with the format:
`// Feature: admin-dashboard, Property {number}: {property_text}`

**Property Tests**:

1. **Property 1: Case Display Completeness**
   ```javascript
   // Feature: admin-dashboard, Property 1: Case Display Completeness
   test('all cases should be displayed with required fields', () => {
     fc.assert(
       fc.property(fc.array(caseGenerator()), (cases) => {
         const displayed = renderCaseGrid(cases);
         return cases.every(c => 
           displayed.includes(c.id) &&
           displayed.includes(c.title) &&
           displayed.includes(c.type)
         );
       }),
       { numRuns: 100 }
     );
   });
   ```

2. **Property 2: Filter Consistency**
   ```javascript
   // Feature: admin-dashboard, Property 2: Filter Consistency
   test('filtered cases should match all criteria', () => {
     fc.assert(
       fc.property(
         fc.array(caseGenerator()),
         fc.record({
           status: fc.constantFrom('pending', 'in-progress', 'resolved'),
           priority: fc.constantFrom('low', 'medium', 'high', 'critical')
         }),
         (cases, filters) => {
           const filtered = applyFilters(cases, filters);
           return filtered.every(c =>
             c.status === filters.status &&
             c.priority === filters.priority
           );
         }
       ),
       { numRuns: 100 }
     );
   });
   ```

3. **Property 5: Workload Update Consistency**
   ```javascript
   // Feature: admin-dashboard, Property 5: Workload Update Consistency
   test('workload should update correctly on assignment', () => {
     fc.assert(
       fc.property(
         officerGenerator(),
         caseGenerator(),
         (officer, case) => {
           const initialWorkload = officer.caseCount;
           assignCaseToOfficer(case, officer);
           return officer.caseCount === initialWorkload + 1;
         }
       ),
       { numRuns: 100 }
     );
   });
   ```

4. **Property 6: Timeline Chronological Order**
   ```javascript
   // Feature: admin-dashboard, Property 6: Timeline Chronological Order
   test('timeline entries should be chronologically ordered', () => {
     fc.assert(
       fc.property(
         fc.array(timelineEntryGenerator()),
         (entries) => {
           const sorted = sortTimeline(entries);
           for (let i = 0; i < sorted.length - 1; i++) {
             if (sorted[i].timestamp < sorted[i + 1].timestamp) {
               return false;
             }
           }
           return true;
         }
       ),
       { numRuns: 100 }
     );
   });
   ```

5. **Property 9: Statistics Accuracy**
   ```javascript
   // Feature: admin-dashboard, Property 9: Statistics Accuracy
   test('statistics should match actual case counts', () => {
     fc.assert(
       fc.property(
         fc.array(caseGenerator()),
         (cases) => {
           const stats = calculateStatistics(cases);
           const pendingCount = cases.filter(c => c.status === 'pending').length;
           const inProgressCount = cases.filter(c => c.status === 'in-progress').length;
           return stats.pending === pendingCount &&
                  stats.inProgress === inProgressCount &&
                  stats.total === cases.length;
         }
       ),
       { numRuns: 100 }
     );
   });
   ```

### Integration Testing

**Test Scenarios**:
1. Complete assignment workflow (select case → open modal → select officer → confirm)
2. Filter and search combination
3. Case detail view with timeline
4. Status update with timeline entry creation
5. Officer workload update on reassignment
6. Export functionality with data validation

### End-to-End Testing

**Test Flows**:
1. Admin login → View dashboard → Assign case → Verify assignment
2. Admin login → Filter cases → View details → Update status
3. Admin login → View officer panel → Check workload → Reassign case
4. Admin login → Add note → Verify timeline update
5. Admin login → Export case → Verify file download

### Accessibility Testing

**Requirements**:
- Keyboard navigation for all interactive elements
- ARIA labels for screen readers
- Color contrast ratios meeting WCAG AA standards
- Focus indicators on all focusable elements
- Alt text for all images and icons

### Performance Testing

**Metrics**:
- Initial page load: < 2 seconds
- Case grid render with 100 cases: < 500ms
- Filter application: < 100ms
- Modal open/close: < 200ms
- Search results update: < 150ms

### Browser Compatibility Testing

**Target Browsers**:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Mobile Responsiveness Testing

**Target Devices**:
- iPhone (iOS 14+)
- Android phones (Android 10+)
- iPad (iOS 14+)
- Android tablets (Android 10+)

## Implementation Notes

### Color Palette

**Sea Blue/Green Theme**:
- Primary: #17a2b8 (Bootstrap info/teal)
- Secondary: #20c997 (Bootstrap success/mint)
- Accent: #0dcaf0 (Cyan)
- Light: #d1ecf1 (Light cyan background)
- Dark: #0c7489 (Dark teal)

**Gradients**:
- Hero: `radial-gradient(circle at bottom right, rgba(255,255,255,0.3) 0%, #17a2b8 80%)`
- Buttons: `linear-gradient(135deg, #17a2b8 0%, #20c997 100%)`
- Cards: `linear-gradient(135deg, rgba(23,162,184,0.05), rgba(32,201,151,0.05))`

**Status Colors** (complementary to theme):
- Pending: #ffc107 (Amber)
- In Progress: #17a2b8 (Teal - matches theme)
- Resolved: #28a745 (Green)
- Closed: #6c757d (Gray)

**Priority Colors**:
- Critical: #dc3545 (Red)
- High: #fd7e14 (Orange)
- Medium: #ffc107 (Amber)
- Low: #28a745 (Green)

### Firebase Collections

**Collection Structure**:
```
/cases/{caseId}
/officers/{officerId}
/admins/{adminId}
/timeline/{entryId}
/assignments/{assignmentId}
```

**Security Rules**:
- Only authenticated admins can read/write
- Officers can read cases assigned to them
- Users cannot access admin dashboard data

### Real-time Updates

**Firestore Listeners**:
- Listen to `/cases` collection for real-time case updates
- Listen to `/officers` collection for workload changes
- Update UI immediately when data changes
- Show loading states during updates

### Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1440px

### Animation and Transitions

- Card hover: `transform: translateY(-5px)` with 0.3s ease
- Modal fade: 0.3s ease-in-out
- Filter updates: 0.2s ease
- Button hover: 0.2s ease with slight scale

### Accessibility Features

- Semantic HTML5 elements
- ARIA labels for all interactive elements
- Keyboard shortcuts for common actions
- Focus management in modals
- Screen reader announcements for dynamic updates
