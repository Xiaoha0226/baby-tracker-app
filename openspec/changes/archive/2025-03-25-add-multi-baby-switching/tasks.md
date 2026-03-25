## 1. Database Schema Changes

- [x] 1.1 Create babies table migration with fields: id, userId, name, birthDate, gender, avatar, createdAt, updatedAt
- [x] 1.2 Add baby_id column to records table migration
- [x] 1.3 Create migration to auto-create default baby for existing users
- [x] 1.4 Create migration to associate existing records with default babies

## 2. Backend - Baby Module

- [x] 2.1 Create Baby entity with TypeORM decorators
- [x] 2.2 Create CreateBabyDto with validation rules
- [x] 2.3 Create UpdateBabyDto
- [x] 2.4 Implement BabiesController with CRUD endpoints (POST, GET, PATCH, DELETE)
- [x] 2.5 Implement BabiesService with CRUD operations
- [x] 2.6 Add ownership validation in service layer
- [x] 2.7 Create BabiesModule and register in AppModule

## 3. Backend - Records Module Updates

- [x] 3.1 Update Record entity to add babyId column and ManyToOne relation
- [x] 3.2 Update CreateRecordDto to require babyId
- [x] 3.3 Update RecordsController to accept babyId query parameter
- [x] 3.4 Update RecordsService to filter by babyId in all queries
- [x] 3.5 Update today summary endpoint to accept babyId parameter
- [x] 3.6 Update statistics endpoint to accept babyId parameter
- [x] 3.7 Add baby ownership validation for record operations

## 4. Frontend - Baby Store

- [x] 4.1 Create babies.ts Pinia store with babies list and currentBabyId state
- [x] 4.2 Add localStorage persistence for currentBabyId
- [x] 4.3 Implement fetchBabies action
- [x] 4.4 Implement createBaby action
- [x] 4.5 Implement updateBaby action
- [x] 4.6 Implement deleteBaby action
- [x] 4.7 Implement setCurrentBaby action
- [x] 4.8 Add auto-create default baby logic on first load

## 5. Frontend - Baby API

- [x] 5.1 Add baby API endpoints to api/index.ts
- [x] 5.2 Update records API to include babyId parameter
- [x] 5.3 Update today summary API to include babyId parameter
- [x] 5.4 Update statistics API to include babyId parameter

## 6. Frontend - Baby Switcher Component

- [x] 6.1 Create BabySwitcher.vue component with dropdown UI
- [x] 6.2 Display current baby name with dropdown indicator
- [x] 6.3 Implement dropdown with list of all babies
- [x] 6.4 Highlight current baby in dropdown
- [x] 6.5 Handle baby selection and update currentBabyId
- [x] 6.6 Add "管理宝宝" link to baby management page
- [x] 6.7 Integrate BabySwitcher into Home.vue header

## 7. Frontend - Baby Management Page

- [x] 7.1 Create Babies.vue view for baby management
- [x] 7.2 Display list of babies with avatar, name, birthDate
- [x] 7.3 Add "添加宝宝" button and form
- [x] 7.4 Implement baby editing with inline or modal form
- [x] 7.5 Implement baby deletion with confirmation dialog
- [x] 7.6 Add route for /babies in router

## 8. Frontend - Update Existing Components

- [x] 8.1 Update Home.vue to pass currentBabyId to fetchRecords
- [x] 8.2 Update Home.vue to pass currentBabyId to fetchTodaySummary
- [x] 8.3 Update VoiceInput.vue to include currentBabyId when creating records
- [x] 8.4 Update Stats.vue to use currentBabyId for statistics
- [x] 8.5 Watch currentBabyId changes and refresh data automatically

## 9. Testing

- [x] 9.1 Test baby CRUD API endpoints
- [x] 9.2 Test records filtering by babyId
- [x] 9.3 Test baby switcher UI functionality
- [x] 9.4 Test data isolation between babies
- [x] 9.5 Test persistence of current baby selection
- [x] 9.6 Run E2E tests to ensure no regressions

## 10. Data Migration (Production)

- [ ] 10.1 Backup production database
- [ ] 10.2 Run migrations in staging environment
- [ ] 10.3 Verify data integrity after migration
- [ ] 10.4 Deploy to production with migrations
