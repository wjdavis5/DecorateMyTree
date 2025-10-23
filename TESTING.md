# Testing Guide - Holiday Tree Decorator

This document describes the testing strategy and how to run tests for the Holiday Tree Decorator application.

## Testing Overview

The application has comprehensive testing coverage including:
- **Unit Tests**: Testing individual components and services
- **Integration Tests**: Testing component interactions
- **End-to-End Tests**: Testing complete user workflows using Playwright

## Test Statistics

- **Total Unit Tests**: 29
- **Code Coverage**: ~87% statement coverage
- **E2E Test Suites**: 3 (Home, Tree Creator, Navigation)
- **Browsers Tested**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari

## Running Tests

### Unit Tests

Run all unit tests once:
```bash
npm run test:unit
```

Run tests in watch mode (for development):
```bash
npm test
```

Run tests with code coverage:
```bash
npm run test:unit
```

Coverage reports are generated in `./coverage/holiday-tree-app/`

### End-to-End Tests

Run all E2E tests:
```bash
npm run test:e2e
```

Run E2E tests with UI mode (interactive):
```bash
npm run test:e2e:ui
```

Run E2E tests in debug mode:
```bash
npm run test:e2e:debug
```

### Run All Tests

Run both unit and E2E tests:
```bash
npm run test:all
```

## Test Structure

### Unit Tests

Unit tests are located alongside their source files with `.spec.ts` extension:

```
src/app/
├── app.component.spec.ts
├── services/
│   └── ornament.service.spec.ts
└── components/
    ├── home/
    │   └── home.component.spec.ts
    └── ornament-gallery/
        └── ornament-gallery.component.spec.ts
```

**Test Framework**: Jasmine + Karma
**Test Runner**: Headless Chrome

### E2E Tests

E2E tests are located in the `e2e/` directory:

```
e2e/
├── home.spec.ts           # Home page tests
├── tree-creator.spec.ts   # Tree creator page tests
└── navigation.spec.ts     # Navigation and routing tests
```

**Test Framework**: Playwright
**Browsers**: Chromium, Firefox, WebKit, Mobile viewports

## Test Coverage

### Unit Tests Cover:

1. **App Component**: Router outlet rendering
2. **Ornament Service**: 
   - Ornament retrieval
   - Filtering by type (Christmas, Hanukkah, Kwanzaa)
   - Ornament data validation
3. **Home Component**:
   - Page rendering
   - Feature cards display
   - Navigation functionality
4. **Ornament Gallery**:
   - Ornament display
   - Statistics calculation
   - Date formatting
   - Empty state handling

### E2E Tests Cover:

1. **Home Page**:
   - Page loading
   - Hero section display
   - Feature cards
   - CTA buttons
   - "How It Works" section
   - Mobile responsiveness

2. **Tree Creator**:
   - Page loading
   - 3D canvas rendering
   - Create button visibility
   - Instructions display
   - Mobile responsiveness

3. **Navigation**:
   - Route transitions
   - Direct navigation
   - Browser back button

## Writing Tests

### Unit Test Example

```typescript
import { TestBed } from '@angular/core/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyService]
    });
    service = TestBed.inject(MyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected value', () => {
    const result = service.myMethod();
    expect(result).toBe('expected');
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/my-page');
    
    // Interact with the page
    await page.locator('button').click();
    
    // Assert expectations
    await expect(page.locator('h1')).toContainText('Expected Text');
  });
});
```

## Configuration Files

- **karma.conf.js**: Karma test runner configuration
- **playwright.config.ts**: Playwright E2E test configuration
- **tsconfig.spec.json**: TypeScript configuration for tests
- **angular.json**: Angular test builder configuration

## Continuous Integration

Tests are designed to run in CI environments:

- Unit tests use headless Chrome (no X server required)
- E2E tests can run in headless mode
- All tests provide exit codes for CI integration
- Coverage reports can be generated in CI-friendly formats

## Troubleshooting

### Chrome Not Found

If you get "Cannot start Chrome" errors:
```bash
# The karma.conf.js is configured to use ChromeHeadless
# which should work without a display
```

### E2E Tests Timing Out

If E2E tests timeout:
1. Check that the dev server is running
2. Increase timeout in `playwright.config.ts`
3. Check network connectivity

### Coverage Not Generated

If code coverage is not generated:
```bash
# Make sure to run with the coverage flag
npm run test:unit
```

## Best Practices

1. **Write tests first** (TDD approach when possible)
2. **Keep tests focused** - one assertion per test when possible
3. **Use descriptive test names** - clearly state what is being tested
4. **Mock external dependencies** - isolate the unit under test
5. **Test edge cases** - not just the happy path
6. **Maintain test coverage** - aim for >80% coverage
7. **Run tests before committing** - ensure nothing is broken

## Future Testing Enhancements

- [ ] Visual regression testing
- [ ] Performance testing
- [ ] Accessibility testing (a11y)
- [ ] Load testing for Firebase backend
- [ ] Cross-browser testing in CI
- [ ] Component interaction tests
- [ ] Service integration tests with Firebase emulator
- [ ] Security testing
- [ ] API contract testing

## Resources

- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Documentation](https://karma-runner.github.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Angular Testing Guide](https://angular.io/guide/testing)
