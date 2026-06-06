import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ContentResponse } from '../../../../core/data-services/narra-pic-api';
import { Icon } from '../../../../icon/icon';

@Component({
  selector: 'ltz-generated-prompt',
  imports: [Icon],
  templateUrl: './generated-prompt.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratedPrompt {
  generatedContent = input<ContentResponse>();
  isGenerationStarted = input<boolean>();

  copied = false;

  copyToClipboard() {
    const fullText = `${this.generatedContent()?.description}\n\n${
      this.generatedContent()?.shortCaption
    }\n\n ${this.generatedContent()?.altText}${this.generatedContent()?.hashtags?.join(' ')}`;

    navigator.clipboard
      .writeText(fullText)
      .then(() => {
        this.copied = true;
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  }

  regenerate() {
    console.log('Regenerating caption...');
    // Add your regeneration logic here
  }
}
