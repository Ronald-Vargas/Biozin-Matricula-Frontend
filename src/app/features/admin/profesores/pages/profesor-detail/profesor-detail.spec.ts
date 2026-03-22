import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteDetail } from './estudiante-detail';

describe('EstudianteDetail', () => {
  let component: EstudianteDetail;
  let fixture: ComponentFixture<EstudianteDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudianteDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
