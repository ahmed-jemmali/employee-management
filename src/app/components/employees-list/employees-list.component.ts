import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {Employee} from "../../models/employee";
import {DataService} from "../../services/data.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css'],
})
export class EmployeesListComponent implements OnInit, OnDestroy {
  notifier = new Subject<void>();
  @Input() employeesList$ = new BehaviorSubject<Employee[]>([]);
  @Input() employeeYearsToEdit$ = new BehaviorSubject<Employee>(<Employee>{});
  @Output() onselect = new EventEmitter<number>();
  readonly editEmployeeForm: FormGroup;
  employee!: Employee;

  constructor(public dataService: DataService, private formBuilder: FormBuilder) {
    this.editEmployeeForm = this.formBuilder.group({years: null});
  }

  ngOnInit(): void {
    this.editEmployeeForm.controls["years"].valueChanges
      .pipe(takeUntil(this.notifier))
      .subscribe(() => {
        this.employeeYearsToEdit$.next({
          ...this.employee,
          years: this.editEmployeeForm.getRawValue().years,
        });
      });
  }

  delete(id: number) {
    let employee: HTMLElement = document.getElementById(String(id))!;
    employee.remove();

  }

  showSideBar(employee: Employee, event: any) {
    if (event.target && !event.target.classList.contains('delete-btn') && !event.target.classList.contains('fa-trash') && !(event.target.id == 'years')) {
      this.dataService.employee$.next(employee);
      if (document.getElementById("side_nav")!.classList.contains("toggle-sidebar"))
        document.getElementById("side_nav")!.classList.remove("toggle-sidebar");
    }
    document.querySelector(".clicked")?.classList.remove('clicked');
    document.getElementById(String(employee.id))?.classList.add('clicked');
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  getEmployee(employee: Employee) {
    this.employee = employee;
  }

  drop(event: CdkDragDrop<BehaviorSubject<Employee[]>, any>) {
    moveItemInArray(this.employeesList$.value, event.previousIndex, event.currentIndex)
  }
}
