import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteFilters } from './estudiante-filters';

describe('EstudianteFilters', () => {
  let component: EstudianteFilters;
  let fixture: ComponentFixture<EstudianteFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudianteFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
