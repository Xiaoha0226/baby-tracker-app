## ADDED Requirements

### Requirement: Display baby switcher in header
The system SHALL display a baby switcher component in the home page header when user has at least one baby.

#### Scenario: Show switcher with single baby
- **WHEN** user has one baby
- **THEN** switcher displays baby name
- **AND** switcher is clickable but dropdown shows only one option

#### Scenario: Show switcher with multiple babies
- **WHEN** user has multiple babies
- **THEN** switcher displays current baby name with dropdown indicator
- **AND** clicking opens dropdown with all baby names

### Requirement: Switch current baby
The system SHALL allow users to switch the currently active baby from the switcher component.

#### Scenario: Select different baby from dropdown
- **WHEN** user clicks on a different baby in the dropdown
- **THEN** system sets selected baby as current
- **AND** closes the dropdown
- **AND** all displayed data refreshes to show selected baby's records
- **AND** persists current baby ID to localStorage

#### Scenario: Current baby persists on page refresh
- **WHEN** user refreshes the page
- **THEN** system reads current baby ID from localStorage
- **AND** restores the previously selected baby

### Requirement: Navigate to baby management
The system SHALL provide a way to access baby management page from the switcher.

#### Scenario: Access manage babies page
- **WHEN** user clicks "管理宝宝" option in switcher dropdown
- **THEN** system navigates to baby management page
- **AND** dropdown closes

### Requirement: Visual indication of current baby
The system SHALL visually indicate which baby is currently selected in the switcher dropdown.

#### Scenario: Highlight current baby
- **WHEN** dropdown is open
- **THEN** current baby option is visually highlighted (checkmark or different background)
