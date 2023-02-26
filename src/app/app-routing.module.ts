import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddEmployeeComponent} from "./components/add-employee/add-employee.component";

const routes: Routes = [
  {path: '', component: AddEmployeeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
