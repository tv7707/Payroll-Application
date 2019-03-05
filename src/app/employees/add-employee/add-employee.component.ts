import { Component, OnInit } from '@angular/core';
import { EmployeeData } from '../employeeData.model';
import { NgForm } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})

export class AddEmployeeComponent implements OnInit {
  employeeData: EmployeeData;
  // Storing the mode(Add/Edit)
  private mode = 'create';
  private employeeId: string;

  // Injecting the service and route information.
  constructor(
    public employeeService: EmployeeService,
    public route: ActivatedRoute,
    private router: Router) {}



  /* Edit Employee - Finding if url has id or not.
   * paraMap is used here to listen to changes in routes parameteres.
   * If route has an id we are in edit mode and fetch the employeeData through the it.
   */
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('employeeId')) {
        this.mode = 'edit';
        this.employeeId = paramMap.get('employeeId');
        this.employeeData = this.employeeService.getEmployee(this.employeeId);
      } else {
        this.mode = 'create';
        this.employeeId = null;
      }
    });
  }

  // Saving the form data.
  onSaveEmployee(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const employeeData: EmployeeData = {
      id: null,
      name: form.value.employeeName,
      email: form.value.email,
      basePay: form.value.basePay,
    };

    if (this.mode === 'create') {
      this.employeeService.addEmployeeData(employeeData);
    } else {
      this.employeeService.updateEmployee(
        this.employeeId,
        form.value.employeeName,
        form.value.email,
        form.value.basePay
      );
    }
  }
}
