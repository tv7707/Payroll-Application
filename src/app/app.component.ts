import { Component } from "@angular/core";
import { EmployeeData } from "./employees/employeeData.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "datis-project";
  // Array to store emitted data for new employee.
  storedEmployeeData: EmployeeData[] = [];

  // Getting the emitted data and storing it into a array.
  onEmployeeAdded(employeeData) {
    this.storedEmployeeData.push(employeeData);
  }
}
