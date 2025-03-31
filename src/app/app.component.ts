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


@Component({
  selector: 'app-root',
  imports: [ButtonModule, RouterOutlet, FormsModule, FloatLabel, InputText, VariableBoxComponent, NgForOf],
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

  constructor(private permutationsService: PermutationsService) {}

  ngOnInit() {
    this.permutationsService.getVariablesId().subscribe(id => {
      this.variablesIdList = id;
    })
    this.permutationsService.getVariablesName().subscribe(name => {
      this.variableNameList = name;
    })
    this.permutationsService.getVariablesValueList().subscribe(value => {
      this.variableValueList = value;
    })
    this.permutationsService.getVariablesTableList().subscribe(table => {
      this.variableTableList = table;
    })
  }

  toggleSidebar() {
    this.sidebar = !this.sidebar;
  }

  addVariable() {
    this.permutationsService.addVariable()
  }


}
