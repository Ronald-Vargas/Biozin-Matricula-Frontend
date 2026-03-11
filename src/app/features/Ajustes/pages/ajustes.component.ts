import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateAjustesDto } from '../model/ajustes.model';
import { AjustesService } from '../services/ajustes.services';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.scss'],
})
export class AjustesComponent implements OnInit {
  cargando = true;
  guardando = false;

  form: CreateAjustesDto = {
    nombreUniversidad: '',
    sitioWeb: '',
    correoInstitucional: '',
    telefono: '',
    direccion: '',
    privincia: '',
    canton: '',
    distrito: '',
  };

  private originalForm: CreateAjustesDto = { ...this.form };

  provincias = [
    'San José',
    'Alajuela',
    'Cartago',
    'Heredia',
    'Guanacaste',
    'Puntarenas',
    'Limón',
  ];

  constructor(private ajustesService: AjustesService) {}

  ngOnInit(): void {
    this.ajustesService.getAjustes().subscribe({
      next: (res) => {
        if (!res.blnError && res.valorRetorno) {
          const { idAjuste, ...datos } = res.valorRetorno;
          this.form = { ...datos };
          this.originalForm = { ...datos };
        }
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

  descartar(): void {
    this.form = { ...this.originalForm };
  }

  guardar(): void {
    this.guardando = true;
    this.ajustesService.updateAjustes(this.form).subscribe({
      next: (res) => {
        if (!res.blnError) {
          this.originalForm = { ...this.form };
        }
        this.guardando = false;
      },
      error: () => {
        this.guardando = false;
      },
    });
  }
}
