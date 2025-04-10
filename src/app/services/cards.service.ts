import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private http = inject(HttpClient);
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  insert(id: number, numeroCartao: number, nome: string, status: boolean, tipoCartao: string) {
    const body = JSON.stringify({ numeroCartao, nome, status, tipoCartao });
    console.log(body);
    return this.http.post(`/api/cartao/cadastrar/${id}`, body, { 
      headers: this.headers,
      withCredentials: true 
    });
  }

  update(id: number, status: boolean) {
    return this.http.put(`/api/cartao/mudarStatus/${id}?status=${status}`, { 
      headers: this.headers,
      withCredentials: true 
    });
  }

  delete(id: number) {
    return this.http.delete(`/api/cartao/delete/${id}`, { 
      headers: this.headers,
      withCredentials: true 
    });
  }

  list(pageNo: number = 0, pageSize: number = 5) {
    const params = {
      pageNo: pageNo.toString(),
      pageSize: pageSize.toString()
    };
    
    return this.http.get('/api/cartao/listar', { 
      params,
      headers: this.headers,
      withCredentials: true 
    });
  }
}
