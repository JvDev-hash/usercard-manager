import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'workspace',
        loadComponent: () => import('./workspace/workspace.component').then(m => m.WorkspaceComponent),
        children: [
            {
                path: 'welcome',
                loadComponent: () => import('./welcome/welcome.component').then(m => m.WelcomeComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./users-list/users-list.component').then(m => m.UsersListComponent)
            },
            {
                path: 'users/insert',
                loadComponent: () => import('./insert-users/insert-users.component').then(m => m.InsertUsersComponent)
            },
            {
                path: 'users/edit/:id',
                loadComponent: () => import('./update-users/update-users.component').then(m => m.UpdateUsersComponent)
            },
            {
                path: 'cards',
                loadComponent: () => import('./cards-list/cards-list.component').then(m => m.CardsListComponent)
            },
            {
                path: 'cards/insert',
                loadComponent: () => import('./insert-cards/insert-cards.component').then(m => m.InsertCardsComponent)
            },
            { path: '**', component: PageNotFoundComponent },
            {
                path: '',
                redirectTo: 'welcome',
                pathMatch: 'full'
            }
        ]
    },
    { path: '',   redirectTo: '/login', pathMatch: 'full' }
];
