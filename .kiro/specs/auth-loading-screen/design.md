# Design Document: Authentication Loading Screen

## Overview

This feature enhances the user experience during authentication by adding visual loading indicators to the login and signup processes. The loading screen provides immediate feedback when users submit credentials or use Google authentication, preventing confusion and duplicate submissions while maintaining the application's visual design consistency.

## Architecture

The loading screen will be implemented as a reusable component that can be triggered from the authentication flow. The architecture follows these principles:

1. **Separation of Concerns**: Loading screen logic is separated from authentication logic
2. **Reusability**: A single loading screen component serves both login and signup pages
3. **State Management**: Clear show/hide methods control loading screen visibility
4. **Non-blocking**: Loading screen operates asynchronously without blocking authentication

### Component Structure

```
Authentication Pages (login.html, signup.html)
    ↓
Loading Screen Component (HTML + CSS)
    ↓
Loading Screen Controller (JavaScript)
    ↓
Authentication Flow (script.js)
```

## Components and Interfaces

### 1. Loading Screen HTML Component

A modal overlay containing:
- Semi-transparent backdrop
- Centered container with spinner
- Descriptive text indicating current action
- Consistent styling with application theme

### 2. Loading Screen Controller

**Module**: `js/loadingScreen.js`

**Public Interface**:
```javascript
// Show loading screen with custom message
function showLoading(message = "Processing...")

// Hide loading screen
function hideLoading()

// Check if loading screen is currently visible
function isLoading()
```

**Responsibilities**:
- Display and hide the loading overlay
- Disable/enable form elements during loading
- Manage loading screen state
- Prevent duplicate loading screens

### 3. Authentication Integration

**Modified Files**: `js/script.js`

**Integration Points**:
- Login form submission handler
- Signup form submission handler
- Google Sign-In button handler

**Flow**:
1. User triggers authentication action
2. Show loading screen with appropriate message
3. Disable form inputs and buttons
4. Execute authentication logic
5. Hide loading screen on completion (success or failure)
6. Re-enable form inputs if authentication fails

## Data Models

### Loading Screen State

```javascript
{
  isVisible: boolean,        // Current visibility state
  message: string,           // Current loading message
  disabledElements: Array    // References to disabled form elements
}
```

### Loading Messages

```javascript
const LOADING_MESSAGES = {
  LOGIN: "Logging in...",
  SIGNUP: "Creating your account...",
  GOOGLE_AUTH: "Authenticating with Google..."
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, several properties are logically redundant because the loading screen component should behave consistently regardless of which authentication method triggers it (login form, signup form, or Google Sign-In). The core behaviors - showing immediately, preventing resubmission, hiding on completion, and disabling elements - are universal properties of the loading screen itself, not specific to each authentication method.

The following properties have been consolidated:
- Properties 1.1, 2.1, and 3.1 all test "show loading immediately" → Combined into Property 1
- Properties 1.2, 2.2, and 3.2 all test "prevent resubmission" → Combined into Property 2
- Properties 1.3, 2.3, and 3.3 all test "hide on success" → Combined into Property 3
- Properties 1.4, 2.4, and 3.4 all test "hide on failure" → Combined into Property 4
- Properties 1.5, 2.5, and 3.5 all test "disable elements" → Combined into Property 5

### Correctness Properties

Property 1: Loading screen displays immediately on authentication trigger
*For any* authentication action (login, signup, or Google Sign-In), when the action is triggered, the loading screen should become visible immediately
**Validates: Requirements 1.1, 2.1, 3.1**

Property 2: Form resubmission is prevented during loading
*For any* authentication form, while the loading screen is visible, all form submission buttons and the Google Sign-In button should be disabled
**Validates: Requirements 1.2, 2.2, 3.2**

Property 3: Loading screen hides on successful authentication
*For any* authentication action that completes successfully, the loading screen should be hidden before the redirect occurs
**Validates: Requirements 1.3, 2.3, 3.3**

Property 4: Loading screen hides on authentication failure
*For any* authentication action that fails, the loading screen should be hidden to allow the user to retry
**Validates: Requirements 1.4, 2.4, 3.4**

Property 5: Form elements are disabled during loading
*For any* form with a visible loading screen, all input fields and buttons should be in a disabled state
**Validates: Requirements 1.5, 2.5, 3.5**

Property 6: Loading screen displays custom messages
*For any* loading message passed to the loading screen, that message should be visible in the loading screen's text content
**Validates: Requirements 4.2**

## Error Handling

### Authentication Errors

1. **Network Failures**: If authentication fails due to network issues, hide loading screen and display user-friendly error message
2. **Invalid Credentials**: Hide loading screen and show specific error from Firebase
3. **Timeout**: If authentication takes longer than expected, maintain loading screen but consider adding timeout handling in future iterations

### Loading Screen Errors

1. **Duplicate Show Calls**: Prevent multiple loading screens from appearing simultaneously
2. **Missing Hide Call**: Ensure loading screen is always hidden, even if authentication throws unexpected errors
3. **Element Not Found**: Gracefully handle cases where loading screen HTML is missing

### Error Recovery

- Always hide loading screen in `finally` blocks to ensure cleanup
- Re-enable form elements if authentication fails
- Log errors to console for debugging while showing user-friendly messages

## Testing Strategy

This feature will use a dual testing approach combining unit tests and property-based tests to ensure comprehensive coverage.

### Unit Testing

Unit tests will verify specific examples and integration points:

- Loading screen shows/hides correctly for specific scenarios
- Correct loading messages are displayed for each auth method
- Form elements are properly disabled/enabled
- Loading screen HTML structure is correct
- CSS classes are applied correctly

**Testing Framework**: Jest with jsdom for DOM manipulation testing

### Property-Based Testing

Property-based tests will verify universal properties across all inputs:

- Each correctness property will be implemented as a property-based test
- Tests will use random authentication scenarios (success/failure)
- Tests will verify behavior across different form states
- Each test will run a minimum of 100 iterations

**Testing Framework**: fast-check (JavaScript property-based testing library)

**Property Test Requirements**:
- Each property-based test must run at least 100 iterations
- Each test must be tagged with: `**Feature: auth-loading-screen, Property {number}: {property_text}**`
- Each correctness property must be implemented by a single property-based test
- Tests should generate random scenarios including success/failure cases

### Integration Testing

- Test complete authentication flows with loading screen
- Verify loading screen works with actual Firebase authentication
- Test across different browsers and devices

## Implementation Notes

### CSS Considerations

- Use `position: fixed` for overlay to cover entire viewport
- Use `z-index` high enough to appear above all other content
- Use CSS animations for smooth fade-in/fade-out transitions
- Ensure loading screen is responsive on mobile devices

### JavaScript Considerations

- Use module pattern to encapsulate loading screen logic
- Store references to disabled elements to re-enable them later
- Use `try-finally` blocks to ensure loading screen is always hidden
- Debounce rapid show/hide calls to prevent flickering

### Accessibility

- Add `aria-live="polite"` to announce loading state to screen readers
- Add `role="status"` to loading container
- Ensure loading message is descriptive for screen reader users
- Maintain focus management during loading state

### Performance

- Loading screen should appear within 50ms of trigger
- Use CSS transforms for animations (GPU-accelerated)
- Minimize DOM manipulation during show/hide operations
- Reuse single loading screen instance rather than creating new ones
