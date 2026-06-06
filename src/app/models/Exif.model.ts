interface ExifData {
  Make?: string;
  Model?: string;
  DateTime?: string;
  ISO?: number;
  FNumber?: number;
  ExposureTime?: number;
  FocalLength?: number;
  LensModel?: string;
  [key: string]: any;
}
