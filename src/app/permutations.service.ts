import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermutationsService {
  public variablesIdList: number[] = [1];
  public variablesNameList: string[] = ["test"];
  public variablesValueList: string[] = ['(1,2,3)(7 ,4)(7 ,4)'];
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
}
