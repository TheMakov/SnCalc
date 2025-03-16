import {Component} from '@angular/core';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {ToggleButton} from 'primeng/togglebutton';
import {NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {min} from 'rxjs';


@Component({
  selector: 'variable-box',
  imports: [
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    FormsModule,
    ToggleButton,
    Button,
    NgIf,
    TableModule,
    NgForOf,
  ],
  templateUrl: './variable-box.component.html',
  styleUrl: './variable-box.component.css'
})
export class VariableBoxComponent {
  name: any;
  value: any;
  checked: any = true;
  valid : boolean = true;

  columns = [0];  // Starts with 1 column
  tableData: number [][] = [
    [1],  // First row
    [1]   // Second row
  ];
  defaultValue = 0; // Default number to fill empty slots


  onFinishedEdit(rowIndex: number, colIndex: number){
    this.valid = this.matrixIsValid();
    if(this.tableData[0][colIndex] == null && this.tableData[1][colIndex] == null){
     // this.removeColumn(colIndex);
    }
  }

  checkMatrixLength(){
    //save columns length before modifying it
    const columnsCount = this.columns.length


    if((this.tableData[0][columnsCount-1] !== null && this.tableData[0][columnsCount-1] !== undefined) || (this.tableData[1][columnsCount-1] !== null && this.tableData[1][columnsCount-1] !== undefined)){
      this.columns.push(this.columns.length);
    }
    else if((this.tableData[0][columnsCount-2] == null ||this.tableData[0][columnsCount-2] == undefined) && (this.tableData[1][columnsCount-2] == null ||this.tableData[1][columnsCount-2] == undefined)){
      this.columns.pop();
    }

    console.log((this.tableData[0][this.columns.length-1] !== null && this.tableData[0][this.columns.length-1] !== undefined));
    console.log((this.tableData[0][this.columns.length-1]))
    console.log(this.tableData)
  }

  onInput(){
    this.checkMatrixLength()
  }



  OnFocus(){
    this.checkMatrixLength()
  }

  OnKeyEvent(event:KeyboardEvent, rowIndex:number, colIndex: number ){
    const table = document.querySelector("p-table"); // Get the table element
    const inputs = table?.querySelectorAll("input");


    if (!inputs) return
    let nextIndex = -1;

    if(event.key == "ArrowRight" || event.key == "D"){
      nextIndex = colIndex + 1; // Move right
    }
    else if(event.key == "ArrowLeft" || event.key == "A"){
      nextIndex = colIndex - 1;
    }

    if (nextIndex >= 0 && nextIndex < inputs.length) {
      event.preventDefault(); // Prevent cursor movement
      (inputs[nextIndex] as HTMLElement).focus(); // Move focus
    }
  }

  addColumn(){

  }

  matrixIsValid(): boolean {
    return !(this.hasDuplicates(this.tableData[0]) || this.hasDuplicates(this.tableData[1]));
  }

  hasDuplicates(arr:number[]){
    return new Set(arr).size !== arr.length;
  }

  removeColumn(columnIndex:number){
    this.tableData[1].splice(columnIndex,1);
    this.tableData[0].splice(columnIndex,1);
  }

  protected readonly onblur = onblur;
}
