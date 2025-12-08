import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template: ` <header dir="ltr" class=" mb-5 px-20 py-5 bg-gray-300">
      <div class="flex justify center">
        <a class="text-blue-500 hover:text-blue-700" [routerLink]="'/Login'">Login Page</a>
        <a class="ml-10 text-blue-500 hover:text-blue-700" [routerLink]="'/Code'">Code</a>
        <a class="ml-10 text-blue-500 hover:text-blue-700" [routerLink]="'/'">Api practice</a>
        <a class="ml-10 text-blue-500 hover:text-blue-700" [routerLink]="'UserProfile'"
          >User Profile</a
        >
        <a class="ml-10 text-blue-500 hover:text-blue-700" [routerLink]="'/Auth'"
          >Log In Sign Up toggle</a
        >
      </div>
    </header>

    <router-outlet>
      <section class="flex justify-center"></section>
    </router-outlet>`,
})
export class App {}
