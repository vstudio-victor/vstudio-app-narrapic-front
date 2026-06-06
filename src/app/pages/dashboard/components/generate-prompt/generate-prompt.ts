import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  output,
  Output,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlatformSelector } from '../platform-selector/platform-selector';
import { StyleSelector } from '../style-selector/style-selector';
import { GeneratePromptForm } from './generate-prompt.form';
import { UploadImage } from '../upload-image/upload-image';
import { GeneratePromptService } from '../../../../services/generate-prompt.service';
import { ContentResponse } from '../../../../core/data-services/narra-pic-api/model/contentResponse';
import { User } from '../../../../core/data-services/narra-pic-api/model/user';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'ltz-generate',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    PlatformSelector,
    StyleSelector,
    UploadImage,
  ],
  templateUrl: './generate-prompt.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratePrompt {
  form: GeneratePromptForm = new GeneratePromptForm();
  isGenerating = signal(false);
  private generatePromptService = inject(GeneratePromptService);
  private auth = inject(AuthService);
  contentResponse = output<ContentResponse>();
  isGenerationOngoing = output<boolean>();

  generateCaption() {
    this.isGenerating.set(true);
    this.isGenerationOngoing.emit(true);

    this.auth.getCurrentUser().subscribe((user) => {
      console.log('result user', user);
    });

    this.generatePromptService.generateCaptions(this.form.innerForm.value).subscribe({
      next: (result) => {
        if (result) {
          this.contentResponse.emit(result);
          this.isGenerating.set(false);
          this.isGenerationOngoing.emit(false);
        }
      },
      complete: () => {
        this.form.innerForm.patchValue({
          imageUrl: undefined,
          style: undefined,
          platform: undefined,
          prompt: undefined,
        });
      },
      error: (error) => {
        console.error('Error generating captions:', error);
      },
    });
  }
}
