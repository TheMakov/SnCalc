import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermutationsService {
  public variablesIdList: number[] = [0];
  public variablesNameList: string[] = ["test"];
  public variablesValueList: string[] = ['(1,3,2)(7 ,4)(7 ,4)'];
  public variablesTableList: number[][][] = [[
    [1, 2],
    [1, 2]
  ]]
  constructor() { }

  getVariablesId(): Observable<number[]> {
    // Simulating data fetch
    return of(this.variablesIdList);
  }
  getVariablesName(): Observable<string[]> {
    // Simulating data fetch
    return of(this.variablesNameList);
  }
  getVariablesValueList(): Observable<string[]> {
    // Simulating data fetch
    return of(this.variablesValueList);
  }
  getVariablesTableList():Observable<number[][][]> {
    return of(this.variablesTableList);
  }

  //TODO: still some issues correctly adding and removing variables, but kinda works
  public removeVariable(id: number) {
    this.variablesIdList.splice(id, 1);
    this.variablesNameList.splice(id, 1);
    this.variablesValueList.splice(id, 1);
    this.variablesTableList.splice(id, 1);
    console.log(id);
    console.log(this.variablesIdList);
    console.log(this.variablesNameList);
    console.log(this.variablesValueList);
    console.log(this.variablesTableList);

  }


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
        break;
      }
    }

  }
}
