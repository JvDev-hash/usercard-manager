import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import e from 'express';

interface User {
  id: number;
  nome: string;
  email: string;
  permissoes: string;
}

@Component({
  selector: 'app-update-users',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './update-users.component.html',
  styleUrl: './update-users.component.css'
})
export class UpdateUsersComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userError: string = '';
  successMessage: string = '';
  userId: number = 0;

  userForm = this.formBuilder.group({
    id: ['', [Validators.required]],
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    email: ['', [Validators.required, Validators.email]],
    senha: [''],
    permissoes: ['', [Validators.required]]
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId) {
        this.loadUserData();
      }
    });
  }

  loadUserData() {
    this.userService.consult(this.userId).subscribe({
      next: (response: any) => {
        const user = response as User;
        this.userForm.patchValue({
          id: user.id.toString(),
          nome: user.nome,
          email: user.email,
          permissoes: user.permissoes
        });
      },
      error: (error) => {
        this.userError = 'Erro ao carregar dados do usuário.';
        console.error('Error loading user:', error);
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.userError = '';
      this.successMessage = '';
      const { id, nome, email, senha, permissoes } = this.userForm.value;
      console.log(this.userForm.value);
      this.userService.update(Number(id), nome!, email!, senha!, permissoes!).subscribe({
        next: (response) => {
          this.successMessage = 'Usuário atualizado com sucesso!';
          setTimeout(() => {
            this.router.navigate(['/workspace/users']);
          }, 2000);
        },
        error: (error) => {
          if (error.status === 201) {
            this.successMessage = 'Usuário atualizado com sucesso!';
            setTimeout(() => {
              this.router.navigate(['/workspace/users']);
            }, 2000);
          } else {
            this.userError = 'Erro ao atualizar usuário.';
          }
        }
      });
    }
  }
}
