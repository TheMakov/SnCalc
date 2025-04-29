import {Component, input, Input} from '@angular/core';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {ToggleButton} from 'primeng/togglebutton';
import { NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {PermutationsService} from '../permutations.service';
import {MessageService} from 'primeng/api';


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

  constructor(protected service: PermutationsService, private messageService: MessageService) {
  }
  //default value, so that I know that something went wrong

  @Input({ required: true }) variableId!: number;
  name!: string;
  value!: string;
  tableData!: number [][];

  checked: any = false;
  valid : boolean = true;
  columns:number[] = [];


  private index!: number;

  //TODO: How to know if var is valid or not, cause we now have matrix and values combined and the service doesnt know which mode is selected
  ngOnInit() {
    this.getDataFromService()
  }

  //I don't know if I want to let this in see how it feels during further development, but works as intended
  onFinishedEdit( colIndex: number){
    this.valid = this.service.matrixIsValid(this.variableId);
    if((this.tableData[0][colIndex] == null||this.tableData[0][colIndex] == undefined) && (this.tableData[1][colIndex] == null || this.tableData[1][colIndex] == undefined) &&  colIndex !== this.columns.length-1){
      this.service.removeEmptyColumn(this.variableId, colIndex)
    }
  }

  onInputTable(){
    this.checkMatrixLength()
    if(this.service.matrixIsValid(this.variableId)){
      this.service.updateVariable(this.variableId, this.name, this.value, this.tableData, this.columns);
    }
  }

  onInputValue(){
    if(this.service.valueIsValid(this.value)){
      this.service.updateVariable(this.variableId, this.name, this.value, this.tableData, this.columns)
    }
  }

  OnFocus(){
    this.checkMatrixLength()
  }

  CloseVariable(){
    if(this.service.getVariablesIdList().length > 1){
      this.service.removeVariable(this.variableId)
    }else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Cant remove last remaining variable', key: 'tl', life: 1000 });
    }
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

  public switchMatrixAndCycles(){
    this.usedNumbers = []
    if(this.checked){
      this.service.cyclesToMatrix(this.variableId)
      this.getDataFromService()
    }
    else if(!this.checked){
      this.matrixToCycles()
    }
  }

  public matrixIsValid():boolean{
    return this.service.matrixIsValid(this.variableId)
  }

  //no need to use the service, cause this is formost for the asthetic purpuses
  //if value actualy changes the number of columns will be changed by onInputValue()
  private checkMatrixLength(){
    //save columns length before modifying it
    const columnsCount = this.columns.length

    if((this.tableData[0][columnsCount-1] !== null && this.tableData[0][columnsCount-1] !== undefined) || (this.tableData[1][columnsCount-1] !== null && this.tableData[1][columnsCount-1] !== undefined)){
      this.columns.push(this.columns.length);
    }
    else if((this.tableData[0][columnsCount-2] == null ||this.tableData[0][columnsCount-2] == undefined) && (this.tableData[1][columnsCount-2] == null ||this.tableData[1][columnsCount-2] == undefined)){
      this.columns.pop();
    }
  }


  //I know that this isnt ideal, but I am too lazy to fix it, shouldnt cause any issues, so I dont care
  usedNumbers:number[] = [];
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

  private getDataFromService(){
    this.index = this.service.getVariablesIdList().findIndex(id => id === this.variableId);
    this.name = this.service.getVariablesNameList()[this.index]
    this.value = this.service.getVariablesValueList()[this.index]
    this.tableData = this.service.getVariablesTableList()[this.index]
    this.columns = this.service.getVariablesColumnList()[this.index]
  }


}
