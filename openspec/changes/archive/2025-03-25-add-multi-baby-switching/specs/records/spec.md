## MODIFIED Requirements

### Requirement: Create record requires baby association
The system SHALL require all new records to be associated with a baby.

#### Scenario: Create record with babyId
- **WHEN** user submits record creation with babyId
- **THEN** system creates record associated with specified baby
- **AND** returns created record with babyId

#### Scenario: Reject record without babyId
- **WHEN** user submits record creation without babyId
- **THEN** system returns 400 error requiring babyId

### Requirement: Retrieve records filtered by baby
The system SHALL support retrieving records filtered by babyId.

#### Scenario: Get records by babyId
- **WHEN** user requests records with babyId query parameter
- **THEN** system returns only records for that baby
- **AND** applies other filters (date, type) within that baby's records

#### Scenario: Get records defaults to current baby
- **WHEN** user requests records without babyId but has current baby in session
- **THEN** system returns records for the current baby

### Requirement: Update record validates baby ownership
The system SHALL validate that users can only update records belonging to their babies.

#### Scenario: Update own baby's record
- **WHEN** user updates a record belonging to their baby
- **THEN** system updates the record successfully

#### Scenario: Reject update of other user's baby record
- **WHEN** user attempts to update a record not belonging to their baby
- **THEN** system returns 403 forbidden error

### Requirement: Delete record validates baby ownership
The system SHALL validate that users can only delete records belonging to their babies.

#### Scenario: Delete own baby's record
- **WHEN** user deletes a record belonging to their baby
- **THEN** system deletes the record successfully

#### Scenario: Reject deletion of other user's baby record
- **WHEN** user attempts to delete a record not belonging to their baby
- **THEN** system returns 403 forbidden error

### Requirement: Today summary filtered by baby
The system SHALL calculate today summary based on a specific baby's records.

#### Scenario: Get today summary for baby
- **WHEN** user requests today summary with babyId
- **THEN** system calculates metrics from that baby's today's records only

### Requirement: Statistics filtered by baby
The system SHALL calculate statistics based on a specific baby's records.

#### Scenario: Get stats for baby
- **WHEN** user requests statistics with babyId
- **THEN** system returns historical data for that baby only
