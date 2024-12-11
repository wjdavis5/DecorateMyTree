import { Injectable, Inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, updateDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '@angular/fire/auth';

export interface Ornament {
  id: string;
  type: string;
  position: { x: number; y: number; z: number };
  message: string;
  decoratorName: string;
}

export interface Tree {
  id: string;
  name: string;
  createdAt: Date;
  ornaments: Ornament[];
  creatorId: string;
  creatorName: string;
}

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  constructor(
    @Inject('FIRESTORE_DB') private db: Firestore,
    private auth: Auth
  ) {
    if (!this.db) {
      throw new Error('Firestore instance not properly initialized');
    }
  }

  async createNewTree(name: string): Promise<string> {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('Must be logged in to create a tree');

      const treeId = uuidv4();
      const treeRef = doc(collection(this.db, 'trees'), treeId);

      await setDoc(treeRef, {
        id: treeId,
        name,
        createdAt: new Date(),
        ornaments: [],
        creatorId: user.uid,
        creatorName: user.displayName || 'Anonymous'
      });

      return treeId;
    } catch (error) {
      console.error('Error creating tree:', error);
      throw new Error(`Failed to create tree: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserTrees(): Promise<Tree[]> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Must be logged in to fetch trees');

    const treesRef = collection(this.db, 'trees');
    const q = query(treesRef, where('creatorId', '==', user.uid), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data() as Tree);
  }

  async getTree(treeId: string): Promise<Tree | null> {
    const treeRef = doc(collection(this.db, 'trees'), treeId);
    const treeDoc = await getDoc(treeRef);

    if (treeDoc.exists()) {
      return treeDoc.data() as Tree;
    }

    return null;
  }

  async addOrnament(treeId: string, ornament: Omit<Ornament, 'id'>): Promise<string> {
    const treeRef = doc(collection(this.db, 'trees'), treeId);
    const tree = await this.getTree(treeId);

    if (!tree) throw new Error('Tree not found');

    const newOrnament = {
      ...ornament,
      id: uuidv4()
    };

    const updatedOrnaments = [...tree.ornaments, newOrnament];

    await updateDoc(treeRef, {
      ornaments: updatedOrnaments
    });

    return newOrnament.id;
  }
}
