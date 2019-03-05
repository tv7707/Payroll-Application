import { Injectable } from '@angular/core';
import { EmployeeData } from './employeeData.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { SalaryData } from './employeeSalary.model';

const BACKEND_URl = environment.apiUrl + '/employees/';
const BACKEND_URl_2 = environment.apiUrl + '/employee/salary/';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // Storing Employee's Data and salary information.
  private employeeData: EmployeeData[] = [];
  private salaryData = [];
  // Creating subject an event emitter.
  private updatedEmployeeData = new Subject<EmployeeData[]>();
  private updatedSalaryData = new Subject();
  // Injecting HttpClient.
  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) {}


  // Get all the employees present.
  getEmployeeData() {
    // Using get method of httpclient to listen the response.
    this.httpClient.get<{ message: string; employeesData: any }>(
        BACKEND_URl
      ).pipe(
        map((data => {
          return data.employeesData.map((employeeData) => {
            return {
              id: employeeData._id,
              name: employeeData.name,
              email: employeeData.email,
              basePay: employeeData.basePay
            };
          });
        }))
      )
      .subscribe(empData => {
        this.employeeData = empData;
        // Emit the data.
        this.updatedEmployeeData.next(this.employeeData.slice());
      });
  }

  // Get salary of the employee.
  getSalaryData(empId: string) {
    // Using get method of httpclient to listen the response.
    this.httpClient
      .get<{ message: string; salaryData }>(
        BACKEND_URl_2 + empId
      )
      .subscribe(employeeSalary => {
        this.salaryData = employeeSalary.salaryData;
        //console.log(this.salaryData);
        // Emit the data.
        this.updatedSalaryData.next(this.salaryData.slice());
      });
  }

  // Add new employee data to the list.
  addSalaryData(id, deductionType, deductionAmount) {
    const deductions = {
      id: id,
      type: deductionType,
      amount: deductionAmount
    }
    this.httpClient
      .post(BACKEND_URl_2, deductions)
      .subscribe(responseValue => {
        console.log('Data added successfully.', responseValue);
      });
    //this.salaryData.push(empSalaryData);
    // Emitting the copy of new employee data.
    //this.updatedSalaryData.next(this.salaryData.slice());
  }

  // Get the employee from the employeeData array and if the id matches return the copy of object.
  getEmployee(id: string) {
    return { ...this.employeeData.find(emp => emp.id === id) };
  }

  // view employee.
  getEmployeeSalary(id: string) {
    return { ...this.salaryData.find(emp => emp._id === id) };
  }

  // Method to listen to the data emitted by the subject whenever a new employee is added.
  getUpdatedDataListener() {
    return this.updatedEmployeeData.asObservable();
  }

  // Method to listen to the data emitted by the subject whenever a new employee is added.
  getUpdatedSalaryDataListener() {
    return this.updatedSalaryData.asObservable();
  }

  // Add new employee data to the list.
  addEmployeeData(empData: EmployeeData) {
    this.httpClient.post(BACKEND_URl, empData)
      .subscribe(responseValue => {
        this.router.navigate(['/']);
    });
  }

  updateEmployee(id: string, name: string, email: string, basePay: number) {
    const eData: EmployeeData = {
      id: id,
      name: name,
      email: email,
      basePay: basePay,
    };
    this.httpClient.put(BACKEND_URl + id, eData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  // Delete Employee from the database and update the employeeData list.
  deleteEmployeeData(empId: string) {
    this.httpClient
      .delete(BACKEND_URl + empId)
      .subscribe(() => {
        const updatedList = this.employeeData.filter(
          edata => edata.id !== empId
        );
        this.employeeData = updatedList;
        // Emitting the copy of new employee data after deletion.
        this.updatedEmployeeData.next(this.employeeData.slice());
      });
  }
}
