import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudiantesList } from './estudiantes-list';

describe('EstudiantesList', () => {
  let component: EstudiantesList;
  let fixture: ComponentFixture<EstudiantesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudiantesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudiantesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
