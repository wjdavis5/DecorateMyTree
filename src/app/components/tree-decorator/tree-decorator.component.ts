import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TreeService, Tree, Ornament } from '../../services/tree.service';
import { OrnamentService, OrnamentDesign } from '../../services/ornament.service';
import { OrnamentSelectorComponent } from '../ornament-selector/ornament-selector.component';
import { MessageCardComponent } from '../message-card/message-card.component'
import { ShareDialogComponent } from '../share-dialog/share-dialog.component'
import { OrnamentMessageComponent } from '../ornament-message/ornament-message.component';
import { OrnamentGalleryComponent } from '../ornament-gallery/ornament-gallery.component';

@Component({
  selector: 'app-tree-decorator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    OrnamentSelectorComponent,
    MessageCardComponent,
    ShareDialogComponent,
    OrnamentMessageComponent,
    OrnamentGalleryComponent
  ],
  template: `
    <div class="container">
      <div class="loading-overlay" *ngIf="!tree">
        <mat-spinner diameter="60"></mat-spinner>
        <p>Loading your holiday tree...</p>
      </div>
      <div class="header" *ngIf="tree">
        <h1>{{ tree.name }}</h1>
        <p>Decorate {{ tree.creatorName }}'s tree</p>
        <div class="help-text" *ngIf="tree.ornaments.length === 0">
          <mat-icon>info</mat-icon>
          <span>Click "Add Ornament" to place your first decoration on the tree!</span>
        </div>
      </div>
      <canvas #rendererCanvas></canvas>
      <div class="controls">
        <button mat-raised-button color="primary" (click)="openOrnamentSelector()">
          <mat-icon>add_circle</mat-icon>
          Add Ornament
        </button>
        <button mat-raised-button (click)="openGallery()" style="background-color: #667eea; color: white;">
          <mat-icon>photo_library</mat-icon>
          Gallery ({{ getOrnamentCount() }})
        </button>
        <button mat-raised-button color="accent" (click)="shareTree()">
          <mat-icon>share</mat-icon>
          Share
        </button>
      </div>
      <div class="message-container" *ngIf="showMessageCard">
        <app-message-card
          (submit)="onMessageSubmit($event)"
          (cancel)="onMessageCancel()">
        </app-message-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      width: 100%;
      height: 100vh;
      position: relative;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      color: white;
    }

    .loading-overlay p {
      margin-top: 20px;
      font-size: 1.2em;
      animation: pulse 2s infinite;
    }

    .header {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      text-align: center;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    .header p {
      margin: 4px 0 0;
      color: rgba(0, 0, 0, 0.6);
    }

    .help-text {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      padding: 8px 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 6px;
      font-size: 14px;
      animation: pulse 2s infinite;
    }

    .help-text mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.8;
      }
    }

    canvas {
      width: 100%;
      height: 100%;
    }

    .controls {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    button {
      padding: 12px 24px;
      font-size: 1.1em;
      border-radius: 24px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    button mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
      .header {
        top: 10px;
        left: 10px;
        right: 10px;
        transform: none;
        padding: 12px 16px;
        font-size: 0.9em;
      }

      .header h1 {
        font-size: 18px;
      }

      .help-text {
        font-size: 12px;
        padding: 6px 10px;
      }

      .controls {
        bottom: 10px;
        left: 10px;
        right: 10px;
        justify-content: center;
      }

      button {
        font-size: 0.9em;
        padding: 10px 16px;
      }
    }

    .message-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2000;
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  `]
})
export class TreeDecoratorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rendererCanvas') rendererCanvas!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  public tree?: Tree;
  private treeId: string = '';
  private selectedOrnament?: OrnamentDesign;
  showMessageCard = false;
  pendingOrnamentPosition: { x: number; y: number; z: number } | null = null;
  private isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private treeService: TreeService,
    private ornamentService: OrnamentService,
    private dialog: MatDialog
  ) {}

  private showNotification(message: string, duration: number = 3000) {
    // For now, use console.log. In a real app, we'd use MatSnackBar
    console.log('Notification:', message);
  }

  async ngOnInit() {
    this.treeId = this.route.snapshot.params['id'];
    this.treeService.getTree(this.treeId).then(fetchedTree => {
      if (!fetchedTree) {
        console.error('Tree not found');
        return;
      }
      this.tree = fetchedTree;
      this.loadExistingOrnaments();
    });
  }

  ngAfterViewInit() {
    this.initThreeJS();
    this.createChristmasTree();
    this.animate();
  }

  private initThreeJS() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.rendererCanvas.nativeElement,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Main directional light (sun-like)
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    this.scene.add(mainLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x7ec0ee, 0.3);
    fillLight.position.set(-5, 3, -5);
    this.scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0xffd700, 0.2);
    rimLight.position.set(0, -2, -5);
    this.scene.add(rimLight);

    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(0, 2, 0);

    this.renderer.domElement.addEventListener('click', this.onCanvasClick.bind(this));
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

  private loadExistingOrnaments() {
    if (!this.tree) return;

    this.tree.ornaments.forEach(ornament => {
      const design = this.ornamentService.getOrnamentDesignById(ornament.type);
      if (design) {
        const position = new THREE.Vector3(
          ornament.position.x,
          ornament.position.y,
          ornament.position.z
        );
        this.createOrnamentMesh(design, position, ornament);
      }
    });
  }

  private createOrnamentMesh(design: OrnamentDesign, position: THREE.Vector3, ornamentData?: Ornament) {
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    switch (design.geometry) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(design.scale, 32, 32);
        material = new THREE.MeshPhysicalMaterial({
          color: design.color,
          metalness: 0.7,
          roughness: 0.2,
          clearcoat: 0.8,
          clearcoatRoughness: 0.2
        });
        break;
      case 'star':
        // Create a more detailed star geometry
        const starPoints = [];
        const outerRadius = design.scale;
        const innerRadius = design.scale * 0.4;
        const points = 5;

        for (let i = 0; i < points * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i / (points * 2)) * Math.PI * 2;
          starPoints.push(new THREE.Vector2(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
          ));
        }

        const starShape = new THREE.Shape(starPoints);
        geometry = new THREE.ExtrudeGeometry(starShape, {
          depth: design.scale * 0.2,
          bevelEnabled: true,
          bevelThickness: design.scale * 0.05,
          bevelSize: design.scale * 0.05,
          bevelSegments: 3
        });

        material = new THREE.MeshPhysicalMaterial({
          color: design.color,
          metalness: 0.8,
          roughness: 0.15,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1
        });
        break;
      case 'menorah':
      case 'kinara':
      case 'dreidel':
        geometry = new THREE.BoxGeometry(
          design.scale,
          design.scale * 1.5,
          design.scale
        );
        material = new THREE.MeshPhysicalMaterial({
          color: design.color,
          metalness: 0.6,
          roughness: 0.3,
          clearcoat: 0.5,
          clearcoatRoughness: 0.2
        });
        break;
      default:
        geometry = new THREE.SphereGeometry(design.scale, 32, 32);
        material = new THREE.MeshPhysicalMaterial({
          color: design.color,
          metalness: 0.7,
          roughness: 0.2
        });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    // Store ornament data in userData
    if (ornamentData) {
      mesh.userData['ornamentData'] = ornamentData;
    }

    mesh.userData['rotationSpeed'] = {
      x: Math.random() * 0.01 - 0.005,
      y: Math.random() * 0.01 - 0.005
    };

    this.scene.add(mesh);
    return mesh;
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

    // Update ornament rotations
    this.scene.children.forEach(child => {
      if (child instanceof THREE.Mesh && child.userData['rotationSpeed']) {
        child.rotation.x += child.userData['rotationSpeed'].x;
        child.rotation.y += child.userData['rotationSpeed'].y;
      }
    });

    this.updateSnow();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onCanvasClick(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      if (clickedObject instanceof THREE.Mesh) {
        if (this.selectedOrnament) {
          // Adding new ornament - show message card first
          const point = intersects[0].point;
          this.addOrnament({
            x: point.x,
            y: point.y,
            z: point.z
          });
        } else if (clickedObject.userData['ornamentData']) {
          // Viewing existing ornament message
          this.showOrnamentMessage(clickedObject.userData['ornamentData']);
        }
      }
    }
  }

  openOrnamentSelector() {
    const dialogRef = this.dialog.open(OrnamentSelectorComponent, {
      width: '500px',
      data: { ornaments: this.ornamentService.getOrnamentDesigns() }
    });

    dialogRef.afterClosed().subscribe((result: OrnamentDesign) => {
      if (result) {
        this.selectedOrnament = result;
      }
    });
  }

  private addOrnament(position: { x: number; y: number; z: number }) {
    console.log('Adding ornament at position:', position); // Debug log
    this.showMessageCard = true;
    this.pendingOrnamentPosition = position;
  }

  async onMessageSubmit(messageData: { name: string; message: string }) {
    if (!this.pendingOrnamentPosition || !this.selectedOrnament || this.isSubmitting) return;

    try {
      this.isSubmitting = true;
      const ornament: Omit<Ornament, 'id'> = {
        type: this.selectedOrnament.id,
        position: this.pendingOrnamentPosition,
        message: messageData.message,
        decoratorName: messageData.name
      };

      await this.treeService.addOrnament(this.treeId, ornament);
      const position = new THREE.Vector3(
        this.pendingOrnamentPosition.x,
        this.pendingOrnamentPosition.y,
        this.pendingOrnamentPosition.z
      );
      this.createOrnamentMesh(this.selectedOrnament, position);
    } catch (error) {
      console.error('Error adding ornament:', error);
    } finally {
      this.showMessageCard = false;
      this.pendingOrnamentPosition = null;
      this.selectedOrnament = undefined;
      this.isSubmitting = false;
    }
  }

  onMessageCancel() {
    this.showMessageCard = false;
    this.pendingOrnamentPosition = null;
  }

  private showOrnamentMessage(ornamentData: Ornament) {
    this.dialog.open(OrnamentMessageComponent, {
      width: '400px',
      data: {
        message: ornamentData.message,
        decoratorName: ornamentData.decoratorName
      }
    });
  }

  shareTree() {
    const treeUrl = window.location.href;
    this.dialog.open(ShareDialogComponent, {
      width: '400px',
      data: { url: treeUrl }
    });
  }

  openGallery() {
    if (!this.tree) return;
    
    this.dialog.open(OrnamentGalleryComponent, {
      width: '700px',
      maxWidth: '90vw',
      data: { ornaments: this.tree.ornaments }
    });
  }

  getOrnamentCount(): number {
    return this.tree?.ornaments?.length || 0;
  }

  ngOnDestroy() {
    // Clean up THREE.js resources
    this.renderer?.dispose();
    this.scene?.clear();
  }
}
