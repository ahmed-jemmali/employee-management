import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../services/data.service";
import {BehaviorSubject} from "rxjs";
import {Employee} from "../../models/employee";

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeForm!: FormGroup;
  employeesList$ = new BehaviorSubject<Employee[]>([]);
  employeesToDelete$ = new BehaviorSubject<number[]>([]);
  employeeToEdit$ = new BehaviorSubject<Employee>(<Employee>{});
  employeeYearsToEdit$ = new BehaviorSubject<Employee>(<Employee>{});

  constructor(private formBuilder: FormBuilder, private dataService: DataService) {
    this.addEmployeeForm = this.formBuilder
      .group({
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        years: ['', [Validators.required]]
      });

  }

  ngOnInit(): void {
    const employeesList = JSON.parse(localStorage.getItem("employeesList")!);
    if (employeesList && employeesList.length > 0) this.employeesList$.next(employeesList);
    else
      this.dataService.getAllUsers()
        .subscribe({
          next: (value: any) => {
            this.employeesList$.next(value);
            localStorage.setItem("employeesList", JSON.stringify(value));
          },
          error: error => console.log(error)
        });
  }

  addEmployee(value: Employee) {
    if (this.employeesList$.value.find((emp: Employee) => emp == value))
      return alert("The employee already exists")
    if (this.employeesList$.value && this.employeesList$.value.length > 0)
      value.id = this.employeesList$.value[this.employeesList$.value.length - 1].id + 1;
    else value.id = 1;
    console.log(value)
    this.employeesList$.next(this.employeesList$.getValue().concat([value]));
    this.addEmployeeForm.reset();
    this.employeesToDelete$.value.splice(0, this.employeesToDelete$.value.length);
  }

  cancel() {
    const employeesList = JSON.parse(localStorage.getItem("employeesList")!);
    this.employeesList$.next(employeesList);
    this.employeesToDelete$.value.splice(0, this.employeesToDelete$.value.length);
    this.hideSideBar();
    this.addEmployeeForm.reset();
  }

  save() {
    //Add
    console.log("this.employeeToEdit$", this.employeeToEdit$.value);
    console.log("this.employeeYearsToEdit$", this.employeeYearsToEdit$.value)


    localStorage.setItem("employeesList", JSON.stringify(this.employeesList$.value));

    //Delete
    if (this.employeesToDelete$.value && this.employeesToDelete$.value.length > 0) {
      const employeesList = JSON.parse(localStorage.getItem("employeesList")!);
      this.employeesToDelete$.value.forEach((empId: number) => {
        if (employeesList && employeesList.length > 0) {
          const empToDelete = employeesList.find((emp: Employee) => emp.id === empId)
          if (empToDelete) {
            const index = employeesList.findIndex((emp: Employee) => emp.id === empToDelete.id);
            employeesList.splice(index, 1);
          }
        }
      });
      this.employeesList$.next(employeesList);
      localStorage.setItem("employeesList", JSON.stringify(employeesList));
      this.employeesToDelete$.value.splice(0, this.employeesToDelete$.value.length);
    }

    //update
    this.updateEmployee(this.employeeToEdit$.value, false);
    this.updateEmployee(this.employeeYearsToEdit$.value, true);
    this.hideSideBar();
  }

  load() {
    this.ngOnInit();
    this.employeesToDelete$.value.splice(0, this.employeesToDelete$.value.length);
    this.hideSideBar();
    this.addEmployeeForm.reset();
  }

  hideSideBar() {
    if (!document.getElementById("side_nav")!.classList.contains("toggle-sidebar"))
      document.getElementById("side_nav")!.classList.add("toggle-sidebar");
    document.querySelector(".clicked")?.classList.remove('clicked');
  }

  updateEmployee(employee: Employee, isYears: boolean) {
    const employeesList = JSON.parse(localStorage.getItem("employeesList")!);
    if (employeesList && employeesList.length > 0) {
      const empToEdit = employeesList.find((emp: Employee) => emp.id === employee.id)
      if (empToEdit) {
        const index = employeesList.findIndex((emp: Employee) => emp.id === empToEdit.id);
        if (!isYears) {
          empToEdit.name = employee.name;
          empToEdit.surname = employee.surname;
        }
        if (isYears) empToEdit.years = employee.years;
        employeesList.splice(index, 1, empToEdit);
      }
    }
    this.employeesList$.next(employeesList);
    localStorage.setItem("employeesList", JSON.stringify(employeesList));
  }

  deleteEmployee(event: any) {
    this.employeesToDelete$.value.push(event);
    console.log(this.employeesToDelete$.value)
  }
}
