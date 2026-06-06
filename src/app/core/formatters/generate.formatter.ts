import { ContentResponse, Generate, Platform } from '../data-services/narra-pic-api';
import { IGenerate } from '../models/generate.model';

export class GenerateFormatter {
  static unformat(raw: IGenerate): Generate {
    return {
      image_url: raw.imageUrl,
      platform: raw.platform,
      prompt: raw.prompt,
      style: raw.style,
    };
  }
}
