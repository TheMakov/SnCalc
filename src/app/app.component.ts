import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {InputText, InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {trigger, state, style, transition, animate} from '@angular/animations';


@Component({
  selector: 'app-root',
  imports: [ ButtonModule, RouterOutlet, FormsModule, FloatLabel, InputText],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('openClose', [state('closed', style({marginLeft: '0vw'}))])
  ]
})
export class AppComponent {
  title = 'sn-calc';
  value: any;
}
