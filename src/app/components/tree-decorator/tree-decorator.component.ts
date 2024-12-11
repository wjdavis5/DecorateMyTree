import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TreeService, Tree, Ornament } from '../../services/tree.service';
import { OrnamentService, OrnamentDesign } from '../../services/ornament.service';
import { OrnamentSelectorComponent } from '../ornament-selector/ornament-selector.component';
import { MessageCardComponent } from '../message-card/message-card.component'
import { ShareDialogComponent } from '../share-dialog/share-dialog.component'
import { OrnamentMessageComponent } from '../ornament-message/ornament-message.component';

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
    OrnamentSelectorComponent,
    MessageCardComponent,
    ShareDialogComponent,
    OrnamentMessageComponent
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>{{ tree?.name }}</h1>
        <p>Decorate {{ tree?.creatorName }}'s tree</p>
      </div>
      <canvas #rendererCanvas></canvas>
      <div class="controls">
        <button mat-raised-button color="primary" (click)="openOrnamentSelector()">
          Add Ornament
        </button>
        <button mat-raised-button color="accent" (click)="shareTree()">
          Share Tree
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
    }

    button {
      padding: 12px 24px;
      font-size: 1.1em;
      border-radius: 24px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
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

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Main directional light (sun-like)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x7ec0ee, 0.3);
    fillLight.position.set(-5, 3, -5);
    this.scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0xffd700, 0.2);
    rimLight.position.set(0, -5, 0);
    this.scene.add(rimLight);

    this.camera.position.z = 5;

    this.renderer.domElement.addEventListener('click', this.onCanvasClick.bind(this));
  }

  private createChristmasTree() {
    // Create tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
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
      const coneMaterial = new THREE.MeshPhongMaterial({ color: treeColor });
      const cone = new THREE.Mesh(coneGeometry, coneMaterial);
      cone.position.y = i * 1;
      this.scene.add(cone);
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

  private animate() {
    requestAnimationFrame(() => this.animate());

    // Update ornament rotations
    this.scene.children.forEach(child => {
      if (child instanceof THREE.Mesh && child.userData['rotationSpeed']) {
        child.rotation.x += child.userData['rotationSpeed'].x;
        child.rotation.y += child.userData['rotationSpeed'].y;
      }
    });

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

  ngOnDestroy() {
    // Clean up THREE.js resources
    this.renderer?.dispose();
    this.scene?.clear();
  }
}
