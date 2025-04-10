import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private formBuilder = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);

  loginError: string = '';

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginError = '';
      const { email, senha } = this.loginForm.value;
      this.loginService.login(email!, senha!).subscribe({
        next: (response) => {
          localStorage.setItem('nome', JSON.parse(JSON.stringify(response)).username);
          localStorage.setItem('permissao', JSON.parse(JSON.stringify(response)).userPermission);
          this.router.navigate(['/workspace/welcome']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.loginError = 'Email ou senha inválidos';
        }
      });
    }
  }

}
