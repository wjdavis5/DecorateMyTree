import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1 class="app-title">🎄 Holiday Tree Decorator 🎄</h1>
        <p class="tagline">Create beautiful 3D holiday trees and share them with loved ones</p>
        <div class="cta-buttons">
          <button mat-raised-button color="primary" class="large-button" (click)="router.navigate(['/create'])">
            <mat-icon>add_circle</mat-icon>
            Create Your Tree
          </button>
        </div>
      </div>

      <div class="features-section">
        <h2>Why Holiday Tree Decorator?</h2>
        <div class="features-grid">
          <mat-card class="feature-card">
            <mat-icon class="feature-icon">view_in_ar</mat-icon>
            <h3>3D Interactive Trees</h3>
            <p>Create stunning 3D holiday trees that can be rotated and viewed from any angle</p>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon class="feature-icon">group</mat-icon>
            <h3>Collaborative Decorating</h3>
            <p>Share your tree with friends and family so they can add ornaments and messages</p>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon class="feature-icon">celebration</mat-icon>
            <h3>Multiple Traditions</h3>
            <p>Support for Christmas, Hanukkah, and Kwanzaa ornaments and decorations</p>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon class="feature-icon">share</mat-icon>
            <h3>Easy Sharing</h3>
            <p>Share your tree with a simple link - no signup required for decorators</p>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon class="feature-icon">message</mat-icon>
            <h3>Personal Messages</h3>
            <p>Attach heartfelt messages to ornaments for a personal touch</p>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon class="feature-icon">devices</mat-icon>
            <h3>Works Everywhere</h3>
            <p>Access from any device - desktop, tablet, or mobile</p>
          </mat-card>
        </div>
      </div>

      <div class="how-it-works">
        <h2>How It Works</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Create Your Tree</h3>
            <p>Click "Create Your Tree" to generate your personalized 3D holiday tree</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Share the Link</h3>
            <p>Get a unique link and share it with friends and family</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Watch it Grow</h3>
            <p>See your tree come alive as others add beautiful ornaments and messages</p>
          </div>
        </div>
      </div>

      <div class="footer-cta">
        <h2>Ready to Create Your Holiday Tree?</h2>
        <button mat-raised-button color="accent" class="large-button" (click)="router.navigate(['/create'])">
          <mat-icon>star</mat-icon>
          Get Started Now
        </button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%);
      color: white;
      padding: 0;
      overflow-x: hidden;
    }

    .hero-section {
      text-align: center;
      padding: 80px 20px 60px;
      background: rgba(0, 0, 0, 0.2);
    }

    .app-title {
      font-size: 3.5em;
      margin: 0 0 20px;
      font-weight: 300;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      animation: fadeInUp 0.8s ease-out;
    }

    .tagline {
      font-size: 1.5em;
      margin: 0 0 40px;
      opacity: 0.95;
      animation: fadeInUp 1s ease-out;
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
      animation: fadeInUp 1.2s ease-out;
    }

    .large-button {
      padding: 16px 40px !important;
      height: 56px !important;
      font-size: 1.2em !important;
      border-radius: 28px !important;
      display: inline-flex !important;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
      transition: all 0.3s ease !important;
    }

    .large-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
    }

    .features-section {
      padding: 60px 20px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
    }

    .features-section h2 {
      text-align: center;
      font-size: 2.5em;
      margin: 0 0 40px;
      font-weight: 300;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.95) !important;
      padding: 30px !important;
      text-align: center;
      border-radius: 12px !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
    }

    .feature-icon {
      font-size: 48px !important;
      width: 48px !important;
      height: 48px !important;
      color: #1976d2;
      margin-bottom: 16px;
    }

    .feature-card h3 {
      color: #1976d2;
      margin: 16px 0;
      font-size: 1.4em;
    }

    .feature-card p {
      color: rgba(0, 0, 0, 0.7);
      line-height: 1.6;
      margin: 0;
    }

    .how-it-works {
      padding: 60px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .how-it-works h2 {
      text-align: center;
      font-size: 2.5em;
      margin: 0 0 60px;
      font-weight: 300;
    }

    .steps {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .step {
      flex: 1;
      min-width: 250px;
      max-width: 300px;
      text-align: center;
      padding: 30px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .step-number {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #ffc107;
      color: #1a237e;
      font-size: 2em;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
    }

    .step h3 {
      margin: 0 0 12px;
      font-size: 1.4em;
    }

    .step p {
      margin: 0;
      opacity: 0.9;
      line-height: 1.6;
    }

    .step-arrow {
      font-size: 2em;
      color: #ffc107;
      font-weight: bold;
    }

    .footer-cta {
      text-align: center;
      padding: 80px 20px;
      background: rgba(0, 0, 0, 0.2);
    }

    .footer-cta h2 {
      font-size: 2.5em;
      margin: 0 0 30px;
      font-weight: 300;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .app-title {
        font-size: 2.5em;
      }

      .tagline {
        font-size: 1.2em;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .step-arrow {
        display: none;
      }

      .steps {
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent {
  constructor(
    public router: Router
  ) {}
}
