import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'angular17demos';

  loginForm: FormGroup;
  loginList: any[] = [];
  selectedIndex: number = -1;
  isEditMode: boolean = false;
  isSubmitMode: boolean = true;
  passwordFieldType: string = 'password'; // le decimos que tipo de dato va a recibir de password

  //FormGroup es un objeto de clave:valor (como un JSON), por tanto en el constructor le decimos que la clave será Email/Password con unos valores guardados en un array
  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      Email: [''],
      Password: [''],
    });
  }

  ngOnInit(): void {
    let data = localStorage.getItem('loginList');
    this.loginList = JSON.parse(data || '[]');
  }

  //cuando enviamos el formulario comprueba primero si es pulsado el botón add/update para enviar el nuevo valor al array/valor correspondiente, para luego borrar la celda
  submit() {
    console.log(this.loginForm.value);
    if (this.isEditMode) {
      this.updateData();
    } else {
      this.addNewData();
    }
    this.clear();
  }

  //cuando pulsamos el botón de editar "activa" el modo de edición y "apaga" el modo de crear (submit)
  edit(i: number) {
    this.loginForm.patchValue({
      Email: this.loginList[i].Email,
      Password: this.loginList[i].Password,
    });
    this.selectedIndex = i;
    this.isEditMode = true;
    this.isSubmitMode = false;
  }

  //cuando actualizamos un dato primero comprueba que el índice no sea -1 (que esté vacío) y recoge el index/clave seleccionado en Email/Password para modificar su valor
  updateData() {
    if (this.selectedIndex !== -1) {
      this.loginList[this.selectedIndex].Email = this.loginForm.value.Email;
      this.loginList[this.selectedIndex].Password = this.loginForm.value.Password;
      localStorage.setItem('loginList', JSON.stringify(this.loginList));
    }
    this.clearEditMode();
  }

  //al añadir un nuevo dato lo quye hace es añadir el valor a array de clave/valores
  addNewData() {
    this.loginList.push(this.loginForm.value);
    localStorage.setItem('loginList', JSON.stringify(this.loginList));
  }

  clear() {
    this.loginForm.reset();
    this.clearEditMode();
  }

  //se "activa" el envío de datos para añadir nuevos valroes 7 "apaga" la funcionalidad de actualizar datos
  clearEditMode() {
    this.selectedIndex = -1;
    this.isEditMode = false;
    this.isSubmitMode = true;
  }

  //elimina el índice/clave seleccionada con todo lo que tiene dentro y actualiza el listado
  delete(i: number) {
    this.loginList.splice(i, 1);
    localStorage.setItem('loginList', JSON.stringify(this.loginList));
  }

  //Es una condición terciaria para ver si el password se puede almacenar o no
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
