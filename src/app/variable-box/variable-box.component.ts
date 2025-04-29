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
    if(this.checked){
      this.service.cyclesToMatrix(this.variableId)
    }
    else if(!this.checked){
      this.service.matrixToCycles(this.variableId)
    }
    //refresh the data that is we have stored here
    this.getDataFromService()
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


  private getDataFromService(){
    this.index = this.service.getVariablesIdList().findIndex(id => id === this.variableId);
    this.name = this.service.getVariablesNameList()[this.index]
    this.value = this.service.getVariablesValueList()[this.index]
    this.tableData = this.service.getVariablesTableList()[this.index]
    this.columns = this.service.getVariablesColumnList()[this.index]
  }


}
