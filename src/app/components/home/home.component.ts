import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TreeService } from '../../services/tree.service';
import { AuthService } from '../../services/auth.service';
import { Tree } from '../../services/tree.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="home-container">
      <header>
        <h1>My Holiday Trees</h1>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="createNewTree()">
            <mat-icon>add</mat-icon>
            Create New Tree
          </button>
          <button mat-button (click)="signOut()">Sign Out</button>
        </div>
      </header>

      <mat-grid-list cols="3" rowHeight="1:1" gutterSize="16" class="trees-grid">
        <mat-grid-tile *ngFor="let tree of trees">
          <mat-card class="tree-card">
            <mat-card-header>
              <mat-card-title>{{ tree.name }}</mat-card-title>
              <mat-card-subtitle>
                Created {{ tree.createdAt.toDate() | date:'mediumDate' }}
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="tree-preview">
              <!-- Tree preview will be added here -->
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" (click)="viewTree(tree.id)">
                View Tree
              </button>
              <button mat-button (click)="shareTree(tree.id)">
                Share
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    h1 {
      margin: 0;
      font-size: 2em;
      font-weight: 300;
    }

    .trees-grid {
      margin-top: 24px;
    }

    .tree-card {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .tree-preview {
      flex: 1;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 8px;
    }
  `]
})
export class HomeComponent implements OnInit {
  trees: Tree[] = [];

  constructor(
    private treeService: TreeService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      this.trees = await this.treeService.getUserTrees();
    } catch (error) {
      console.error('Error fetching trees:', error);
    }
  }

  async createNewTree() {
    const name = prompt('Enter a name for your tree:');
    if (name) {
      try {
        const treeId = await this.treeService.createNewTree(name);
        this.router.navigate(['/tree', treeId]);
      } catch (error) {
        console.error('Error creating tree:', error);
      }
    }
  }

  viewTree(treeId: string) {
    this.router.navigate(['/tree', treeId]);
  }

  shareTree(treeId: string) {
    // We'll implement this later using the share dialog
  }

  async signOut() {
    await this.authService.signOut();
    this.router.navigate(['/auth']);
  }
}
