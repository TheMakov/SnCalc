import {Component, input, Input} from '@angular/core';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {ToggleButton} from 'primeng/togglebutton';
import { NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {PermutationsService} from '../permutations.service';


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

  constructor(private permutationsService: PermutationsService) {
  }
  //default value, so that I know that something went wrong

  @Input({ required: true }) variableId!: number;
  @Input({ required: true }) name!: string;
  @Input({ required: true }) value!: string;
  @Input({ required: true }) tableData!: number [][];


  checked: any = false;
  valid : boolean = true;
  columns:number[] = [];

  ngAfterViewInit(){
    for(let i in this.tableData[0]){
      this.columns.push(0);
    }
    this.columns.push(0);
  }

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

  CloseVariable(){

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

  private hasDifferentNumbers():boolean{
    for(let i = 0; i < this.tableData[0].length; i++){
      if(!this.tableData[1].includes(this.tableData[0][i])){
        return true
      }
    }
    return false
  }

  private hasDuplicates(arr:number[]){
    return new Set(arr).size !== arr.length;
  }

  private removeColumn(columnIndex:number){
    this.tableData[1].splice(columnIndex,1);
    this.tableData[0].splice(columnIndex,1);
  }

  //I know that this isnt ideal, but I am too lazy to fix it, shouldnt cause any issues, so I dont care
  usedNumbers:number[] = [];

  switchMatrixAndCycles(){
    this.usedNumbers = []
    if(this.checked){
      this.cyclesToMatrix()
      //this.checked = !this.checked;
    }
    else if(!this.checked){
      this.matrixToCycles()
      //this.checked = !this.checked;
    }
  }

  private cyclesToMatrix() {
    let regExp = this.value.match(/\(([^)]+)\)/g); // Extracts "(1,2,3)" parts
    let groups:string[] = []
    if(regExp){
      groups = Array.from(regExp);
    }
    else {
      this.tableData = [
        [1, 2],
        [1, 2]
      ];
    }

    //if groups are empty then set to default


    //clear all preexisting data
    this.tableData = [
      [],
      []
    ];
    //add all used values to the first row
    for (const group of groups) {
      //extract new data
      const numbers = group.replace(/[()]/g, "").split(",").map(Number);
      let numbersToAdd = [...numbers]
      //add new data at the end
      for(let number of numbers){
        if(this.tableData[0].includes(number)){
          let index = numbersToAdd.findIndex((num: any)  => num === number);
          numbersToAdd.splice(index, 1);
        }
      }
      this.tableData[0].push(...numbersToAdd);
      this.tableData[1].push(...numbersToAdd);
    }

    //FUCK TS OR ANGULAR AND HOW THEY HANDLE REFERENCES IT TOOK ME FOREVER TO CHECK IF THE VALUES ARE SORTED AS THEY SHOULD
    this.tableData.forEach(row => row.sort((a, b) => a - b));

    for(let i = groups.length-1; i>=0; i--){
     const numbers = groups[i].replace(/[()]/g, "").split(",").map(Number);
     let arrayCopy = [...this.tableData[1]]
     for(let j = 0 ; j < numbers.length; j++){
       let index: number = arrayCopy.findIndex(number => number === numbers[j]);
       if(j === numbers.length-1){
         this.tableData[1][index] = numbers[0];
       }
       else {
         this.tableData[1][index] = numbers[j+1];
       }
     }
    }
    //cleanup of unnecessary data
    let tableCopy = [...this.tableData[0]];
    for(let number of tableCopy){
      let index = this.tableData[0].findIndex(num => num == number)
      if(this.tableData[0][index] === this.tableData[1][index]){
        this.tableData[1].splice(index, 1);
        this.tableData[0].splice(index, 1);
      }
    }
    //reset the number of columns and calculate the new correct amount
    this.columns = []
    let i = 0
    for(let number of this.tableData[0]){
      this.columns.push(i);
      i++;
    }

  }

  valueIsCorrect(): boolean{
    const pattern = /^\s*\(\s*\d+(?:\s*,\s*\d+)*\s*\)(?:\s*\(\s*\d+(?:\s*,\s*\d+)*\s*\))*\s*$/;
    if (!pattern.test(this.value))return false;

    const groups = this.value.match(/\(([^)]+)\)/g); // Extracts "(1,2,3)" parts

    if (!groups) return false;

    for (const group of groups) {
      const numbers = group.replace(/[()]/g, "").split(",").map(Number); // Extract numbers
      if(numbers.length == 1) return false;
      const uniqueNumbers = new Set(numbers); // Convert to Set to check uniqueness

      if (uniqueNumbers.size !== numbers.length) {
        return false; // Found duplicates inside a parenthesis
      }
    }

    return true;
  }


  private matrixToCycles(){
    //I dont like doing this, but when a value is removed, the empty space might still be read as null in the array => remove all nulls from the array
    this.tableData[0] = this.tableData[0].filter(item => item !== null);
    this.tableData[1] = this.tableData[1].filter(item => item !== null);
    const length = this.tableData[0].length;
    let j = 0;
    let cycles:string [] = [];
    while(j < length){
      cycles.push(this.addCycle(j))
      //find the next number that is not inside a cycle
      while(this.usedNumbers.find(x => x == this.tableData[0][j]) ){
        j++;
      }
    }

    let out = '';
    for(let i = 0; i < cycles.length; i++){
      out += cycles[i];
    }
    this.value = out
  }

  private addCycle(j : number){
    let cycleString:string =``
    // find when the first cycle starts
    while(j<this.tableData[0].length){
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
        if(cycleString == ''){
          return '';
        }else return '('+cycleString+')'
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
