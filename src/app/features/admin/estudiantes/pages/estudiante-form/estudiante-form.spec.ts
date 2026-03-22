import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteFormComponent } from './estudiante-form.component';

describe('EstudianteForm', () => {
  let component: EstudianteFormComponent;
  let fixture: ComponentFixture<EstudianteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudianteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
