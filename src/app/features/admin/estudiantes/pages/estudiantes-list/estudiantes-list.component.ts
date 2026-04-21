import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Estudiante } from '../../models/estudiantes.model';
import { combineLatest, Subscription } from 'rxjs';
import { EstudianteService } from '../../services/estudiantes.services';
import { CarreraService } from '../../../carreras/services/carrera.service';
import { Carrera } from '../../../carreras/models/carrera.model';


@Component({
  selector: 'app-estudiantes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './estudiantes-list.html',
  styleUrls: ['./estudiantes-list.scss'],
})


export class EstudiantesListComponent implements OnInit, OnDestroy {

  estudiantes: Estudiante[] = [];
  carreras: Carrera[] = [];
  filtroNombre = '';
  filtroEstado = 'activo';
  filtroCarrera = 0;
  carreraComboAbierto = false;
  busquedaCarrera = '';

  private sub?: Subscription;

  constructor(
    private estudianteService: EstudianteService,
    private carreraService: CarreraService,
    private router: Router,
  ) {}



  ngOnInit(): void {
    this.sub = combineLatest([
      this.estudianteService.getEstudiantes(),
      this.carreraService.getCarreras(),
    ]).subscribe(([estudiantes, carreras]) => {
      this.carreras = carreras;
      this.estudiantes = estudiantes;
    });
  }



  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }


  

  get estudiantesFiltrados(): Estudiante[] {
    return this.estudiantes.filter(c => {
      const term = this.filtroNombre.toLowerCase();
      const matchNombre = !term || c.nombre.toLowerCase().includes(term) || c.cedula.toLowerCase().includes(term) || c.emailInstitucional.toLowerCase().includes(term);
      const matchEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activo' && c.estadoEstudiante === true) ||
        (this.filtroEstado === 'inactivo' && c.estadoEstudiante === false);
      const matchCarrera = !this.filtroCarrera || (c.idsCarreras ?? []).includes(this.filtroCarrera);
      return matchNombre && matchEstado && matchCarrera;
    });
  }

  get carreraSeleccionadaTexto(): string {
    const carrera = this.carreras.find(c => c.idCarrera === Number(this.filtroCarrera));
    return carrera ? carrera.nombre : 'Todos los estudiantes';
  }

  get carrerasFiltradas(): Carrera[] {
    const filtradas = this.carreras.filter(carrera =>
      this.coincideBusqueda(`${carrera.codigo} ${carrera.nombre} ${carrera.descripcion ?? ''}`, this.busquedaCarrera)
    );

    const idSeleccionado = Number(this.filtroCarrera);
    if (!idSeleccionado || filtradas.some(c => c.idCarrera === idSeleccionado)) return filtradas;

    const seleccionada = this.carreras.find(c => c.idCarrera === idSeleccionado);
    return seleccionada ? [seleccionada, ...filtradas] : filtradas;
  }

  toggleCarreraCombo(): void {
    this.carreraComboAbierto = !this.carreraComboAbierto;
  }

  cerrarComboCarrera(): void {
    this.carreraComboAbierto = false;
  }

  seleccionarCarrera(carrera?: Carrera): void {
    this.filtroCarrera = carrera?.idCarrera ?? 0;
    this.busquedaCarrera = '';
    this.carreraComboAbierto = false;
  }

  carreraDetalleTexto(carrera: Carrera): string {
    return `${carrera.codigo} | ${carrera.duracion} periodos`;
  }

  actualizarBusquedaCarrera(event: Event): void {
    this.busquedaCarrera = (event.target as HTMLInputElement).value;
  }

  private coincideBusqueda(texto: string, busqueda: string): boolean {
    const filtro = this.normalizar(busqueda);
    if (!filtro) return true;

    const textoNormalizado = this.normalizar(texto);
    return filtro.split(/\s+/).every(parte => textoNormalizado.includes(parte));
  }

  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }




  nuevoEstudiante(): void {
    this.router.navigate(['/estudiantes/nuevo']);
  }


  filtrar(estado: string): void {
    this.filtroEstado = estado;
  }



  getEstadoClass(estado: boolean): string {
    return estado ? 'badge-active' : 'badge-inactive';
  }

  toggleEstado(idProfesor: number): void {
    this.estudianteService.toggleEstado(idProfesor);
  }


  verDetalle(est: Estudiante): void {
    this.router.navigate(['/estudiantes', est.idEstudiante]);
  }
  
  editarEstudiante(est: Estudiante): void {
    this.router.navigate(['/estudiantes/editar', est.idEstudiante]);
  }


  getIniciales(est: Estudiante): string {
    return (est.nombre.charAt(0) + est.apellidoPaterno.charAt(0)).toUpperCase();
  }


  getNombreCompleto(est: Estudiante): string {
    return `${est.nombre} ${est.apellidoPaterno} ${est.apellidoMaterno || ''}`.trim();
  }

  getToggleButtonConfig(estado: boolean): { icon: string; tooltip: string } {
    return estado
      ? { icon: '🗑️', tooltip: 'Desactivar' }
      : { icon: '✅', tooltip: 'Activar' };
  }

}
