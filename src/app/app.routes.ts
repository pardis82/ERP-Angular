import { Routes } from '@angular/router';
import {LoginForm} from './pages/Login/login-form'
import { CodePage } from './pages/SignUP/code';
import { UserProfile } from './pages/SignUP/userprofile';


 const routes: Routes = [

  
  { path: 'Login', component: LoginForm, title: 'Login Form' },

  {
    path: 'Code',
    component: CodePage,
    title: ' Verification Code',
  },

  {
    path: 'UserProfile',
    component: UserProfile,
    title: 'User Profile'
  },
];
export default routes;
