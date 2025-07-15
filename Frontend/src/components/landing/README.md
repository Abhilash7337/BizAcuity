# Landing Page Components

This folder contains the refactored components for the Landing page, which was previously a monolithic 500+ line component.

## Components Overview

### 1. `HeroSection.jsx`
- **Purpose**: Welcome section with user greeting and "Start New Design" button
- **Props**:
  - `userName`: The logged-in user's name
  - `isVisible`: Controls animation visibility
  - `onNewDesign`: Callback for starting a new design
- **Features**: Animated welcome message, responsive design button

### 2. `DraftsGrid.jsx`
- **Purpose**: Display user's saved drafts with loading/error states
- **Props**:
  - `drafts`: Array of draft objects
  - `loading`: Loading state boolean
  - `error`: Error message string
  - `isVisible`: Controls animation visibility
  - `onNewDesign`: Callback for creating new design
  - `onOpenDraft`: Callback for opening existing draft
  - `onDeleteClick`: Callback for deleting draft
  - `formatDate`: Function to format dates
- **Sub-components**:
  - `DraftCard`: Individual draft display card
  - `EmptyDraftsState`: Display when no drafts exist
  - `LoadingState`: Spinner for loading
  - `ErrorState`: Error display

### 3. `SharedDraftsGrid.jsx`
- **Purpose**: Display drafts shared with the user
- **Props**:
  - `sharedDrafts`: Array of shared draft objects
  - `sharedLoading`: Loading state boolean
  - `sharedError`: Error message string
  - `isVisible`: Controls animation visibility
  - `onOpenDraft`: Callback for opening shared draft
  - `onRemoveClick`: Callback for removing from shared list
  - `formatDate`: Function to format dates
- **Sub-components**:
  - `SharedDraftCard`: Individual shared draft card
  - `EmptySharedState`: Display when no shared drafts
  - `LoadingState`: Spinner for loading
  - `ErrorState`: Error display

### 4. `DeleteModals.jsx`
- **Purpose**: Confirmation modals for delete actions
- **Components**:
  - `DeleteModal`: Generic delete confirmation modal
  - `SharedDeleteModal`: Specific modal for removing shared drafts
- **Props**:
  - `show`: Boolean to control modal visibility
  - `title`: Modal title
  - `message`: Confirmation message
  - `itemName`: Name of item being deleted
  - `onCancel`: Cancel callback
  - `onConfirm`: Confirm callback
  - `confirmText`: Text for confirm button
  - `confirmButtonClass`: CSS classes for confirm button

### 5. `AnimatedBackground.jsx`
- **Purpose**: Floating picture frame decorations for visual appeal
- **Features**: Animated frames with rotation and color gradients

## Benefits of Refactoring

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the application
3. **Testability**: Smaller components are easier to unit test
4. **Readability**: Code is more organized and easier to understand
5. **Performance**: Components can be optimized individually

## Usage

```jsx
import { 
  HeroSection, 
  DraftsGrid, 
  SharedDraftsGrid, 
  DeleteModal, 
  SharedDeleteModal, 
  AnimatedBackground 
} from '../components/landing';

// Use in Landing page component
<HeroSection 
  userName={registeredUser.name}
  isVisible={isVisible}
  onNewDesign={handleNewDesign}
/>
```

## File Structure

```
Frontend/src/components/landing/
├── AnimatedBackground.jsx    # Background animations
├── DeleteModals.jsx         # Delete confirmation modals
├── DraftsGrid.jsx          # User's saved drafts section
├── HeroSection.jsx         # Welcome section
├── SharedDraftsGrid.jsx    # Shared drafts section
└── index.js               # Export all components
```

This refactoring reduces the main Landing component from 500+ lines to ~150 lines while maintaining all functionality and improving code organization.
