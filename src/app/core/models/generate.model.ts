import { Platform, Style } from "../data-services/narra-pic-api";

export interface IGenerate {
  imageUrl?: string;
  prompt?: string;
  platform?: Platform;
  style?: Style;
}
