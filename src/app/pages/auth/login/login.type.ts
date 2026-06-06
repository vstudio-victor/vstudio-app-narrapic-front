import { FormControls } from "../../../utils/forms-utils";

export interface IConnection {
  fullName?: string;
  email?: string;
  password?: string;
}

export type ILoginFormGroup = FormControls<IConnection>;
