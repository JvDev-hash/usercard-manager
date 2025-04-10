import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CardsService } from '../services/cards.service';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../shared/breadcrumbs/breadcrumbs.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface User {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-insert-cards',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './insert-cards.component.html',
  styleUrl: './insert-cards.component.css'
})
export class InsertCardsComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private cardService = inject(CardsService);
  private userService = inject(UserService);
  private router = inject(Router);

  cardError: string = '';
  successMessage: string = '';
  users: User[] = [];
  filteredUsers: Observable<User[]> = of([]);
  isLoading: boolean = false;
  selectedUserId: number | null = null;

  cardForm = this.formBuilder.group({
    usuario: [null, Validators.required],
    numeroCartao: [Math.floor(Math.random() * (999999999999 - 100000000000 + 1) ) + 100000000000, [Validators.required]],
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    status: [true, [Validators.required]],
    tipoCartao: ['', [Validators.required]]
  });

  ngOnInit() {
    console.log('InsertCardsComponent initialized');
    this.loadUsers();
  }

  loadUsers() {
    console.log('Loading users...');
    this.isLoading = true;
    this.userService.fullList(0, 100, "Full").subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        // Check if response is an array
        if (Array.isArray(response)) {
          this.users = response;
          this.setupAutocomplete();
        } 
        // Check if response is an object with content property
        else if (response && response.content) {
          this.users = response.content;
          this.setupAutocomplete();
        } 
        else {
          console.error('Invalid response format:', response);
          this.cardError = 'Erro ao carregar usuários: Formato de resposta inválido';
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
        this.cardError = 'Erro ao carregar usuários: ' + (error.message || 'Erro desconhecido');
      }
    });
  }

  setupAutocomplete() {
    this.filteredUsers = this.cardForm.get('usuario')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          return this._filterUsers(value);
        }
        return this.users;
      })
    );
  }

  private _filterUsers(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user => 
      user.nome.toLowerCase().includes(filterValue) || 
      user.id.toString().includes(filterValue)
    );
  }

  onUserSelected(event: any) {
    const selectedUser = event.option.value;
    if (selectedUser) {
      this.selectedUserId = selectedUser.id;
      this.cardForm.patchValue({
        usuario: selectedUser
      });
    }
  }

  displayUserFn(user: User | null): string {
    if (!user) return '';
    return user.nome;
  }

  onSubmit() {
    if (this.cardForm.valid) {
      this.cardError = '';
      this.successMessage = '';
      const formValue = this.cardForm.value;
      if (!formValue.usuario || typeof formValue.usuario === 'string') {
        this.cardError = 'Por favor, selecione um usuário válido';
        return;
      }
      const usuario = formValue.usuario as User;
      this.cardService.insert(usuario.id, formValue.numeroCartao!, formValue.nome!, formValue.status!, formValue.tipoCartao!).subscribe({
        next: (response) => {
          this.successMessage = 'Cartão cadastrado com sucesso!';
          this.router.navigate(['/workspace/cards']);
        },
        error: (error) => {
          if (error.status === 201) {
            this.successMessage = 'Cartão cadastrado com sucesso!';
            this.router.navigate(['/workspace/cards']);
          } else {
            this.cardError = 'Erro ao cadastrar Cartão. Número já existente!';
          }
        }
      });
    }
  }
}
