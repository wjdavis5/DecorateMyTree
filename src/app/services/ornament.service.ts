import { Injectable } from '@angular/core';

export interface OrnamentDesign {
  id: string;
  name: string;
  type: 'Christmas' | 'Hanukkah' | 'Kwanzaa';
  color: string;
  geometry: 'sphere' | 'star' | 'menorah' | 'kinara' | 'dreidel';
  scale: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrnamentService {
  private readonly ornamentDesigns: OrnamentDesign[] = [
    // Christmas Ornaments
    {
      id: 'classic-red',
      name: 'Classic Red Ball',
      type: 'Christmas',
      color: '#ff0000',
      geometry: 'sphere',
      scale: 0.15
    },
    {
      id: 'gold-star',
      name: 'Golden Star',
      type: 'Christmas',
      color: '#ffd700',
      geometry: 'star',
      scale: 0.2
    },
    {
      id: 'silver-ball',
      name: 'Silver Sparkle',
      type: 'Christmas',
      color: '#c0c0c0',
      geometry: 'sphere',
      scale: 0.15
    },
    {
      id: 'green-ball',
      name: 'Forest Green',
      type: 'Christmas',
      color: '#228B22',
      geometry: 'sphere',
      scale: 0.15
    },
    // Hanukkah Ornaments
    {
      id: 'blue-dreidel',
      name: 'Blue Dreidel',
      type: 'Hanukkah',
      color: '#0047AB',
      geometry: 'dreidel',
      scale: 0.2
    },
    {
      id: 'golden-menorah',
      name: 'Golden Menorah',
      type: 'Hanukkah',
      color: '#FFD700',
      geometry: 'menorah',
      scale: 0.25
    },
    {
      id: 'silver-dreidel',
      name: 'Silver Dreidel',
      type: 'Hanukkah',
      color: '#C0C0C0',
      geometry: 'dreidel',
      scale: 0.2
    },
    // Kwanzaa Ornaments
    {
      id: 'unity-cup',
      name: 'Unity Cup',
      type: 'Kwanzaa',
      color: '#8B4513',
      geometry: 'kinara',
      scale: 0.2
    },
    {
      id: 'red-kinara',
      name: 'Red Kinara',
      type: 'Kwanzaa',
      color: '#FF0000',
      geometry: 'kinara',
      scale: 0.25
    },
    {
      id: 'green-kinara',
      name: 'Green Kinara',
      type: 'Kwanzaa',
      color: '#008000',
      geometry: 'kinara',
      scale: 0.25
    }
  ];

  getOrnamentDesigns(): OrnamentDesign[] {
    return this.ornamentDesigns;
  }

  getOrnamentDesignById(id: string): OrnamentDesign | undefined {
    return this.ornamentDesigns.find(design => design.id === id);
  }

  getOrnamentsByType(type: 'Christmas' | 'Hanukkah' | 'Kwanzaa'): OrnamentDesign[] {
    return this.ornamentDesigns.filter(design => design.type === type);
  }
}
