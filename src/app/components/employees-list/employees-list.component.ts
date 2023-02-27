import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {Employee} from "../../models/employee";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css'],
})
export class EmployeesListComponent implements OnInit, OnDestroy {
  notifier = new Subject<void>();
  @Input() employee!: Employee;
  @Input() employeeYearsToEdit$ = new BehaviorSubject<Employee>(<Employee>{});
  @Output() onselect = new EventEmitter<number>();
  readonly editEmployeeForm: FormGroup;
  employeeToEdit!: Employee;

  constructor(private formBuilder: FormBuilder) {
    this.editEmployeeForm = this.formBuilder.group({years: ['']});
  }

  ngOnInit(): void {
    this.editEmployeeForm.patchValue(this.employee, {emitEvent: false, onlySelf: true});
    this.editEmployeeForm.controls["years"].valueChanges
      .pipe(takeUntil(this.notifier))
      .subscribe(() => {
        this.employeeYearsToEdit$.next({
          ...this.employeeToEdit,
          years: this.editEmployeeForm.getRawValue().years,
        });
      });
  }

  deleteEmployee(id: number) {
    let employee: HTMLElement = document.getElementById(String(id))!;
    employee.remove();
  }

  getEmployeeToEdit(employee: Employee) {
    this.employeeToEdit = employee;
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }
}
