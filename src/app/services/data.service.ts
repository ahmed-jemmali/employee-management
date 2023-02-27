import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Employee} from "../models/employee";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  backendUrl: string = "./assets/users.json";
  employee$ = new BehaviorSubject<Employee>(<Employee>{});

  constructor(private httpClient: HttpClient) {
  }

  getAllUsers() {
    return this.httpClient.get(this.backendUrl);
  }
}
