import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {NgForOf, NgIf} from '@angular/common';
import {VariableBoxComponent} from './variable-box/variable-box.component';
import {PermutationsService} from './permutations.service';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-root',

  imports: [ButtonModule, RouterOutlet, FormsModule, FloatLabel, InputText, VariableBoxComponent, NgForOf, Toast],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

  animations: [
    trigger('toggle_sidebar', [
      state('open', style({ marginLeft: '-2vw' })),
      state('closed', style({ marginLeft: '-40vw' })),

      transition('open <=> closed', [
        animate('500ms ease-in-out')
      ])
    ])
  ]
})
export class AppComponent {
  title = 'sn-calc';
  value: any;
  sidebar = true;
  variablesIdList: number[] = [];
  variableNameList: string[] = [];
  variableValueList: string[] = [];
  variableTableList: number[][][] = [];
  variableColumnList: number[][] = [];

  constructor(private permutationsService: PermutationsService, private messageService: MessageService) {}

  ngOnInit() {
    this.getDataFromService()
  }

  toggleSidebar() {
    this.sidebar = !this.sidebar;
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


  protected readonly Array = Array;
}
