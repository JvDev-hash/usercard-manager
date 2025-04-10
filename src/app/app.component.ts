import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UsersListComponent } from './users-list/users-list.component';
import { CardsListComponent } from './cards-list/cards-list.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { InsertUsersComponent } from './insert-users/insert-users.component';
import { UpdateUsersComponent } from './update-users/update-users.component';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    LoginComponent, 
    WorkspaceComponent, 
    PageNotFoundComponent,
    UsersListComponent,
    CardsListComponent,
    WelcomeComponent,
    InsertUsersComponent,
    UpdateUsersComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'usercard-manager';
}
