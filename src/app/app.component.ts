import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {VariableBoxComponent} from './variable-box/variable-box.component';
import {PermutationsService} from './permutations.service';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {DragDropModule} from 'primeng/dragdrop';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {TableModule} from 'primeng/table';


@Component({
  selector: 'app-root',

  imports: [DragDropModule, ButtonModule, RouterOutlet, FormsModule, FloatLabel, InputText, VariableBoxComponent, NgForOf, Toast, ScrollPanelModule, TableModule, NgIf, NgOptimizedImage],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

  animations: [
    trigger('toggle_sidebar', [
      state('open', style({ marginLeft: '-0em' })),
      state('closed', style({ marginLeft: '-47em' })),

      transition('open <=> closed', [
        animate('500ms ease-in-out')
      ])
    ]),

    trigger('move_input', [
      state('open', style({ marginRight: '3em' })),
      state('closed', style({ marginRight: '17em' })),

      transition('open <=> closed', [
        animate('500ms ease-in-out')
      ])
    ]),
      trigger('move_toggle', [
        state('open', style({ marginRight: '-3em' })),
        state('closed', style({ marginRight: '-18em' })),

        transition('open <=> closed', [
          animate('500ms ease-in-out')
        ])
      ]),
    trigger('solve_open', [
      state('open', style({ marginTop: '3em' })),
      state('closed', style({ marginTop: '10em' })),

      transition('open <=> closed', [
        animate('350ms ease-in-out')
      ])
    ]),
    trigger('solve_open_2', [
      state('open', style({ marginTop: '3em' })),
      state('closed', style({ marginTop: '7em' })),

      transition('open <=> closed', [
        animate('500ms ease-in-out')
      ])
    ])
  ]
})
export class AppComponent {
  currentYear: number = new Date().getFullYear();

  title = 'sn-calc';
  problem: any;
  sidebar = true;
  variablesIdList: number[] = [];
  variableNameList: string[] = [];
  variableValueList: string[] = [];
  variableTableList: number[][][] = [];
  variableColumnList: number[][] = [];
  isSolved:boolean = false;
  solutionMatrix: number[][] = [
    [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  ]
  solutionCycle:string = "(1,2,3)(1,7)"
  syntaxIsCorrect:boolean = true;

  constructor(private permutationsService: PermutationsService, private messageService: MessageService) {}

  ngOnInit() {
    this.getDataFromService()
  }

  toggleSidebar() {
    this.sidebar = !this.sidebar;
    console.log(this.sidebar);
  }

  addVariable() {
    this.permutationsService.addVariable()
  }


  //TODO: What's the point of this exactly ? its only used at initiation or ?
  private getDataFromService(){
    this.variablesIdList = this.permutationsService.getVariablesIdList()
    this.variableNameList = this.permutationsService.getVariablesNameList()
    this.variableValueList = this.permutationsService.getVariablesValueList()
    this.variableTableList = this.permutationsService.getVariablesTableList()
    this.variableColumnList = this.permutationsService.getVariablesColumnList()
  }

  public getIdList(): number[]{
    return this.permutationsService.getVariablesIdList()
  }

  protected Solve(){
    if(this.permutationsService.CheckProblemSyntax(this.problem)){
      this.syntaxIsCorrect = true;
      let newProblem = this.permutationsService.ReplaceVariables(this.problem)
      if(newProblem == 'undefined'){
        this.syntaxIsCorrect = false;
        return;
      }
      let resultMatrix = this.permutationsService.computeCyclesToMatrix(newProblem)
      this.solutionCycle  = this.permutationsService.computeMatrixToCycles(resultMatrix)
      this.solutionMatrix = resultMatrix
      if(this.solutionCycle == ""){this.solutionCycle = "id"; this.solutionMatrix = [[1,2],[1,2]]}
      this.isSolved = true;
    }
    else{
      this.syntaxIsCorrect = false
    }
  }

  protected closeSolution(){
    this.isSolved = false;
    this.syntaxIsCorrect = true;
  }

}
