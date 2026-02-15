import { Component, OnInit } from '@angular/core';
import { Curso } from '../../models/curso.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/curso.service';

@Component({
  selector: 'app-curso-detail',
  templateUrl: './curso-detail.html',
  styleUrl: './curso-detail.scss',
})
export class CursoDetailComponent implements OnInit {
  curso?: Curso;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.curso = this.cursoService.getCursoById(id);
  }

  volver(): void {
    this.router.navigate(['/cursos']);
  }
}
