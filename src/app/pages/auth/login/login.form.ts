import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Style, Platform } from '../../../core/data-services/narra-pic-api';
import { IGenerateFormGroup } from '../../dashboard/components/generate-prompt/generate-prompt.type';
import { ILoginFormGroup } from './login.type';

export class LoginForm {
  innerForm: FormGroup<ILoginFormGroup>;

  constructor() {
    const fb = new FormBuilder();

    this.innerForm = fb.group<ILoginFormGroup>({
      fullName: fb.nonNullable.control<string | undefined>(undefined),
      email: fb.nonNullable.control<string | undefined>(undefined, [
        Validators.required,
        Validators.email,
      ]),
      password: fb.nonNullable.control<string | undefined>(undefined, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
}
