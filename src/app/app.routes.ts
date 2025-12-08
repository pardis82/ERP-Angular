import { Routes } from '@angular/router';
import { LoginForm } from './pages/Login/login-form';
import { CodePage } from './pages/SignUP/code';
import { UserProfile } from './pages/SignUP/userprofile';
import { UserDashboard } from './components/dashboard/user-dashboard/user-dashboard';
import { SignUp } from './pages/SignUP/signup';
import { AuthComponent } from './pages/Auth/auth-component';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { Dashboard } from './pages/dashboard/dashboard';
import { routePaths } from './config/route-paths';

const routes: Routes = [
  { path: '', component: UserDashboard, title: 'Home page' },
  { path: 'Login', component: LoginForm, title: 'Login Form' },

  {
    path: 'Code',
    component: CodePage,
    title: ' Verification Code',
  },
  {
    path: routePaths.adminDashboard, // or 'adminDashboard'
    component: AdminDashboard,
  },

  // 3. Add the User Dashboard Route
  {
    path: routePaths.dashboard, // or 'dashboard'
    component: Dashboard,
  },

  {
    path: 'UserProfile',
    component: UserProfile,
    title: 'User Profile',
  },
  { path: 'SignUp', component: SignUp, title: 'Sign up form' },
  { path: 'Auth', component: AuthComponent, title: 'Login/Signup Toggle' },
];
export default routes;
