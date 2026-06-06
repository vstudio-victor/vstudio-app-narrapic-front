import { FormControl } from "@angular/forms";

export type FormControls<T> = {
  [field in keyof Required<T>]: FormControl<T[field]>;
};
