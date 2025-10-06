import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HomeComponent } from './home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        MatButtonModule,
        MatCardModule,
        MatIconModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display app title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-title')?.textContent).toContain('Holiday Tree Decorator');
  });

  it('should display tagline', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.tagline')?.textContent).toContain('Create beautiful 3D holiday trees');
  });

  it('should display feature cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const featureCards = compiled.querySelectorAll('.feature-card');
    expect(featureCards.length).toBeGreaterThanOrEqual(6);
  });

  it('should have "How It Works" section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const howItWorks = compiled.querySelector('.how-it-works');
    expect(howItWorks).toBeTruthy();
  });

  it('should display steps', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const steps = compiled.querySelectorAll('.step');
    expect(steps.length).toBe(3);
  });

  it('should have CTA buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ctaButtons = compiled.querySelectorAll('button');
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it('should navigate to create page when button clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    button?.click();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/create']);
  });
});
