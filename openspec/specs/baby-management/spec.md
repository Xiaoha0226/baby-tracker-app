## ADDED Requirements

### Requirement: User can create baby profile
The system SHALL allow authenticated users to create a baby profile with name, birthDate, gender, and optional avatar.

#### Scenario: Successfully create baby
- **WHEN** user submits baby creation form with valid name and birthDate
- **THEN** system creates baby profile associated with current user
- **AND** returns the created baby with generated ID

#### Scenario: Create baby without optional fields
- **WHEN** user submits baby creation form with only name and birthDate
- **THEN** system creates baby with gender and avatar set to null

#### Scenario: Reject baby creation with missing required fields
- **WHEN** user submits baby creation form without name or birthDate
- **THEN** system returns 400 error with validation message

### Requirement: User can view their babies
The system SHALL allow authenticated users to retrieve a list of all babies they have created.

#### Scenario: Retrieve baby list
- **WHEN** user requests their baby list
- **THEN** system returns array of all babies associated with the user
- **AND** each baby includes id, name, birthDate, gender, avatar

#### Scenario: Empty baby list
- **WHEN** user requests baby list but has no babies
- **THEN** system returns empty array

### Requirement: User can update baby profile
The system SHALL allow authenticated users to update their baby's information.

#### Scenario: Successfully update baby
- **WHEN** user submits update request with valid baby ID and new information
- **THEN** system updates the baby profile
- **AND** returns the updated baby

#### Scenario: Reject update of non-owned baby
- **WHEN** user attempts to update a baby not belonging to them
- **THEN** system returns 403 forbidden error

### Requirement: User can delete baby profile
The system SHALL allow authenticated users to delete their baby profiles.

#### Scenario: Successfully delete baby
- **WHEN** user confirms deletion of their baby
- **THEN** system deletes the baby profile
- **AND** all associated records are cascade deleted
- **AND** returns success confirmation

#### Scenario: Reject deletion of non-owned baby
- **WHEN** user attempts to delete a baby not belonging to them
- **THEN** system returns 403 forbidden error

### Requirement: System creates default baby for new users
The system SHALL automatically create a default baby named "宝宝" when a user first accesses the app without any babies.

#### Scenario: Auto-create default baby
- **WHEN** user logs in and has no babies
- **THEN** system automatically creates a baby with name "宝宝"
- **AND** sets birthDate to current date
