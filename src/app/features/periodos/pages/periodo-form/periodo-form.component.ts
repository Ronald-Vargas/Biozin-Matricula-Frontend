import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";



@Component({
  selector: 'app-periodo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './periodo-form.html',
  styleUrl: './periodo-form.scss',
})


export class PeriodoFormComponent implements OnInit {

  mostrarMensaje: boolean = false;
  esEdicion: boolean = false;
  periodoId: number | null = null;
  titulo: string = '📝 Nuevo Periodo';

  form = {

    periodo: '',
    fechaInicio: '',
    fechaFin: '',
    fechaMatricula: '',
    MatriculaCierre: '',
    estado: 'Abierto'

  };


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}


  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.periodoId = +id;
      this.titulo = '✏️ Editar Periodo';
      this.cargarPeriodo(this.periodoId);
    }
  }

  cargarPeriodo(id: number): void {
    // TODO: Reemplazar con tu EstudianteService.getById(id)
    this.form = {
    periodo: 'I Semestre 2026',
    fechaInicio: '10 feb 2026',
    fechaFin: '28 jun 2026',
    fechaMatricula: '1 feb 2026',
    MatriculaCierre: '28 feb 2026',
    estado: 'Abierto'
    };
  }






  guardar(): void {
    if (!this.form.periodo || !this.form.fechaInicio || !this.form.fechaFin || !this.form.fechaMatricula || !this.form.MatriculaCierre || !this.form.estado) {
      alert('⚠️ Por favor complete los campos obligatorios');
      return;
    }

    if (this.esEdicion) {
      // TODO: Llamar servicio de actualización
      console.log('Actualizar periodo:', this.periodoId, this.form);
      alert('✅ Periodo actualizado exitosamente');
    } else {
      // TODO: Llamar servicio de creación
      console.log('Crear periodo:', this.form);
      this.mostrarMensaje = true;
    }

    this.cancelar();
  }

  cancelar(): void {
    if (this.esEdicion) {
      this.router.navigate(['../..'], { relativeTo: this.route });
    } else {
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }

}