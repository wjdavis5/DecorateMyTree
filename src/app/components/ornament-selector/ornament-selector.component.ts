import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { OrnamentDesign } from '../../services/ornament.service';

interface DialogData {
  ornaments: OrnamentDesign[];
}

@Component({
  selector: 'app-ornament-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>auto_awesome</mat-icon>
      Select an Ornament
    </h2>
    <mat-dialog-content>
      <p class="dialog-description">Choose a beautiful ornament to add to the tree</p>
      <mat-tab-group animationDuration="300ms">
        <mat-tab *ngFor="let type of ornamentTypes">
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">{{ getTypeIcon(type) }}</mat-icon>
            {{ type }}
          </ng-template>
          <mat-grid-list cols="3" rowHeight="1:1" class="ornament-grid">
            <mat-grid-tile *ngFor="let ornament of getOrnamentsByType(type)">
              <mat-card
                class="ornament-card"
                [class.selected]="selectedOrnament === ornament"
                (click)="selectOrnament(ornament)">
                <mat-card-content>
                  <div
                    class="ornament-preview"
                    [style.background]="getOrnamentGradient(ornament.color)">
                    <span class="ornament-emoji">{{ getOrnamentEmoji(ornament.geometry) }}</span>
                  </div>
                  <mat-card-title>{{ ornament.name }}</mat-card-title>
                </mat-card-content>
                <div class="check-icon" *ngIf="selectedOrnament === ornament">
                  <mat-icon>check_circle</mat-icon>
                </div>
              </mat-card>
            </mat-grid-tile>
          </mat-grid-list>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">
        <mat-icon>close</mat-icon>
        Cancel
      </button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!selectedOrnament"
        (click)="onConfirm()">
        <mat-icon>check</mat-icon>
        Add to Tree
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      height: 600px;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
      color: white;
      font-weight: 400;
    }

    h2 mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .dialog-description {
      padding: 16px 20px;
      margin: 0;
      background: #f5f5f5;
      color: rgba(0, 0, 0, 0.7);
      border-bottom: 1px solid #e0e0e0;
      text-align: center;
    }

    .tab-icon {
      margin-right: 8px;
    }

    .ornament-grid {
      padding: 16px;
    }

    .ornament-card {
      width: 90%;
      height: 90%;
      cursor: pointer;
      transition: all 0.2s ease;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .ornament-card:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .ornament-card.selected {
      border: 2px solid #1976d2;
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
    }

    .ornament-preview {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      margin: 8px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
    }

    .ornament-preview::before {
      content: '';
      position: absolute;
      top: 10%;
      left: 20%;
      width: 30%;
      height: 30%;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      filter: blur(8px);
    }

    .ornament-emoji {
      font-size: 32px;
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    .check-icon {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 10;
    }

    .check-icon mat-icon {
      color: #4caf50;
      font-size: 28px;
      width: 28px;
      height: 28px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    mat-card-title {
      font-size: 14px;
      text-align: center;
      margin-top: 8px;
      color: #333;
    }

    ::ng-deep {
      .mat-mdc-dialog-container {
        padding: 0;
      }

      .mat-mdc-dialog-content {
        max-height: 450px !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow-y: auto !important;
      }

      .mat-mdc-dialog-actions {
        padding: 16px !important;
        margin: 0 !important;
        min-height: 52px !important;
        background-color: #f5f5f5;
        border-top: 1px solid #e0e0e0;
        position: sticky !important;
        bottom: 0 !important;
        z-index: 1000 !important;
        gap: 8px !important;
        justify-content: flex-end !important;
      }

      .mdc-button {
        min-width: 100px !important;
        height: 36px !important;
        line-height: 36px !important;
        padding: 0 16px !important;
      }

      .mat-mdc-raised-button {
        background-color: #1976d2 !important;
        color: white !important;
      }

      .mat-mdc-raised-button:not([disabled]):hover {
        background-color: #1565c0 !important;
      }

      .mat-mdc-raised-button[disabled] {
        background-color: rgba(0, 0, 0, 0.12) !important;
        color: rgba(0, 0, 0, 0.38) !important;
      }

      .mat-mdc-tab-body-wrapper {
        height: 100%;
      }
    }
  `]
})
export class OrnamentSelectorComponent {
  selectedOrnament?: OrnamentDesign;
  ornamentTypes = ['Christmas', 'Hanukkah', 'Kwanzaa'];

  constructor(
    public dialogRef: MatDialogRef<OrnamentSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  getOrnamentsByType(type: string): OrnamentDesign[] {
    return this.data.ornaments.filter(o => o.type === type);
  }

  getOrnamentEmoji(geometry: string): string {
    switch (geometry) {
      case 'sphere': return '🔴';
      case 'star': return '⭐';
      case 'menorah': return '🕎';
      case 'kinara': return '🕯️';
      case 'dreidel': return '🎲';
      default: return '🎄';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'Christmas': return 'celebration';
      case 'Hanukkah': return 'synagogue';
      case 'Kwanzaa': return 'local_fire_department';
      default: return 'star';
    }
  }

  getOrnamentGradient(color: string): string {
    return `radial-gradient(circle at 30% 30%, ${color}ee, ${color}88)`;
  }

  selectOrnament(ornament: OrnamentDesign) {
    this.selectedOrnament = ornament;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    this.dialogRef.close(this.selectedOrnament);
  }
}
