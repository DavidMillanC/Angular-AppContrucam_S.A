import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
  form: FormGroup;
  difDays: number = 0;
  valorImporte: number = 0;
  valorDescuento: number = 0;
  valorGarantia: number = 0;
  arrays = [
    {
      cliente: '',
      maquina: '',
      fechaEntrega: '',
      fechaDevolucion: '',
      dias: '',
      importe: '',
      descuento: '',
      garantia: '',
      totalPagar: '',
    },
  ];
  headers = [
    'Cliente',
    'Maquinaria',
    'Fecha Entrega',
    'Fecha Devolución',
    'Días',
    'Importe',
    'Descuento',
    'Garantía',
    'Total Pagar',
  ];
  constructor(private formBuilder: FormBuilder) {
    this.form = this.createForm();
    this.arrays = [];
  }

  ngOnInit(): void {}

  createForm() {
    return (this.form = this.formBuilder.group({
      cliente: ['', [Validators.required]],
      maquina: ['', [Validators.required]],
      fechaEntrega: ['', [Validators.required]],
      fechaDevolucion: ['', [Validators.required]],
      dias: [''],
      importe: [''],
      descuento: [''],
      garantia: [''],
      totalPagar: [''],
    }));
  }
  /****ENVÍO DE LOS DATOS****/
  enviarDatos() {
    if (this.form.invalid) {
      this.setErrorFlag(Object.values(this.form.controls));
      return;
    }

    this.form.value.dias = this.newCalculoDias(
      this.form.value.fechaEntrega,
      this.form.value.fechaDevolucion
    );
    if (this.form.value.dias < 0) {
      return alert('Ingrese las fechas correctamente...');
    } else {
      this.arrays.push(this.form.value);
    }
    this.form.value.importe = this.calculoImporte(
      this.form.value.maquina,
      this.form.value.dias
    );
    this.form.value.descuento = this.calculoDescuento(
      this.form.value.importe,
      this.form.value.dias
    );
    this.form.value.totalPagar = this.calculoPago(
      this.form.value.importe,
      this.form.value.descuento
    );
    this.form.value.garantia = this.calculoGarantia(this.form.value.totalPagar);
    this.form.reset();
  }
  /****MÉTODOS CALCULOS****/
  calculoDia(fechaEntrega: string, fechaDevolucion: string) {
    return (this.difDays =
      parseInt(fechaDevolucion.substring(8, 10)) -
      parseInt(fechaEntrega.substring(8, 10)));
  }
  newCalculoDias(fecha: string, devolucion: string) {
    var firstDay = new Date(fecha);
    var secondDay = new Date(devolucion);

    let diferencia = secondDay.getTime() - firstDay.getTime();
    return Math.round(diferencia / (1000 * 60 * 60 * 24));
  }
  calculoImporte(maquina: string, dias: number) {
    if (maquina == 'C01') {
      this.valorImporte = 100;
    }
    if (maquina == 'C02') {
      this.valorImporte = 50;
    }
    if (maquina == 'C03') {
      this.valorImporte = 150;
    }
    return this.valorImporte * dias;
  }
  calculoDescuento(importe: number, dias: number) {
    this.valorDescuento = 0;
    if (dias > 7) {
      this.valorDescuento = (importe * 10) / 100;
    }
    return this.valorDescuento;
  }
  calculoPago(importe: number, descuento: number) {
    return importe - descuento;
  }
  calculoGarantia(totalPagar: number) {
    return (totalPagar * 10) / 100;
  }

  /****VALIDACIONES****/
  clienteInvalido() {
    return this.getInvalidField('cliente');
  }

  maquinaInvalida() {
    return this.getInvalidField('maquina');
  }

  fechaEntregaInvalida() {
    return this.getInvalidField('fechaEntrega');
  }

  fechaDevolucionInvalida() {
    return this.getInvalidField('fechaDevolucion');
  }

  getInvalidField(field: string) {
    const control = this.getField(field);
    return control.invalid && control.touched;
  }

  getField(field: string) {
    const control = this.form.get(field);
    if (!control) throw new Error('El control no existe o no esta cargado.');
    return control;
  }

  setErrorFlag(controls: AbstractControl[]) {
    for (const control of controls) {
      if (control instanceof FormGroup) {
        this.setErrorFlag(Object.values(control.controls));
      } else control.markAsTouched();
    }
    {
      {
      }
    }
  }
}
