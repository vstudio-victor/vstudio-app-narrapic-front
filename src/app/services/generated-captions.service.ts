import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Captions, ContentResponse } from '../core/data-services/narra-pic-api';
import { GenerateHttpService } from '../core/http-services/generate/generate.http.service';
import { IGenerate } from '../core/models/generate.model';
import { CaptionsHttpService } from '../core/http-services/captions/captions.http.service';

@Injectable()
export class GeneratedCaptionsService {
  private generateHttpService = inject(CaptionsHttpService);

  generatedCaptionsByUser(userId: string): Observable<Captions[]> {
    return this.generateHttpService.generateCaptions(userId);
  }
}
