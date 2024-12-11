import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TreeService } from '../../services/tree.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-tree-creator',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Create Your Holiday Tree</h1>
        <p>Create a 3D holiday tree that friends and family can decorate with ornaments and messages</p>
      </div>
      <div class="canvas-container">
        <canvas #rendererCanvas></canvas>
      </div>
      <div class="footer">
        <button
          mat-raised-button
          color="primary"
          (click)="createTree()"
          [disabled]="isCreating"
          class="create-button">
          <mat-spinner *ngIf="isCreating" diameter="20" class="spinner"></mat-spinner>
          <span>{{ isCreating ? 'Creating Tree...' : 'Create Tree' }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #1a1a1a;
      position: relative;
    }

    .header {
      text-align: center;
      padding: 20px;
      color: white;
      flex-shrink: 0;
    }

    .header h1 {
      margin: 0;
      font-size: 2.5em;
      font-weight: 300;
    }

    .header p {
      margin: 10px 0 0;
      font-size: 1.1em;
      opacity: 0.8;
    }

    .canvas-container {
      flex: 1;
      position: relative;
      min-height: 0;
    }

    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 1000;
    }

    .create-button {
      padding: 0 32px;
      height: 48px;
      font-size: 1.1em;
      border-radius: 24px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: #1976d2;
      color: white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .create-button:hover {
      background-color: #1565c0;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    }

    .spinner {
      margin-right: 8px;
    }
  `]
})
export class TreeCreatorComponent implements AfterViewInit {
  @ViewChild('rendererCanvas') rendererCanvas!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  isCreating = false;

  constructor(
    private treeService: TreeService,
    private router: Router,
    private auth: Auth
  ) {}

  ngAfterViewInit() {
    this.initThreeJS();
    this.createChristmasTree();
    this.animate();
  }

  private initThreeJS() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);

    const aspect = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.rendererCanvas.nativeElement,
      antialias: true
    });
    this.updateRendererSize();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.5;
    this.controls.enableZoom = true;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 10;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    this.camera.position.z = 5;

    // Handle window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = this.getAspectRatio();
      this.camera.updateProjectionMatrix();
      this.updateRendererSize();
    });
  }

  private getAspectRatio(): number {
    const container = this.rendererCanvas.nativeElement.parentElement;
    return container ? container.clientWidth / container.clientHeight : window.innerWidth / window.innerHeight;
  }

  private updateRendererSize() {
    const container = this.rendererCanvas.nativeElement.parentElement;
    if (container) {
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
    }
  }

  private createChristmasTree() {
    // Create tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
    const trunkMaterial = new THREE.MeshPhongMaterial({
      color: 0x8B4513,
      shininess: 30
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = -0.5;
    this.scene.add(trunk);

    // Create tree layers
    const layers = 4;
    const treeColor = 0x228B22;

    for (let i = 0; i < layers; i++) {
      const coneGeometry = new THREE.ConeGeometry(
        1.5 - (i * 0.3),
        1.5,
        32
      );
      const coneMaterial = new THREE.MeshPhongMaterial({
        color: treeColor,
        shininess: 15
      });
      const cone = new THREE.Mesh(coneGeometry, coneMaterial);
      cone.position.y = i * 1;
      this.scene.add(cone);
    }
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  async createTree() {
    if (this.isCreating) return;

    try {
      this.isCreating = true;
      console.log('Creating tree, checking auth...');

      if (!this.auth.currentUser) {
        console.log('User not authenticated, redirecting to auth...');
        localStorage.setItem('postLoginAction', 'createTree');
        await this.router.navigate(['/auth']);
        this.isCreating = false;
        return;
      }

      console.log('User authenticated, creating tree...');
      const treeId = await this.treeService.createNewTree("My Tree");
      await this.router.navigate(['/decorator', treeId]);
    } catch (error) {
      console.error('Error creating tree:', error);
      // Add user feedback
      // You might want to inject MatSnackBar and show an error message
    } finally {
      this.isCreating = false;
    }
  }
}
