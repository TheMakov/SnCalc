import {ChangeDetectorRef, Component} from '@angular/core';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {ToggleButton} from 'primeng/togglebutton';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ScrollPanel} from 'primeng/scrollpanel';
import {Scroller} from 'primeng/scroller';
import {InputOtp} from 'primeng/inputotp';


@Component({
  selector: 'variable-box',
  imports: [
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    FormsModule,
    ToggleButton,
    Button,
    NgIf,
    InputOtp,
    NgForOf,
  ],
  templateUrl: './variable-box.component.html',
  styleUrl: './variable-box.component.css'
})
export class VariableBoxComponent {
  name: any;
  value: any;
  checked: any = true;

  matrix_upper_row_value_string:any  = ['1', '2'];
  matrix_value: string = "";
  matrix_length: any = 2;

  constructor(private cdr: ChangeDetectorRef) {}


  update_otp_length (){
    let old_value_length = this.matrix_value.length;
    let old_matrix_length = this.matrix_length;
    this.matrix_length = this.matrix_value.length +2;
    if(old_matrix_length >= old_value_length+2){
      this.matrix_upper_row_value_string.pop()
      console.log(this.matrix_upper_row_value_string);
    }
    else{
      this.matrix_upper_row_value_string.push((old_value_length +2).toString());
      console.log(this.matrix_upper_row_value_string);
    }


  }
}
