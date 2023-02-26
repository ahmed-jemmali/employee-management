import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AddEmployeeComponent} from './components/add-employee/add-employee.component';
import {ReactiveFormsModule} from "@angular/forms";
import {EmployeesListComponent} from './components/employees-list/employees-list.component';
import {HttpClientModule} from "@angular/common/http";
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {DragDropModule} from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    AppComponent,
    AddEmployeeComponent,
    EmployeesListComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
