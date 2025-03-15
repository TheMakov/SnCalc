import {Component} from '@angular/core';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {ToggleButton} from 'primeng/togglebutton';
import {NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';


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
      this.removeColumn(colIndex);
    }
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
