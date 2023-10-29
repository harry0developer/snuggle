import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReAuthPage } from './re-auth.page';



const routes: Routes = [
  {
    path: '',
    component: ReAuthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReAuthRoutingModule {}
