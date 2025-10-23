import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrnamentGalleryComponent } from './ornament-gallery.component';

describe('OrnamentGalleryComponent', () => {
  let component: OrnamentGalleryComponent;
  let fixture: ComponentFixture<OrnamentGalleryComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<OrnamentGalleryComponent>>;

  const mockOrnaments = [
    {
      id: '1',
      type: 'classic-red',
      position: { x: 0, y: 0, z: 0 },
      message: 'Happy Holidays!',
      decoratorName: 'John Doe',
      createdAt: new Date()
    },
    {
      id: '2',
      type: 'gold-star',
      position: { x: 1, y: 1, z: 1 },
      message: 'Merry Christmas!',
      decoratorName: 'Jane Smith',
      createdAt: new Date(Date.now() - 86400000) // 1 day ago
    }
  ];

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [OrnamentGalleryComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { ornaments: mockOrnaments } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrnamentGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display ornaments', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ornamentCards = compiled.querySelectorAll('.ornament-card');
    expect(ornamentCards.length).toBe(2);
  });

  it('should calculate unique decorators correctly', () => {
    const count = component.getUniqueDecorators();
    expect(count).toBe(2);
  });

  it('should get correct ornament emoji', () => {
    expect(component.getOrnamentEmoji('classic-red')).toBe('🔴');
    expect(component.getOrnamentEmoji('gold-star')).toBe('⭐');
  });

  it('should get correct ornament name', () => {
    expect(component.getOrnamentName('classic-red')).toBe('Classic Red Ball');
    expect(component.getOrnamentName('gold-star')).toBe('Golden Star');
  });

  it('should format date correctly', () => {
    const justNow = component.formatDate(new Date());
    expect(justNow).toBe('Just now');
  });

  it('should close dialog when close button clicked', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should display statistics', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const stats = compiled.querySelector('.gallery-stats');
    expect(stats).toBeTruthy();
  });

  it('should show empty state when no ornaments', async () => {
    // Recreate component with empty ornaments
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [OrnamentGalleryComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { ornaments: [] } }
      ]
    }).compileComponents();

    const emptyFixture = TestBed.createComponent(OrnamentGalleryComponent);
    emptyFixture.detectChanges();
    
    const compiled = emptyFixture.nativeElement as HTMLElement;
    const emptyState = compiled.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
  });
});
