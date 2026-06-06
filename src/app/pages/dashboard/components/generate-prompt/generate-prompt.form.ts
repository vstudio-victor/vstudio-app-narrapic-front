import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IGenerateFormGroup } from './generate-prompt.type';
import { Platform, Style } from '../platform-selector/platform-selector';

export class GeneratePromptForm {
  innerForm: FormGroup<IGenerateFormGroup>;

  constructor() {
    const fb = new FormBuilder();

    this.innerForm = fb.group<IGenerateFormGroup>({
      style: fb.nonNullable.control<Style | undefined>(undefined, Validators.required),
      platform: fb.nonNullable.control<Platform | undefined>(undefined, Validators.required),
      prompt: fb.nonNullable.control<string | undefined>(undefined, [
        Validators.minLength(50),
        Validators.maxLength(250),
        Validators.required
      ]),
      imageUrl: fb.nonNullable.control<string | undefined>(undefined, Validators.required),
    });
  }
}
