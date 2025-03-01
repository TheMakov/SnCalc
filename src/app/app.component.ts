import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {NgIf} from '@angular/common';
import {VariableBoxComponent} from './variable-box/variable-box.component';


@Component({
  selector: 'app-root',
  imports: [ButtonModule, RouterOutlet, FormsModule, FloatLabel, InputText, VariableBoxComponent],
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

  toggleSidebar() {
    this.sidebar = !this.sidebar;
  }
}
