import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Token } from './token';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  constructor(
    private http: HttpClient,
    private token: Token
  ) {}

  async deleteUserInFirebase(uid: string): Promise<{ ok: boolean; message?: string }> {
    const jwt = this.token.getToken();
    const headers = jwt
      ? new HttpHeaders({ Authorization: `Bearer ${jwt}` })
      : undefined;

    const obs$ = this.http.post<{ ok: boolean; message?: string }>(
      '/api/admin/delete-user',
      { uid },
      { headers }
    );

    return firstValueFrom(obs$);
  }
}
