import { Routes } from '@angular/router';
import { LoginForm } from './pages/Login/login-form';
import { CodePage } from './pages/SignUP/code';
import { UserProfile } from './pages/SignUP/userprofile';
import { UserDashboard } from './components/dashboard/user-dashboard/user-dashboard';
import { SignUp } from './pages/SignUP/signup';

const routes: Routes = [
  { path: '', component: UserDashboard, title: 'Home page' },
  { path: 'Login', component: LoginForm, title: 'Login Form' },

  {
    path: 'Code',
    component: CodePage,
    title: ' Verification Code',
  },

  {
    path: 'UserProfile',
    component: UserProfile,
    title: 'User Profile',
  },
  { path: 'SignUp', component: SignUp, title: 'Sign up form' },
];
export default routes;
