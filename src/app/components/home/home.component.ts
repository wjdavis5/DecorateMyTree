import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="authService.isAuthenticated(); else notAuthenticated">
      <!-- Your authenticated home content -->
      <button (click)="authService.signOut()">Sign Out</button>
    </div>
    <ng-template #notAuthenticated>
      <div>
        <p>Please sign in to access this page</p>
        <button (click)="router.navigate(['/'])">Go to Main Page</button>
      </div>
    </ng-template>
  `
})
export class HomeComponent {
  constructor(
    public authService: AuthService,
    public router: Router
  ) {}
}
