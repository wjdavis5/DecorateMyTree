import { TestBed } from '@angular/core/testing';
import { OrnamentService } from './ornament.service';

describe('OrnamentService', () => {
  let service: OrnamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrnamentService]
    });
    service = TestBed.inject(OrnamentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all ornaments', () => {
    const ornaments = service.getOrnamentDesigns();
    expect(ornaments).toBeDefined();
    expect(ornaments.length).toBeGreaterThan(0);
  });

  it('should return ornaments by type', () => {
    const christmasOrnaments = service.getOrnamentsByType('Christmas');
    expect(christmasOrnaments).toBeDefined();
    expect(christmasOrnaments.length).toBeGreaterThan(0);
    christmasOrnaments.forEach(ornament => {
      expect(ornament.type).toBe('Christmas');
    });
  });

  it('should return Hanukkah ornaments', () => {
    const hanukkahOrnaments = service.getOrnamentsByType('Hanukkah');
    expect(hanukkahOrnaments).toBeDefined();
    expect(hanukkahOrnaments.length).toBeGreaterThan(0);
    hanukkahOrnaments.forEach(ornament => {
      expect(ornament.type).toBe('Hanukkah');
    });
  });

  it('should return Kwanzaa ornaments', () => {
    const kwanzaaOrnaments = service.getOrnamentsByType('Kwanzaa');
    expect(kwanzaaOrnaments).toBeDefined();
    expect(kwanzaaOrnaments.length).toBeGreaterThan(0);
    kwanzaaOrnaments.forEach(ornament => {
      expect(ornament.type).toBe('Kwanzaa');
    });
  });

  it('should get ornament by id', () => {
    const ornaments = service.getOrnamentDesigns();
    const firstOrnament = ornaments[0];
    
    const foundOrnament = service.getOrnamentDesignById(firstOrnament.id);
    expect(foundOrnament).toBeDefined();
    expect(foundOrnament?.id).toBe(firstOrnament.id);
  });

  it('should return undefined for non-existent id', () => {
    const ornament = service.getOrnamentDesignById('non-existent-id');
    expect(ornament).toBeUndefined();
  });

  it('should have valid ornament properties', () => {
    const ornaments = service.getOrnamentDesigns();
    ornaments.forEach((ornament: any) => {
      expect(ornament.id).toBeDefined();
      expect(ornament.name).toBeDefined();
      expect(ornament.type).toBeDefined();
      expect(ornament.color).toBeDefined();
      expect(ornament.geometry).toBeDefined();
      expect(ornament.scale).toBeGreaterThan(0);
    });
  });

  it('should have at least 15 ornaments', () => {
    const ornaments = service.getOrnamentDesigns();
    expect(ornaments.length).toBeGreaterThanOrEqual(15);
  });
});
