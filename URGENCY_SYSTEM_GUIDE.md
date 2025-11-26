# Crime Report Urgency System Guide

## Overview
The crime reporting system now includes an intelligent urgency-based prioritization system that ensures critical cases receive immediate attention while preventing dashboard overload.

## Key Features

### 1. Incident Type Selection
When reporting a crime, users must select:
- **"This happened to me personally"** - For direct victims
- **"Someone else / General community report"** - For witnessed incidents or community concerns

### 2. Mandatory Contact Information
- **Personal Incidents**: Contact information becomes REQUIRED
  - Ensures police can follow up with victims
  - Field is marked with red asterisk (*)
  - Form validation prevents submission without contact info
  
- **Community Reports**: Contact information remains OPTIONAL
  - Allows anonymous reporting
  - Reduces friction for general observations

### 3. Automatic Urgency Calculation

The system automatically assigns urgency levels based on:
1. **Crime Type** (severity of the crime)
2. **Incident Type** (personal vs. community)

#### Urgency Levels:

**CRITICAL** (Highest Priority)
- Personal incidents involving: Assault, Robbery, Arson, Drug Activity
- Displayed at the very top of police dashboard
- Red color coding (#c0392b)

**HIGH**
- Personal incidents involving: Burglary, Vehicle Theft, Harassment
- Community reports of: Assault, Robbery, Arson, Drug Activity
- Orange-red color coding (#e74c3c)

**MEDIUM**
- Personal incidents involving: Theft, Fraud, Vandalism, etc.
- Community reports of: Burglary, Vehicle Theft, Harassment
- Orange color coding (#e67e22)

**LOW**
- Community reports of: Theft, Fraud, Vandalism, Trespassing, Suspicious Activity
- Yellow color coding (#f39c12)

### 4. Police Dashboard Sorting

Reports are automatically sorted by:
1. **Urgency Level** (Critical → High → Medium → Low)
2. **Report Date** (Most recent first within each urgency level)

This ensures:
- Critical personal incidents appear first
- Police see the most urgent cases immediately
- Dashboard isn't overwhelmed with minor reports
- All reports are still accessible but properly prioritized

### 5. Visual Indicators

**On Police Dashboard:**
- Large urgency badge (CRITICAL, HIGH, MEDIUM, LOW)
- Color-coded priority indicators
- Special badge for personal incidents: "⚠️ PERSONAL INCIDENT - Victim requires follow-up"
- Highlighted contact information for personal incidents
- Community reports badge: "📢 Community Report"

**On Submission:**
- Success message shows assigned priority level
- Explains what the priority means:
  - Critical: "Police will be notified immediately"
  - High: "Police will review soon"
  - Medium: "Medium priority"
  - Low: "Logged for review"

## AI Functionality Fixes

### Issues Resolved:
1. **API Endpoint**: Updated to use `gemini-1.5-flash-latest` model
2. **Request Format**: Added proper `generationConfig` parameters
3. **Response Parsing**: Enhanced to handle markdown code blocks and various JSON formats
4. **Error Handling**: Added detailed console logging for debugging
5. **Loading States**: Integrated page loader for better UX

### AI Features:
- **Text Input**: Describe incident in natural language
- **Voice Input**: Record description using speech recognition
- **Photo Input**: Upload/capture image for AI analysis
- All methods automatically categorize crime type and generate summary

## Usage Flow

### For Users:
1. Select incident type (personal or community)
2. If personal, contact info becomes required
3. Use AI or manual form to describe incident
4. Submit report
5. System calculates urgency automatically
6. Receive confirmation with priority level

### For Police:
1. Dashboard shows reports sorted by urgency
2. Critical personal incidents at top
3. Each report shows:
   - Urgency level (color-coded)
   - Incident type (personal vs community)
   - Contact information (highlighted for personal)
   - All incident details
4. Can filter by urgency, status, or crime type
5. Update status (Confirm → In Progress → Resolved)

## Benefits

1. **Victim Support**: Ensures personal incidents get immediate attention
2. **Efficient Resource Allocation**: Police focus on critical cases first
3. **Reduced Overload**: Minor community reports don't bury urgent cases
4. **Better Follow-up**: Mandatory contact for victims enables proper investigation
5. **Transparency**: Users know their report's priority level
6. **Flexibility**: Community members can still report anonymously for non-personal incidents

## Technical Implementation

### Data Structure:
```javascript
{
  id: timestamp,
  type: "Crime Type",
  incidentType: "personal" | "other",
  urgency: "critical" | "high" | "medium" | "low",
  description: "...",
  contact: "required for personal, optional for other",
  reporterName: "...",
  // ... other fields
}
```

### Urgency Calculation Logic:
```javascript
function calculateUrgency(crimeType, incidentType) {
  const highUrgencyCrimes = ['Assault', 'Robbery', 'Arson', 'Drug Activity'];
  const mediumUrgencyCrimes = ['Burglary', 'Vehicle Theft', 'Harassment'];
  
  if (incidentType === 'personal') {
    if (highUrgencyCrimes.includes(crimeType)) return 'critical';
    if (mediumUrgencyCrimes.includes(crimeType)) return 'high';
    return 'medium';
  } else {
    if (highUrgencyCrimes.includes(crimeType)) return 'high';
    if (mediumUrgencyCrimes.includes(crimeType)) return 'medium';
    return 'low';
  }
}
```

## Files Modified

1. **pages/report.html** - Added incident type selector and dynamic contact field
2. **js/report.js** - Implemented urgency calculation and validation
3. **js/alertsPolice.js** - Updated to display urgency and sort reports
4. **pages/alertsPolice.html** - Added priority filter option

## Testing Checklist

- [ ] Personal incident requires contact info
- [ ] Community report allows optional contact
- [ ] Urgency calculated correctly for all combinations
- [ ] Police dashboard sorts by urgency
- [ ] Visual indicators display correctly
- [ ] AI text analysis works
- [ ] AI voice analysis works
- [ ] AI photo analysis works
- [ ] Form validation prevents submission without required fields
- [ ] Success message shows correct priority level
