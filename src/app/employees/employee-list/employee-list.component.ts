import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmployeeData } from '../employeeData.model';
import { EmployeeService } from '../employee.service';
import {DataSource} from '@angular/cdk/collections';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  // Listening to emitted data.
  employeeData: EmployeeData[] = [];
  private empData: Subscription;
  displayedColumns: string[] = ['name', 'email', 'basePay', 'id'];
  dataSource = [];
  // Injecting service.
  constructor(public employeeService: EmployeeService) {}

  ngOnInit() {
    this.employeeService.getEmployeeData();
    this.empData = this.employeeService.getUpdatedDataListener()
      .subscribe((employeeData: EmployeeData[]) => {
        this.employeeData = employeeData;
        this.dataSource = employeeData;
        //console.log(this.employeeData);
      });
  }

  // User wants to delete employee.
  onDelete(employeeId: string) {
    this.employeeService.deleteEmployeeData(employeeId);
  }

  // Unsubscribing the subscription on service to prevent memory leaks.
  ngOnDestroy() {
    this.empData.unsubscribe();
  }

}
