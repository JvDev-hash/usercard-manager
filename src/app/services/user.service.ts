import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  insert(email: string, senha: string, nome: string, permissoes: string) {
    const body = JSON.stringify({ nome, email, senha, permissoes });
    console.log(body);
    return this.http.post('/api/usuario/cadastrar', body, { 
      headers: this.headers,
      withCredentials: true 
    });
  }

  update(id: number, nome: string, email: string, senha: string, permissoes: string) {
    if (senha !== "") {
      const body = JSON.stringify({ nome, email, senha, permissoes });
    return this.http.put(`/api/usuario/alterar/${id}`, body, { 
      headers: this.headers,
      withCredentials: true 
    });
    } else {
      const body = JSON.stringify({ nome, email, permissoes });
      return this.http.put(`/api/usuario/alterar/${id}`, body, { 
      headers: this.headers,
      withCredentials: true 
    });
  }
}

  consult(id: number) {
    return this.http.get(`/api/usuario/consulta/${id}`, { 
      headers: this.headers,
      withCredentials: true 
    });
  }

  delete(id: number) {
    return this.http.delete(`/api/usuario/deletar/${id}`, { 
      headers: this.headers,
      withCredentials: true 
    });
  }

  list(pageNo: number = 0, pageSize: number = 5, listMethod: string) {
    const params = {
      pageNo: pageNo.toString(),
      pageSize: pageSize.toString(),
      listMethod: listMethod
    };
    
    return this.http.get('/api/usuario/consulta', { 
      params,
      headers: this.headers,
      withCredentials: true 
    });
  }

  fullList(pageNo: number = 0, pageSize: number = 5, listMethod: string){
    const params = {
      pageNo: pageNo.toString(),
      pageSize: pageSize.toString(),
      listMethod: listMethod
    };
    
    return this.http.get('/api/usuario/consulta', { 
      params,
      headers: this.headers,
      withCredentials: true 
    });
  }
}
