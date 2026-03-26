## ADDED Requirements

### Requirement: Responsive header layout adaptation
The system SHALL adapt the header layout based on screen width to ensure optimal display across mobile devices from 4.7 to 6.7 inches.

#### Scenario: Display on large screens (414px+)
- **WHEN** screen width is 414px or more
- **THEN** header displays all five buttons in a single horizontal row
- **AND** buttons maintain equal spacing
- **AND** date display shows full formatted date

#### Scenario: Display on medium screens (375px-413px)
- **WHEN** screen width is between 375px and 413px
- **THEN** header uses two-row layout
- **AND** top row contains stats button, baby switcher, and settings button
- **AND** bottom row contains date display centered
- **AND** logout button moves to top row right side

#### Scenario: Display on small screens (320px-374px)
- **WHEN** screen width is between 320px and 374px
- **THEN** header uses compact two-row layout
- **AND** buttons reduce padding to 6px 10px
- **AND** date display uses abbreviated format if needed
- **AND** logout button remains accessible

### Requirement: Date display text adaptation
The system SHALL ensure date text is always fully visible without truncating or overflowing.

#### Scenario: Display standard date format
- **WHEN** date is a regular day (e.g., "3月15日 周三")
- **THEN** date displays in full width container
- **AND** no text truncation occurs

#### Scenario: Display today indicator
- **WHEN** selected date is today
- **THEN** display shows "今天" instead of full date format
- **AND** container maintains minimum width

#### Scenario: Handle long date text
- **WHEN** date format produces longer text (e.g., "10月10日 周六")
- **THEN** date container expands to fit content
- **AND** adjacent elements shrink if space is available
- **AND** button minimum widths are preserved

### Requirement: Touch target protection
The system SHALL ensure all interactive buttons maintain minimum touch target size.

#### Scenario: Verify touch target size on large screens
- **WHEN** screen width is 414px or more
- **THEN** each button has minimum width of 44px
- **AND** each button has minimum height of 44px
- **AND** spacing between buttons does not reduce touch targets

#### Scenario: Verify touch target size on small screens
- **WHEN** screen width is less than 375px
- **THEN** buttons maintain 44px minimum width
- **AND** button padding may reduce but touch target remains 44px minimum
- **AND** layout reorganizes before reducing touch targets

### Requirement: Visual consistency across breakpoints
The system SHALL maintain visual harmony and consistent styling across all screen sizes.

#### Scenario: Maintain button styling consistency
- **WHEN** layout adapts to different screen sizes
- **THEN** button colors remain unchanged
- **AND** button border-radius remains consistent
- **AND** font sizes scale proportionally

#### Scenario: Smooth layout transitions
- **WHEN** window resizes between breakpoints
- **THEN** layout changes smoothly without jarring jumps
- **AND** no content overlap or overflow occurs during transition
