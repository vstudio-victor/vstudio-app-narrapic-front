import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Captions, CaptionsService } from '../../data-services/narra-pic-api';

@Injectable({ providedIn: 'root' })
export class CaptionsHttpService {
  constructor(private generateService: CaptionsService) {}

  generateCaptions(userId: string): Observable<Captions[]> {
    return this.generateService.getCaptions(userId).pipe(
      map((response: Captions[]) => {
        return response;
      }),
    );
  }
}
