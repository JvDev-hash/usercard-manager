import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface User {
  id: number;
  nome: string;
  email: string;
  permissoes: string;
  cartoes?: Cartao[];
}

export interface Cartao {
  id: number;
  numeroCartao: number;
  nome: string;
  status: boolean;
  tipoCartao: string;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ConfirmDialogComponent,
    ReactiveFormsModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'permissoes', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  filteredData: User[] = [];
  pageSize = 5;
  pageSizeOptions = [1, 2, 5];
  showFirstLastButtons = false;
  isLoading = false;
  showFilters = false;
  filterForm: FormGroup;
  permissao = localStorage.getItem("permissao");
  expandedUser: User | null = null;
  displayedSubColumns: string[] = ['id', 'numeroCartao', 'nome', 'tipoCartao', 'status'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      id: [''],
      nome: [''],
      email: [''],
      permissoes: ['']
    });
    this.showFilters = false;
  }

  ngOnInit() {
    this.loadUsers();
    this.setupFilters();
  }

  setupFilters() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(filters => {
        this.applyFilters(filters);
      });
  }

  applyFilters(filters: any) {
    this.filteredData = this.dataSource.data.filter(user => {
      return (
        (!filters.id || user.id.toString().includes(filters.id)) &&
        (!filters.nome || user.nome.toLowerCase().includes(filters.nome.toLowerCase())) &&
        (!filters.email || user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.permissoes || user.permissoes.toLowerCase().includes(filters.permissoes.toLowerCase()))
      );
    });
  }

  toggleUserDetails(user: User): void {
    this.expandedUser = this.expandedUser?.id === user.id ? null : user;
    
    // Force table to redraw (helps with animation)
    this.dataSource.data = [...this.dataSource.data];
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.list(this.paginator?.pageIndex || 0, this.paginator?.pageSize || 5, "Page")
      .subscribe({
        next: (response: any) => {
          this.dataSource.data = response.content || [];
          this.filteredData = [...this.dataSource.data];
          if (this.paginator) {
            this.paginator.length = response.totalElements || 0;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.isLoading = false;
        }
      });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.loadUsers();
      });
    }
  }

  editUser(user: User) {
    if(this.permissao !== "VIEW"){
      this.router.navigate(['/workspace/users/edit', user.id]);
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          title: 'Permissão necessária',
          message: `Você não tem permissão para acessar esta funcionalidade.`,
          cancelText: 'Entendi'
        }
      });
    }
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o usuário ${user.nome}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.permissao === "ADMIN") {
        this.isLoading = true;
        this.userService.delete(user.id).subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.isLoading = false;
          }
        });
      } else if (result && this.permissao !== "ADMIN")  {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '300px',
          data: {
            title: 'Permissão necessária',
            message: `Você não tem permissão para acessar esta funcionalidade.`,
            cancelText: 'Entendi'
          }
        });
      }
    });
  }

  insertUser() {
    if(this.permissao !== "VIEW"){
      this.router.navigate(['/workspace/users/insert']);
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          title: 'Permissão necessária',
          message: `Você não tem permissão para acessar esta funcionalidade.`,
          cancelText: 'Entendi'
        }
      });
    }
  }

  clearFilters() {
    this.filterForm.reset();
    this.filteredData = [...this.dataSource.data];
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}
