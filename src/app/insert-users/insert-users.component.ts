import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { BreadcrumbsComponent } from '../shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-insert-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbsComponent
  ],
  templateUrl: './insert-users.component.html',
  styleUrl: './insert-users.component.css'
})
export class InsertUsersComponent {

  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  userError: string = '';
  successMessage: string = '';

  userForm = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    permissoes: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.userForm.valid) {
      this.userError = '';
      this.successMessage = '';
      const { nome, email, senha, permissoes } = this.userForm.value;
      this.userService.insert(email!, senha!, nome!, permissoes!).subscribe({
        next: (response) => {
          this.successMessage = 'Usuário cadastrado com sucesso!';
          this.userForm.reset();
        },
        error: (error) => {
          if (error.status === 201) {
            this.successMessage = 'Usuário cadastrado com sucesso!';
            this.userForm.reset();
          } else {
            this.userError = 'Erro ao cadastrar usuário. Email já existente!';
          }
        }
      });
    }
  }
}
