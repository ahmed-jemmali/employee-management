import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Employee} from "../../models/employee";
import {DataService} from "../../services/data.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  notifier = new Subject<void>();
  @Input() employeeToEdit$ = new BehaviorSubject<Employee>(<Employee>{});
  editEmployeeForm!: FormGroup;
  employee!: Employee;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.editEmployeeForm = this.formBuilder
      .group({
        name: [''],
        surname: ['']
      });
  }

  ngOnInit(): void {
    this.dataService.employee$
      .subscribe(value => {
        this.employee = value;
        this.employeeToEdit$.next(value);
      });

    this.editEmployeeForm.controls["name"].valueChanges
      .pipe(takeUntil(this.notifier))
      .subscribe(() => {
        this.employeeToEdit$.next({
          ...this.employeeToEdit$.value,
          name: this.editEmployeeForm.getRawValue().name,
        });
      });
    this.editEmployeeForm.controls["surname"].valueChanges
      .pipe(takeUntil(this.notifier))
      .subscribe(() => {
        this.employeeToEdit$.next({
          ...this.employeeToEdit$.value,
          surname: this.editEmployeeForm.getRawValue().surname
        });
      });
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }
}
