import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { uploadFiles } from './interface';



@Injectable({
  providedIn: 'root'
})
export class CloudinaryUploadService {
  private url = `${environment?.cloudinaryUrl}/${environment?.cloudinary?.cloudName}/image/upload`;

  constructor() { }

  async uploadFiles(files: File | string, folder: string): Promise<uploadFiles> {
    const formData = new FormData();
    formData.append("file", files);
    formData.append("upload_preset", 'ml_default');
    formData.append("folder", folder);
    try {
      const response = await fetch(this.url, {
        method: "POST",
        body: formData
      });

      return response.json();
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }
}
