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

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x7ec0ee, 0.3);
    fillLight.position.set(-5, 3, -5);
    this.scene.add(fillLight);

    // Rim light for depth
    const rimLight = new THREE.DirectionalLight(0xffd700, 0.2);
    rimLight.position.set(0, -2, -5);
    this.scene.add(rimLight);

    // Enable shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(0, 2, 0);

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
    // Create tree trunk with better texture
    const trunkGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1.2, 32);
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x6d4c41,
      roughness: 0.8,
      metalness: 0.1
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = -0.6;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    this.scene.add(trunk);

    // Create tree layers with better materials and varied colors
    const layers = 5;
    const baseColor = 0x1b5e20;

    for (let i = 0; i < layers; i++) {
      const radius = 1.8 - (i * 0.32);
      const height = 1.4;
      const coneGeometry = new THREE.ConeGeometry(radius, height, 32);
      
      // Vary the green color slightly for each layer for more depth
      const colorVariation = Math.floor(Math.random() * 0x101010);
      const layerColor = baseColor + colorVariation;
      
      const coneMaterial = new THREE.MeshStandardMaterial({
        color: layerColor,
        roughness: 0.7,
        metalness: 0.1,
        flatShading: false
      });
      
      const cone = new THREE.Mesh(coneGeometry, coneMaterial);
      cone.position.y = i * 0.9 + 0.2;
      cone.castShadow = true;
      cone.receiveShadow = true;
      this.scene.add(cone);
    }

    // Add a golden star on top
    this.addTreeTopper();
    
    // Add sparkle lights
    this.addSparkleLights();
    
    // Add snow particles
    this.addSnowEffect();
  }

  private addTreeTopper() {
    // Create a 5-pointed star
    const starPoints = [];
    const outerRadius = 0.3;
    const innerRadius = 0.15;
    const points = 5;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      starPoints.push(new THREE.Vector2(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius
      ));
    }

    const starShape = new THREE.Shape(starPoints);
    const starGeometry = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3
    });

    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xffaa00,
      emissiveIntensity: 0.5
    });

    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.y = 5;
    star.rotation.z = 0;
    this.scene.add(star);
  }

  private addSparkleLights() {
    // Add small colorful lights around the tree
    const lightColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    const numLights = 30;

    for (let i = 0; i < numLights; i++) {
      const angle = (i / numLights) * Math.PI * 2;
      const layer = Math.floor(i / 6);
      const radius = 1.5 - (layer * 0.32);
      const height = layer * 0.9 + 0.2;

      const light = new THREE.PointLight(
        lightColors[i % lightColors.length],
        0.5,
        2
      );
      
      light.position.set(
        Math.cos(angle) * radius * 0.7,
        height + (Math.random() - 0.5) * 0.3,
        Math.sin(angle) * radius * 0.7
      );

      this.scene.add(light);

      // Add small sphere to visualize the light
      const lightGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const lightMaterial = new THREE.MeshBasicMaterial({
        color: lightColors[i % lightColors.length]
      });
      const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
      lightMesh.position.copy(light.position);
      this.scene.add(lightMesh);
    }
  }

  private snowParticles: THREE.Points | null = null;

  private addSnowEffect() {
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: -0.02 - Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.01
      });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    this.snowParticles = new THREE.Points(particles, particleMaterial);
    this.snowParticles.userData['velocities'] = velocities;
    this.scene.add(this.snowParticles);
  }

  private updateSnow() {
    if (!this.snowParticles) return;

    const positions = this.snowParticles.geometry.attributes['position'].array as Float32Array;
    const velocities = this.snowParticles.userData['velocities'];

    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3] += velocities[i].x;
      positions[i * 3 + 1] += velocities[i].y;
      positions[i * 3 + 2] += velocities[i].z;

      // Reset particle if it falls below a threshold
      if (positions[i * 3 + 1] < -2) {
        positions[i * 3 + 1] = 8;
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
    }

    this.snowParticles.geometry.attributes['position'].needsUpdate = true;
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.updateSnow();
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
