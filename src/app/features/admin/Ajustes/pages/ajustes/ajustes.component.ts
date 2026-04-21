import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AjustesService } from '../../services/ajustes.services';
import { AdministradoresComponent } from '../administradores/administradores.component';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdministradoresComponent],
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.scss'],
})
export class AjustesComponent implements OnInit {
  cargando = true;
  guardando = false;
  mostrarAdministradores = false;
  private idAjuste: number | null = null;

  ajustesForm: FormGroup;

  provincias = [
    'San José',
    'Alajuela',
    'Cartago',
    'Heredia',
    'Guanacaste',
    'Puntarenas',
    'Limón',
  ];

  constructor(private ajustesService: AjustesService, private fb: FormBuilder) {
    this.ajustesForm = this.fb.group({
      nombreUniversidad: ['', [Validators.required, Validators.maxLength(100)]],
      sitioWeb: ['', [Validators.maxLength(100)]],
      correoInstitucional: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefono: ['', [Validators.maxLength(20)]],
      direccion: [''],
      provincia: ['', [Validators.maxLength(10)]],
      canton: ['', [Validators.maxLength(50)]],
      distrito: ['', [Validators.maxLength(50)]],
      montoMatricula: [null, [Validators.min(0)]],
      montoInfraestructura: [null, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.ajustesService.cargasAjustes().subscribe({
      next: (res) => {
        if (!res.blnError && res.valorRetorno) {
          const { idAjuste, ...datos } = res.valorRetorno;
          this.idAjuste = idAjuste;
          this.ajustesForm.patchValue(datos);
        }
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

  descartar(): void {
    this.ajustesForm.reset();
    this.ngOnInit();
  }

  guardar(): void {
    if (this.ajustesForm.invalid) return;
    this.guardando = true;
    const datos = this.ajustesForm.value;
    const operacion$ = this.idAjuste === null
      ? this.ajustesService.crearAjustes(datos)
      : this.ajustesService.updateAjustes({ idAjuste: this.idAjuste, ...datos });

    operacion$.subscribe({
      next: (res) => {
        if (!res.blnError && res.valorRetorno) this.idAjuste = res.valorRetorno;
        this.guardando = false;
      },
      error: () => {
        this.guardando = false;
      },
    });
  }

  get nombreUniversidad() { return this.ajustesForm.get('nombreUniversidad'); }
  get sitioWeb() { return this.ajustesForm.get('sitioWeb'); }
  get correoInstitucional() { return this.ajustesForm.get('correoInstitucional'); }
  get telefono() { return this.ajustesForm.get('telefono'); }
  get provincia() { return this.ajustesForm.get('provincia'); }
  get canton() { return this.ajustesForm.get('canton'); }
  get distrito() { return this.ajustesForm.get('distrito'); }
  get montoMatricula() { return this.ajustesForm.get('montoMatricula'); }
  get montoInfraestructura() { return this.ajustesForm.get('montoInfraestructura'); }
}
