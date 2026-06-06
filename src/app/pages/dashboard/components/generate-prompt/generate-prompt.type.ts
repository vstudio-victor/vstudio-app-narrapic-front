import { FormControls } from '../../../../utils/forms-utils';
import { Platform, Style } from '../platform-selector/platform-selector';

export interface IGeneratePrompt {
  style?: Style;
  platform?: Platform;
  prompt?: string;
  imageUrl?: string;
}

export type IGenerateFormGroup = FormControls<IGeneratePrompt>;
