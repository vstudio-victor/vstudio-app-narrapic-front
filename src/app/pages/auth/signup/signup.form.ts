import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ISignUpFormGroup } from "./signup.type";

export class SignUpForm {
  innerForm: FormGroup<ISignUpFormGroup>;

  constructor() {
    const fb = new FormBuilder();

    this.innerForm = fb.group<ISignUpFormGroup>({
      fullName: fb.nonNullable.control<string | undefined>(undefined,  [Validators.required]),
      email: fb.nonNullable.control<string | undefined>(undefined,  [Validators.required, Validators.email]),
      password: fb.nonNullable.control<string | undefined>(undefined, [Validators.required, Validators.minLength(6)]),
    });
  }
}
