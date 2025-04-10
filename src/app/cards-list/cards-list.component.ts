import { Component, ViewChild, OnInit } from '@angular/core';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { CardsService } from '../services/cards.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface Card {
  id: number;
  numeroCartao: number;
  nome: string;
  status: boolean;
  tipoCartao: string;
}

@Component({
  selector: 'app-cards-list',
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
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.css'
})
export class CardsListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'numero', 'nome', 'status', 'tipo', 'actions'];
  dataSource: Card[] = [];
  filteredData: Card[] = [];
  pageSize = 5;
  pageSizeOptions = [1, 2, 5];
  showFirstLastButtons = false;
  isLoading = false;
  showFilters = false;
  filterForm: FormGroup;
  permissao = localStorage.getItem("permissao");

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private cardService: CardsService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      id: [''],
      numero: [''],
      nome: [''],
      status: [''],
      tipo: ['']
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
    this.filteredData = this.dataSource.filter(card => {
      return (
        (!filters.id || card.id.toString().includes(filters.id)) &&
        (!filters.numero || card.numeroCartao.toString().includes(filters.numero)) &&
        (!filters.nome || card.nome.toLowerCase().includes(filters.nome.toLowerCase())) &&
        (!filters.status || card.status.toString() === filters.status) &&
        (!filters.tipo || card.tipoCartao.toLowerCase().includes(filters.tipo.toLowerCase()))
      );
    });
  }

  loadUsers() {
    this.isLoading = true;
    this.cardService.list(this.paginator?.pageIndex || 0, this.paginator?.pageSize || 5)
      .subscribe({
        next: (response: any) => {
          this.dataSource = response.content || [];
          this.filteredData = [...this.dataSource];
          if (this.paginator) {
            this.paginator.length = response.totalElements || 0;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading cards:', error);
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

  updateCard(card: Card) {
    if(this.permissao !== "VIEW"){
      this.cardService.update(card.id, !card.status).subscribe({
        next: (response: any) => {
          console.log("Valor atualizado!");
          this.loadUsers();
        },
        error: (error) => {
          if (error.status === 201) {
            console.log("Valor atualizado!");
            this.loadUsers();
          } else {
            console.error('Error updating card:', error);
          this.isLoading = false;
          }
        }
      });
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

  deleteCard(card: Card) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o cartão ${card.nome}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.permissao === "ADMIN") {
        this.isLoading = true;
        this.cardService.delete(card.id).subscribe({
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

  insertCard() {
    if(this.permissao !== "VIEW"){
      this.router.navigate(['/workspace/cards/insert']);
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
    this.filteredData = [...this.dataSource];
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}
