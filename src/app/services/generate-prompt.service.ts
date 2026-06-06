import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentResponse } from '../core/data-services/narra-pic-api';
import { GenerateHttpService } from '../core/http-services/generate/generate.http.service';
import { IGenerate } from '../core/models/generate.model';

@Injectable()
export class GeneratePromptService {
  private generateHttpService = inject(GenerateHttpService);

  generateCaptions(body: IGenerate): Observable<ContentResponse> {
    return this.generateHttpService.generateCaptions(body);
  }
}
