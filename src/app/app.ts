import { RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ServicesModule } from './services/services.module';

@Component({
  selector: 'ltz-root',
  imports: [RouterOutlet, ServicesModule],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
