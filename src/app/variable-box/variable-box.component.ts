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

  columns = [0,1 ];  // Starts with 1 column
  tableData: number [][] = [
    [1, 2],  // First row
    [1, 2]   // Second row
  ];

  //I don't know if I want to let this in see how it feels during further development, but works as intended
  onFinishedEdit(rowIndex: number, colIndex: number){
    this.valid = this.matrixIsValid();
    if((this.tableData[0][colIndex] == null||this.tableData[0][colIndex] == undefined) && (this.tableData[1][colIndex] == null || this.tableData[1][colIndex] == undefined) &&  colIndex !== this.columns.length-1){
      this.removeColumn(colIndex);
      this.columns.pop()
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


  matrixIsValid(): boolean {
    if((this.hasDuplicates(this.tableData[0]) || this.hasDuplicates(this.tableData[1])) || this.hasDifferentNumbers()){
      return false
    }
    else return true
  }

  hasDifferentNumbers():boolean{
    for(let i = 0; i < this.tableData[0].length; i++){
      if(!this.tableData[1].includes(this.tableData[0][i])){
        return true
      }
    }
    return false
  }

  hasDuplicates(arr:number[]){
    return new Set(arr).size !== arr.length;
  }

  removeColumn(columnIndex:number){
    this.tableData[1].splice(columnIndex,1);
    this.tableData[0].splice(columnIndex,1);
  }

  usedNumbers:number[] = [];


  convertMatrixToCycles(){
    if(!this.checked){
      const length = this.tableData[0].length;
      let j = 0;
      let cycles:string [] = [];
      while(j < length){
        cycles.push(this.addCycle(j))
        //find the next number that is not inside a cycle
        while(this.usedNumbers.find(x => x == this.tableData[0][j])){
          j++;
          console.log("sugoma " + j)
        }
      }

      let out = '';
      for(let i = 0; i < cycles.length; i++){
        out += cycles[i];
      }
      console.log(out);

    }
  }

  //TODO: make this shit work for multiple cycles

  addCycle(j : number){
    let cycleString:string =``

    // find when the first cycle starts
    while(j<this.tableData.length){
      console.log("ligma" + j)
      if(this.tableData[0][j] !== this.tableData[1][j]){
        cycleString += this.tableData[0][j]
        cycleString += ','
        cycleString += this.tableData[1][j]
        this.usedNumbers.push(this.tableData[0][j])
        this.usedNumbers.push(this.tableData[1][j])
        break;
      }
      else{
        this.usedNumbers.push(this.tableData[0][j])
        j++;
      }
    }

    //add values to the cycle till the first repetition, indicating the cycle to end
    while(true){
      if(this.usedNumbers.length == 0){
        return '()'
      }
      let relevantIndex = this.tableData[0].findIndex(x => x == (this.usedNumbers)[this.usedNumbers.length - 1]);
      //value redirects to already used number => we abort
      if(this.usedNumbers.find(x => x == this.tableData[1][relevantIndex])){
        return '('+cycleString+')'
      }
      // we haven't seen the number in the cycle yet => add it to the cycle
      else {
        cycleString += ','
        cycleString += this.tableData[1][relevantIndex]
        this.usedNumbers.push(this.tableData[1][relevantIndex])
      }
    }
  }
}
