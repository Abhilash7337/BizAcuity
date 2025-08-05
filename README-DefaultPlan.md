# Default Plan Implementation

## Overview
A fixed FREE plan has been implemented that cannot be deleted and is automatically assigned to all new users.

## Features

### Backend Changes
1. **Plan Model Updates**:
   - Added `isDefault` field to mark the default plan
   - Added `isDeletable` field to prevent deletion of system plans

2. **Authentication Updates**:
   - New users are automatically assigned to the default plan
   - Fallback mechanism ensures users get the FREE plan even if no default is set

3. **Admin Protection**:
   - DELETE routes check if plan is deletable before allowing deletion
   - Error messages inform admin about system plan restrictions

### Frontend Changes
1. **Visual Indicators**:
   - Default plans show a "Default" badge in the plan list
   - Non-deletable plans show "System Plan" instead of delete button

2. **Admin Interface**:
   - "Init Default" button to create/update the default plan
   - Improved error handling for deletion attempts

## Usage

### For Administrators
1. **Initialize Default Plan**: Click "Init Default" button in Plan Management
2. **Edit Default Plan**: The default plan can be edited but not deleted
3. **Create Additional Plans**: Add premium plans as needed

### Default Plan Specifications
- **Name**: FREE
- **Price**: ₹0/month, ₹0/year
- **Features**: 
  - Basic Wall Design
  - Limited Templates
  - 3 Saved Drafts
- **Limits**:
  - 3 designs per month
  - 2 image uploads per design
- **Export**: Disabled
- **Status**: Active, Default, Non-deletable

## Automatic Behavior
- New users are automatically assigned to the default plan
- If no default plan exists, system falls back to any plan named "FREE"
- Default plan cannot be deleted through admin interface
- Default plan can be edited to update features and limits

## Manual Setup
If needed, you can run the initialization script:
```bash
cd Backend
node scripts/initDefaultPlan.js
```

## Notes
- Only one plan can be marked as default
- The default plan will always be the FREE plan
- Existing users keep their current plans
- Admin can upgrade/downgrade users manually if needed
