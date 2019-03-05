import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EmployeeData } from '../employeeData.model';
import { FormBuilder, FormGroup, NgForm, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit {
  private employeeId: string;
  employeeData: EmployeeData;
  employeeSalaryData = {};
  private empSalaryData: Subscription;
  grosspay = 0;
  totalDeduction = 0;

  displayedColumns: string[] = ['basePay', 'deductionType', 'amount', 'netPay'];
  dataSource = [];

  salaryForm: FormGroup;

  // Injecting the service and route information.
  constructor(
    public empService: EmployeeService,
    public route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}


  onAddDeductions() {
    (<FormArray>this.salaryForm.get('deductions')).push(
      new FormGroup({
        'type'   : new FormControl(null, Validators.required),
        'amount' : new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
    })
    );
  }

 onDeleteDeductions(index: number) {
  (<FormArray>this.salaryForm.get('deductions')).removeAt(index);
}


  /* Edit Employee - Finding if url has id or not.
   * paraMap is used here to listen to changes in routes parameteres.
   * If route has an id we are in edit mode and fetch the employeeData through the it.
   */

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('employeeId')) {
        this.employeeId = paramMap.get('employeeId');
        this.employeeData = this.empService.getEmployee(this.employeeId);
        // Get salary.
        console.log(this.employeeData);
        this.empService.getSalaryData(this.employeeId);
        this.empSalaryData = this.empService
          .getUpdatedSalaryDataListener()
          .subscribe(data => {
            //console.log(data);
            this.employeeSalaryData = data;
            //this.dataSource = data;
            this.grosspay = this.onCalculateNetPay(data);
            this.totalDeduction = this.onCalculateDeduction(data);
          });
          this.initForm();
      }
    });
  }

  private initForm() {
    this.salaryForm = new FormGroup({
      'deductions' : new FormArray([
        new FormGroup({
          'type'   : new FormControl(null, Validators.required),
          'amount' : new FormControl(null, [
            Validators.required,
            Validators.pattern(/^[1-9]+[0-9]*$/)
          ])
        })
      ])
    });
  }

 // Getting the controls of deductions.
 getControl() {
  return (<FormArray>this.salaryForm.get('deductions')).controls;
}

  onCalculateNetPay(employeeSalaryData) {
    let totalDeductionAmount = 0;
    for (let i = 0; i < employeeSalaryData.length; i++) {
      totalDeductionAmount += +employeeSalaryData[i].deductionAmount;
      //console.log(totalDeductionAmount); //use i instead of 0
    }
    let baseSalary = this.employeeData.basePay;
    let netSalary = +baseSalary - totalDeductionAmount;
    //console.log(baseSalary);
    return netSalary;
  }

  onCalculateDeduction(employeeSalaryData) {
    let totalDeductionAmount = 0;
    for (let i = 0; i < employeeSalaryData.length; i++) {
      totalDeductionAmount += +employeeSalaryData[i].deductionAmount;
      //console.log(totalDeductionAmount); //use i instead of 0
    }
    return totalDeductionAmount;
  }

  onSaveSalary() {
    const salaryData = this.salaryForm.value;
    for (let i = 0; i < salaryData.deductions.length; i++) {
      // use i as an array index
      let type = salaryData.deductions[i].type;
      let amount = salaryData.deductions[i].amount;
      this.empService.addSalaryData(this.employeeId, type, amount);
    }

    // this.empService.updateEmployee(
    //   this.employeeId,
    //   this.employeeData.name,
    //   this.employeeData.basePay,
    //   this.employeeData.deductions,
    //   this.employeeData.netPay
    // );

   // this.router.navigateByUrl('');
  }
}
