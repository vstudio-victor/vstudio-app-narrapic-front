import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GenerateService } from '../../data-services/narra-pic-api/api/generate.service';
import { IGenerate } from '../../models/generate.model';
import { ContentResponse, Generate } from '../../data-services/narra-pic-api';
import { GenerateFormatter } from '../../formatters/generate.formatter';

@Injectable({ providedIn: 'root' })
export class GenerateHttpService {
  constructor(private generateService: GenerateService) {}

  generateCaptions(body: IGenerate): Observable<ContentResponse> {
    return this.generateService.generate(GenerateFormatter.unformat(body)).pipe(
      map((response: ContentResponse) => {
        return response;
      })
    );
  }
}
