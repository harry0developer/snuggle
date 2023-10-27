import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InternetPage } from './internet.page';

const routes: Routes = [
  {
    path: '',
    component: InternetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InternetPageRoutingModule {}
