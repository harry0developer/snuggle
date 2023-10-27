import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'users',
        loadChildren: () => import('../pages/users/users.module').then(m => m.UsersPageModule)
      },
      {
        path: 'chats',
        loadChildren: () => import('../pages/chats/chats.module').then(m => m.ChatsPageModule)

      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: '/auth',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
