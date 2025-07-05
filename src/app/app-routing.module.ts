import { ForgotpasswordPage } from './forgotpassword/forgotpassword.page';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthGuard } from 'src/providers/auth-guard.service';

const routes: Routes = [

  /*
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
*/
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'chatgpt',
    loadChildren: () => import('./chatgpt/chatgpt.module').then( m => m.ChatgptPageModule)
  },
  {
    path: 'chatgpt-openai',
    loadChildren: () => import('./chatgpt-openai/chatgpt-openai.module').then( m => m.ChatgptOpenaiPageModule)
  },
  {
    path: 'legal',
    loadChildren: () => import('./legal/legal.module').then( m => m.LegalPageModule)
  },
  {
    path: 'files',
    loadChildren: () => import('./files/files.module').then( m => m.FilesPageModule)
  },

  {
    path: 'my-address',
    loadChildren: () => import('./my-address/my-address.module').then( m => m.MyAddressPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  }, 
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./forgotpassword/forgotpassword.module').then( m => m.ForgotpasswordPageModule)
  },

  {
    path: 'tabs/chat',
    loadChildren: () => import('./chatgpt/chatgpt.module').then(m => m.ChatgptPageModule)
  },
  {
    path: 'file/:id',
    loadChildren: () => import('./file/file.module').then( m => m.FilePageModule)
  },
  {
    path: 'chat-list',
    loadChildren: () => import('./chat-list/chat-list.module').then( m => m.ChatListPageModule)
  },
  {
    path: 'chat-doc/:id',
    loadChildren: () => import('./chat-doc/chat-doc.module').then( m => m.ChatDocPageModule)
  },
  {
    path: 'chat-alldoc',
    loadChildren: () => import('./chat-alldoc/chat-alldoc.module').then( m => m.ChatAlldocPageModule)
  },
  {
    path: 'devis',
    loadChildren: () => import('./devis/devis.module').then( m => m.DevisPageModule)
  },
  {
    path: 'comparer',
    loadChildren: () => import('./comparer/comparer.module').then( m => m.ComparerPageModule)
  },
  {
    path: 'chatgpt-openai',
    loadChildren: () => import('./chatgpt-openai/chatgpt-openai.module').then( m => m.ChatgptOpenaiPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    TranslateModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
