import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//WICHTIG:
//Der service speichert nur daten die Richtig sind und rechnet mit denen weiter
//sind die Daten falsch und man möchte trzdem berrechnen werden die zuletzt richtigen daten verwendet
export class PermutationsService {
  private variablesIdList: number[] = [0];
  private variablesNameList: string[] = ["test"];
  private variablesValueList: string[] = ['(1,3,2)(7 ,4)(7 ,4)'];
  private variablesTableList: number[][][] = [[
    [1, 2],
    [1, 2]
  ]]
  private variablesColumnList: number[][] = [[0, 0, 0]]
  private variablesCheckedList: boolean[] = [false]
  constructor() {
    for (let j = 0; j < this.variablesIdList.length; j++) {
      for(let _ in this.variablesTableList[j][0]){
        this.variablesColumnList[j].push(0);
      }
      this.variablesColumnList[j].push(0);
    }

  }
  private getIndexToIdInArray(id: number): number{
    return this.variablesIdList.findIndex((i) => i === id);
  }

  public getVariablesIdList(): number[] {
    // Simulating data fetch
    return this.variablesIdList;
  }
  public  getVariablesNameList(): string[] {
    // Simulating data fetch
    return this.variablesNameList;
  }
  public getVariablesValueList(): string[]{
    // Simulating data fetch
    return this.variablesValueList;
  }
  public getVariablesTableList():number[][][] {
    return this.variablesTableList;
  }
  public getVariablesColumnList():number[][]{
    return this.variablesColumnList
  }
  public getVariablesCheckedList():boolean[]{
    return this.variablesCheckedList;
  }



  public removeVariable(id: number) {
    let index = this.getIndexToIdInArray(id);
    this.variablesIdList.splice(index, 1);
    this.variablesNameList.splice(index, 1);
    this.variablesValueList.splice(index, 1);
    this.variablesTableList.splice(index, 1);
    this.variablesColumnList.splice(index, 1);
    this.variablesCheckedList.splice(index, 1);
  }

  //all Id's should be unique, one should be able to look up the variable using said id
  //the Id array doesnt need to be sorted as the order of the id indicates the order in the sidebar
  public addVariable() {
    for (let i = 1; i <= this.variablesIdList.length; i++) {
      if(this.variablesIdList.every((num) => num !== i)) {
        this.variablesIdList.push(i)
        this.variablesNameList.push( "variable "+ String(i));
        this.variablesValueList.push( "(1,2)");
        this.variablesTableList.push([
          [1,2],
          [2,1]
        ])
        this.variablesColumnList.push([0,0,0])
        this.variablesCheckedList.push(false);
        break;
      }
    }
  }

  public updateVariable(id: number, name:string, value: string, tableList: number[][], columnList: number[]) {
    let index = this.getIndexToIdInArray(id);
    this.variablesNameList[index] = name;
    this.variablesValueList[index] = value;
    this.variablesTableList[index] = tableList;
    this.variablesColumnList[index] = columnList;
  }
  public updateVariableChecked(id: number, checked: boolean) {
    let index = this.getIndexToIdInArray(id);
    this.variablesCheckedList[index] = checked;
  }


  matrixIsValid(id: number): boolean {
    let index = this.getIndexToIdInArray(id);
    if((this.hasDuplicates(this.variablesTableList[index][0]) || this.hasDuplicates(this.variablesTableList[index][1])) || this.hasDifferentNumbers(id)){
      return false
    }
    else return true
  }

  private hasDifferentNumbers(id:number):boolean{
    let index: number = this.variablesIdList.findIndex((i) => i === id);
    for(let i = 0; i < this.variablesTableList[index][0].length; i++){
      if(!this.variablesTableList[index][1].includes(this.variablesTableList[index][0][i])){
        return true
      }
    }
    return false
  }

  private hasDuplicates(arr:number[]){
    return new Set(arr).size !== arr.length;
  }

  public removeEmptyColumn(id: number, column: number){
    let index = this.variablesIdList.findIndex((i) => i === id);
    this.variablesTableList[index][1].splice(column,1);
    this.variablesTableList[index][0].splice(column,1);
    this.variablesColumnList[index].pop()
  }

  public cyclesToMatrix(id: number) {
    let varIndex = this.variablesIdList.findIndex((i) => i === id);
    let matrix = this.computeCyclesToMatrix(this.variablesValueList[varIndex]);
    this.variablesTableList[varIndex] = matrix;
    //reset the number of columns and calculate the new correct amount
    this.variablesColumnList[varIndex] = []
    for(let _ of matrix[0]){
      this.variablesColumnList[varIndex].push(0);
    }
  }

  public computeCyclesToMatrix(value:string):number[][] {
    let matrix = [
      [1, 2],
      [1, 2]
    ]
    let regExp = value.match(/\(([^)]+)\)/g); // Extracts "(1,2,3)" parts
    let groups:string[] = []
    if(regExp){
      groups = Array.from(regExp);
    }
    else {
      console.error("couldnt compute Cycles to Matrix");
      return matrix;
    }

    //clear all preexisting data
    matrix = [
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
        if(matrix[0].includes(number)){
          let index = numbersToAdd.findIndex((num: any)  => num === number);
          numbersToAdd.splice(index, 1);
        }
      }
      matrix[0].push(...numbersToAdd);
      matrix[1].push(...numbersToAdd);
    }

    //FUCK TS OR ANGULAR AND HOW THEY HANDLE REFERENCES IT TOOK ME FOREVER TO CHECK IF THE VALUES ARE SORTED AS THEY SHOULD
    matrix.forEach(row => row.sort((a, b) => a - b));

    for(let i = groups.length-1; i>=0; i--){
      const numbers = groups[i].replace(/[()]/g, "").split(",").map(Number);
      let arrayCopy = [...matrix[1]]
      for(let j = 0 ; j < numbers.length; j++){
        let index: number = arrayCopy.findIndex(number => number === numbers[j]);
        if(j === numbers.length-1){
         matrix[1][index] = numbers[0];
        }
        else {
          matrix[1][index] = numbers[j+1];
        }
      }
    }
    //cleanup of unnecessary data
    let tableCopy = [...matrix[0]];
    for(let number of tableCopy){
      let index = matrix[0].findIndex(num => num == number)
      if(matrix[0][index] === matrix[1][index]){
        matrix[1].splice(index, 1);
        matrix[0].splice(index, 1);
      }
    }
    return matrix;

  }

  valueIsValid( value: string): boolean{
    const pattern = /^\s*\(\s*\d+(?:\s*,\s*\d+)*\s*\)(?:\s*\(\s*\d+(?:\s*,\s*\d+)*\s*\))*\s*$/;
    if (!pattern.test(value))return false;

    const groups = value.match(/\(([^)]+)\)/g); // Extracts "(1,2,3)" parts

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

  //isnt the ideal solution but seems to work
  usedNumbers:number[] = [];
  public matrixToCycles(id: number) {
    let index = this.getIndexToIdInArray(id)
    let table = this.variablesTableList[index]
    let cycle = this.computeMatrixToCycles(table);
    this.variablesValueList[index] = cycle
  }

  public computeMatrixToCycles(table:number[][]):string {
    this.usedNumbers = []
    ;
    //I dont like doing this, but when a value is removed, the empty space might still be read as null in the array => remove all nulls from the array
    table[0] = table[0].filter(item => item !== null);
    table[1] = table[1].filter(item => item !== null);
    const length = table[0].length;
    let j = 0;
    let cycles:string [] = [];
    while(j < length){
      cycles.push(this.addCycle(j, table))
      //find the next number that is not inside a cycle
      while(this.usedNumbers.find(x => x == table[0][j]) ){
        j++;
      }
    }

    let out = '';
    for(let i = 0; i < cycles.length; i++){
      out += cycles[i];
    }
    return out
  }

  private addCycle(j : number, table: number[][]){
    let cycleString:string =``
    // find when the first cycle starts
    while(j<table[0].length){
      if(table[0][j] !== table[1][j]){
        cycleString += table[0][j]
        cycleString += ','
        cycleString += table[1][j]
        this.usedNumbers.push(table[0][j])
        this.usedNumbers.push(table[1][j])
        break;
      }
      else{
        this.usedNumbers.push(table[0][j])
        j++;
      }
    }

    //add values to the cycle till the first repetition, indicating the cycle to end
    while(true){
      if(this.usedNumbers.length == 0){
        return '()'
      }
      let relevantIndex = table[0].findIndex(x => x == (this.usedNumbers)[this.usedNumbers.length - 1]);
      //value redirects to already used number => we abort
      if(this.usedNumbers.find(x => x == table[1][relevantIndex])){
        if(cycleString == ''){
          return '';
        }else return '('+cycleString+')'
      }
      // we haven't seen the number in the cycle yet => add it to the cycle
      else {
        cycleString += ','
        cycleString += table[1][relevantIndex]
        this.usedNumbers.push(table[1][relevantIndex])
      }
    }
  }

  public CheckProblemSyntax(problem: string){
    const pattern = /^(\(\s*\d+\s*(?:,\s*\d+\s*)+\)|var\(\s*[a-zA-Z]+\s*\))(?:\s*(\(\s*\d+\s*(?:,\s*\d+\s*)+\)|var\(\s*[a-zA-Z]+\s*\)))*$/;
    return pattern.test(problem);
  }
  public ReplaceVariables(problem: string):string{
    const varRegex = /var\(\s*([a-zA-Z]+)\s*\)/g;
    const output = problem.replace(varRegex, (match, varName) => {
      let id = this.variablesNameList.findIndex((name) => name === varName)

      if( this.variablesCheckedList[id]){
        //update the variable value that it matches the Matrix value
        this.matrixToCycles(id)
        return this.variablesValueList[id] ?? `undefined`;
      }
      else{
        return this.variablesValueList[id] ?? `undefined`;
      }
    });

    return output
  }
}


