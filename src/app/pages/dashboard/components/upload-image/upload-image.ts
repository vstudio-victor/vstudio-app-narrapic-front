import { ChangeDetectionStrategy, Component, computed, forwardRef, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'ltz-upload-image',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadImage),
      multi: true,
    },
  ],
  templateUrl: './upload-image.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadImage {
  value: string | undefined;
  onChange = (value: any) => {};
  onTouched = () => {};
  private imageSource = signal<string>('');
  exifData = signal<ExifData | null>(null);
  isLoadingExif = signal<boolean>(false);
  // Computed signal (this is what you're using in the template)
  uploadedImage = computed(() => this.imageSource());

  async onImageUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        console.error('Please select an image file');
        return;
      }

      try {
        const options = {
          maxSizeMB: 4,
          maxWidthOrHeight: 2048,
          useWebWorker: true,
          fileType: 'image/jpeg',
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();

        reader.onload = async (e: ProgressEvent<FileReader>) => {
          this.imageSource.set(e.target?.result as string);
          this.value = e.target?.result as string;
          this.onChange(this.value);
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        const reader = new FileReader();
        reader.onload = async (e: ProgressEvent<FileReader>) => {
          this.imageSource.set(e.target?.result as string);
          this.value = e.target?.result as string;
          this.onChange(this.value);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(): void {
    this.imageSource.set('');
  }

  writeValue(value: any): void {
    if (value === null || value === undefined) {
      this.imageSource.set('');
    } else {
      this.imageSource.set(value);
    }
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onValueChange(value: string | undefined): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
