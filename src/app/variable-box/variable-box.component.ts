import { Component } from '@angular/core';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {ToggleButton} from 'primeng/togglebutton';


@Component({
  selector: 'variable-box',
  imports: [
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    FormsModule,
    ToggleButton,
    Button
  ],
  templateUrl: './variable-box.component.html',
  styleUrl: './variable-box.component.css'
})
export class VariableBoxComponent {
  name: any;
  value: any;
  checked: any;

}
