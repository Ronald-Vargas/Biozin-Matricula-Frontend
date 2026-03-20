import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteTable } from './estudiante-table';

describe('EstudianteTable', () => {
  let component: EstudianteTable;
  let fixture: ComponentFixture<EstudianteTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudianteTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
