import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from 'src/providers/auth-guard.service';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'login',
        loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('../chat-list/chat-list.module').then(m => m.ChatListPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'files',
        loadChildren: () => import('../files/files.module').then(m => m.FilesPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'devis',
        loadChildren: () => import('../devis/devis.module').then(m => m.DevisPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'file/:id',
        loadChildren: () => import('../file/file.module').then(m => m.FilePageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'profil',
        loadChildren: () => import('../profil/profil.module').then(m => m.ProfilPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'chat-doc/:id',
        loadChildren: () => import('../chat-doc/chat-doc.module').then(m => m.ChatDocPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'comparer',
        loadChildren: () => import('../comparer/comparer.module').then(m => m.ComparerPageModule),
        canActivate: [AuthGuard]
      },

      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
