import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Token } from './token';

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  private baseUrl = '/api/upload';

  constructor(
    private http: HttpClient,
    private token: Token
  ) {}

  async upload(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.token.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    const obs$ = this.http.post(this.baseUrl, formData, { headers });
    return await firstValueFrom(obs$);
  }
}
