import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { TreeCreatorComponent } from './components/tree-creator/tree-creator.component';
import { TreeDecoratorComponent } from './components/tree-decorator/tree-decorator.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: TreeCreatorComponent },
  { path: 'home', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'create', component: TreeCreatorComponent },
  { path: 'decorator/:id', component: TreeDecoratorComponent },
];
