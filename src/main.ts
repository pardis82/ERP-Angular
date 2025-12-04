import { bootstrapApplication } from '@angular/platform-browser';
import { provideProtractorTestingSupport } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import routes from './app/app.routes';

bootstrapApplication(App, {
  providers: [provideProtractorTestingSupport(), provideRouter(routes)],
}).catch((err) => console.error(err));
