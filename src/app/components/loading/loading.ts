import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading';
@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
  public loading = inject(LoadingService);
}
