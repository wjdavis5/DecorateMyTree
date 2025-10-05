import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Ornament } from '../../services/tree.service';

interface DialogData {
  ornaments: Ornament[];
}

@Component({
  selector: 'app-ornament-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>photo_library</mat-icon>
      Ornament Gallery
    </h2>
    <mat-dialog-content>
      <div class="gallery-stats">
        <div class="stat">
          <mat-icon>stars</mat-icon>
          <div>
            <strong>{{ data.ornaments.length }}</strong>
            <span>Ornaments</span>
          </div>
        </div>
        <div class="stat">
          <mat-icon>people</mat-icon>
          <div>
            <strong>{{ getUniqueDecorators() }}</strong>
            <span>Contributors</span>
          </div>
        </div>
      </div>

      <div class="ornaments-list" *ngIf="data.ornaments.length > 0; else noOrnaments">
        <mat-card *ngFor="let ornament of data.ornaments; let i = index" class="ornament-card">
          <mat-card-header>
            <div mat-card-avatar class="ornament-avatar">
              {{ getOrnamentEmoji(ornament.type) }}
            </div>
            <mat-card-title>{{ ornament.decoratorName || 'Anonymous' }}</mat-card-title>
            <mat-card-subtitle>{{ formatDate(ornament.createdAt) }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="ornament-info">
              <div class="info-row">
                <mat-icon class="info-icon">label</mat-icon>
                <span>{{ getOrnamentName(ornament.type) }}</span>
              </div>
              <div class="message" *ngIf="ornament.message">
                <mat-icon class="info-icon">message</mat-icon>
                <p>{{ ornament.message }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <ng-template #noOrnaments>
        <div class="empty-state">
          <mat-icon>sentiment_dissatisfied</mat-icon>
          <p>No ornaments yet! Be the first to decorate this tree.</p>
        </div>
      </ng-template>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .gallery-stats {
      display: flex;
      gap: 20px;
      padding: 20px;
      background: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      padding: 12px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .stat mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #667eea;
    }

    .stat div {
      display: flex;
      flex-direction: column;
    }

    .stat strong {
      font-size: 24px;
      color: #333;
    }

    .stat span {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }

    mat-dialog-content {
      padding: 0 !important;
      max-height: 600px !important;
      overflow-y: auto !important;
    }

    .ornaments-list {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .ornament-card {
      background: white !important;
      border-left: 4px solid #667eea;
    }

    .ornament-avatar {
      width: 40px !important;
      height: 40px !important;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
    }

    mat-card-title {
      color: #333 !important;
      font-weight: 500 !important;
    }

    mat-card-subtitle {
      color: #666 !important;
      font-size: 12px !important;
    }

    .ornament-info {
      margin-top: 8px;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: #555;
    }

    .info-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #667eea;
    }

    .message {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 3px solid #667eea;
    }

    .message p {
      margin: 0;
      color: #444;
      font-style: italic;
      line-height: 1.5;
    }

    .empty-state {
      padding: 60px 20px;
      text-align: center;
      color: #999;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    mat-dialog-actions {
      padding: 16px !important;
      background: #f5f5f5;
      border-top: 1px solid #e0e0e0;
    }

    @media (max-width: 600px) {
      .gallery-stats {
        flex-direction: column;
      }
    }
  `]
})
export class OrnamentGalleryComponent {
  constructor(
    public dialogRef: MatDialogRef<OrnamentGalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  getUniqueDecorators(): number {
    const decorators = new Set(this.data.ornaments.map(o => o.decoratorName));
    return decorators.size;
  }

  getOrnamentEmoji(type: string): string {
    const emojiMap: { [key: string]: string } = {
      'classic-red': '🔴',
      'gold-star': '⭐',
      'silver-ball': '⚪',
      'green-ball': '🟢',
      'blue-dreidel': '🎲',
      'golden-menorah': '🕎',
      'silver-dreidel': '🎲',
      'unity-cup': '🕯️',
      'red-kinara': '🕯️',
      'green-kinara': '🕯️'
    };
    return emojiMap[type] || '🎄';
  }

  getOrnamentName(type: string): string {
    const nameMap: { [key: string]: string } = {
      'classic-red': 'Classic Red Ball',
      'gold-star': 'Golden Star',
      'silver-ball': 'Silver Sparkle',
      'green-ball': 'Forest Green',
      'blue-dreidel': 'Blue Dreidel',
      'golden-menorah': 'Golden Menorah',
      'silver-dreidel': 'Silver Dreidel',
      'unity-cup': 'Unity Cup',
      'red-kinara': 'Red Kinara',
      'green-kinara': 'Green Kinara'
    };
    return nameMap[type] || type;
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'Unknown date';
    
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }

  close() {
    this.dialogRef.close();
  }
}
