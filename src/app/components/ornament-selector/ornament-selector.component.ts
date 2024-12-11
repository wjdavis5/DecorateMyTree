import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
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
    MatTabsModule
  ],
  template: `
    <h2 mat-dialog-title>Select an Ornament</h2>
    <mat-dialog-content>
      <mat-tab-group>
        <mat-tab *ngFor="let type of ornamentTypes" [label]="type">
          <mat-grid-list cols="3" rowHeight="1:1" class="ornament-grid">
            <mat-grid-tile *ngFor="let ornament of getOrnamentsByType(type)">
              <mat-card
                class="ornament-card"
                [class.selected]="selectedOrnament === ornament"
                (click)="selectOrnament(ornament)">
                <mat-card-content>
                  <div
                    class="ornament-preview"
                    [style.background-color]="ornament.color">
                    {{ getOrnamentEmoji(ornament.geometry) }}
                  </div>
                  <mat-card-title>{{ ornament.name }}</mat-card-title>
                </mat-card-content>
              </mat-card>
            </mat-grid-tile>
          </mat-grid-list>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()"
      style="margin-right: 10px;background-color: red;color: white;"
      >Cancel</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!selectedOrnament"
        (click)="onConfirm()">
        Select
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      height: 600px;
    }

    h2 {
      margin: 0;
      padding: 16px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
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
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin: 8px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
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
