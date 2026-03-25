## ADDED Requirements

### Requirement: Records are isolated by baby
The system SHALL ensure all records are associated with a specific baby and only visible when that baby is selected.

#### Scenario: View records for selected baby
- **WHEN** user has selected baby A
- **THEN** timeline displays only records belonging to baby A
- **AND** record count and statistics reflect baby A only

#### Scenario: Create record for current baby
- **WHEN** user creates a new record while baby A is selected
- **THEN** system associates the record with baby A
- **AND** record appears in baby A's timeline

#### Scenario: Switch baby updates displayed data
- **WHEN** user switches from baby A to baby B
- **THEN** timeline refreshes to show baby B's records
- **AND** statistics update to reflect baby B's data
- **AND** baby A's records are no longer visible

### Requirement: Statistics are isolated by baby
The system SHALL calculate and display statistics (today summary, charts) based only on the currently selected baby's records.

#### Scenario: Today summary per baby
- **WHEN** user views today summary
- **THEN** all metrics (feeding count, diaper changes, sleep duration) are calculated from current baby's records only

#### Scenario: Stats page per baby
- **WHEN** user navigates to stats page
- **THEN** all charts and historical data reflect current baby's records

### Requirement: API enforces baby data isolation
The system SHALL enforce data isolation at the API level, ensuring users can only access records belonging to their selected/current baby.

#### Scenario: API filters by babyId
- **WHEN** API receives request for records with babyId parameter
- **THEN** system returns only records matching that babyId
- **AND** records belong to the authenticated user

#### Scenario: API rejects unauthorized baby access
- **WHEN** API receives request with babyId not belonging to current user
- **THEN** system returns 403 forbidden error
