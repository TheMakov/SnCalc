import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {InputText, InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [ButtonModule, RouterOutlet, FormsModule, FloatLabel, InputText, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

  animations: [
    trigger('toggle_sidebar', [
      transition(':leave', [  // When the element appears
        animate('500ms ease-in-out', style({ marginLeft: '-24.5vw' }))
      ]),
      transition(':enter', [  // When the element disappears
        style({  marginLeft: '-25vw' }),  // Ensure position is set
        animate('500ms ease-in-out', style({ marginLeft: '0vw' }))
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
