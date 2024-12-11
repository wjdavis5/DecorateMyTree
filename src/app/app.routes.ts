import { Routes } from '@angular/router';
import { TreeCreatorComponent } from './components/tree-creator/tree-creator.component'
import { TreeDecoratorComponent } from './components/tree-decorator/tree-decorator.component'

export const routes: Routes = [
  { path: '', component: TreeCreatorComponent },
  { path: 'tree/:id', component: TreeDecoratorComponent },
  { path: '**', redirectTo: '' }
];
