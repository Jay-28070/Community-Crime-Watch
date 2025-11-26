# Privacy & Incident Separation System

## Overview
The system now separates personal incidents from general community reports, with enhanced privacy protection for victims.

## Key Privacy Features

### 1. Location Privacy for Personal Incidents

**For Victims (Personal Incidents):**
- Exact location is NOT shown on public map
- Location is stored privately and only visible to police
- Address shows as "Location withheld for privacy" to public
- Victims are redirected to dashboard (not map) after reporting

**For Community Reports:**
- Location is public and shown on map
- Anyone can see the incident location
- Helps community awareness

### 2. Data Storage Structure

```javascript
// Personal Incident
{
  incidentType: "personal",
  lat: null,                    // Public - hidden
  lng: null,                    // Public - hidden
  privateLat: -26.2041,        // Police only
  privateLng: 28.0473,         // Police only
  address: "Location withheld for privacy",  // Public
  privateAddress: "123 Main St, Johannesburg", // Police only
  contact: "required@email.com" // Required field
}

// General Report
{
  incidentType: "other",
  lat: -26.2041,               // Public - shown on map
  lng: 28.0473,                // Public - shown on map
  address: "123 Main St",      // Public
  contact: "optional@email.com" // Optional field
}
```

## Police Dashboard Features

### 1. Separate Tabs for Incident Types

**Personal Incidents Tab (Red):**
- Shows only incidents that happened to individuals
- Displays victim contact information (highlighted)
- Shows private location data
- Higher priority incidents
- Badge: "⚠️ PERSONAL INCIDENT - Victim requires follow-up"

**General Reports Tab (Blue):**
- Shows community-reported incidents
- Public location data
- Optional contact information
- Badge: "📢 Community Report"

### 2. Visual Indicators

**Personal Incidents:**
- Red color scheme (#e74c3c)
- Yellow highlighted boxes for:
  - Private location (with 🔒 icon)
  - Contact information (with ⚠️ warning)
- "Private - Only visible to police" notes
- Clickable phone numbers for quick contact

**General Reports:**
- Blue color scheme (#3498db)
- Standard display
- Public information

### 3. Tab Counts
- Real-time count of incidents in each category
- Example: "Personal Incidents (5)" and "General Reports (12)"

## User Experience Flow

### Reporting a Personal Incident:
1. User selects "This happened to me personally"
2. Contact field becomes REQUIRED (red asterisk)
3. User fills out form with location
4. System stores location privately
5. Success message: "Your exact location is private and only visible to police"
6. Redirects to dashboard (NOT map)

### Reporting a General Incident:
1. User selects "Someone else / General community report"
2. Contact field remains OPTIONAL
3. User fills out form
4. Location is public
5. Success message shows priority level
6. Redirects to map showing the incident

## Police Workflow

### Viewing Personal Incidents:
1. Click "Personal Incidents" tab (default view)
2. See all victim reports sorted by urgency
3. Critical personal incidents appear first
4. View private location and contact info
5. Click phone number to call victim
6. Update status as case progresses

### Viewing General Reports:
1. Click "General Reports" tab
2. See community-reported incidents
3. Sorted by urgency
4. View public location on map
5. Update status as needed

## Privacy Benefits

1. **Victim Protection**: Personal incident locations not exposed publicly
2. **Prevents Targeting**: Criminals can't identify victim locations
3. **Encourages Reporting**: Victims feel safer reporting knowing location is private
4. **Police Access**: Officers still have full location data for investigation
5. **Community Awareness**: General reports still visible for community safety

## Map Behavior

### Public Map (map.html):
- Shows ONLY general community reports
- Filters out all personal incidents
- Filters out resolved cases
- Anyone can view

### Police View:
- Can view location of personal incidents via "View on Map" button
- Uses private coordinates for personal incidents
- Full access to all incident locations

## Technical Implementation

### Filtering on Map:
```javascript
// Filter out personal incidents from public map
userReports = userReports.filter(report => 
    report.status !== 'resolved' && 
    report.incidentType !== 'personal' && // Privacy protection
    report.lat && report.lng // Only valid coordinates
);
```

### Police Dashboard Tabs:
```javascript
// Separate personal and general incidents
let currentIncidentType = 'personal'; // Default view

// Tab switching updates filter
reports = reports.filter(r => r.incidentType === currentIncidentType);
```

### Location Display Logic:
```javascript
// Police see private location for personal incidents
const displayLat = report.incidentType === 'personal' ? 
    (report.privateLat || report.lat) : report.lat;
const displayAddress = report.incidentType === 'personal' ? 
    (report.privateAddress || report.address) : report.address;
```

## Security Considerations

1. **Data Separation**: Private data stored in separate fields
2. **Access Control**: Only police dashboard shows private data
3. **Map Filtering**: Personal incidents never appear on public map
4. **No Leakage**: Public views cannot access private fields
5. **Audit Trail**: All status changes tracked with timestamps

## User Communication

### Success Messages:

**Personal Incident:**
```
Crime report submitted successfully!
Priority Level: CRITICAL
CRITICAL - Police will be notified immediately
🔒 Your exact location is private and only visible to police
Redirecting to dashboard...
```

**General Report:**
```
Crime report submitted successfully!
Priority Level: MEDIUM
MEDIUM PRIORITY
Redirecting to map...
```

## Benefits Summary

### For Victims:
- ✅ Privacy protected
- ✅ Location not exposed publicly
- ✅ Direct police contact
- ✅ Higher priority handling
- ✅ Safe to report sensitive incidents

### For Police:
- ✅ Clear separation of incident types
- ✅ Full access to victim information
- ✅ Easy victim contact
- ✅ Prioritized workflow
- ✅ Better case management

### For Community:
- ✅ Awareness of general crime trends
- ✅ Public map shows community reports
- ✅ No victim information exposed
- ✅ Encourages community reporting
- ✅ Maintains public safety awareness

## Files Modified

1. **js/report.js** - Privacy-aware data storage
2. **js/map-script.js** - Filter personal incidents from public map
3. **js/alertsPolice.js** - Separate tabs and private data display
4. **pages/alertsPolice.html** - Tab interface for incident types

## Testing Checklist

- [ ] Personal incident location hidden on public map
- [ ] General report location shown on public map
- [ ] Police can see private location for personal incidents
- [ ] Personal incidents tab shows only personal reports
- [ ] General reports tab shows only community reports
- [ ] Tab counts update correctly
- [ ] Private location highlighted in police view
- [ ] Contact info highlighted for personal incidents
- [ ] Success message shows privacy note for personal incidents
- [ ] Personal incidents redirect to dashboard
- [ ] General reports redirect to map
- [ ] View on Map button works for both types
- [ ] Filters work within each tab
