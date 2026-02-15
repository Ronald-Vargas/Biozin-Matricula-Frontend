import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionesListComponent } from './asignaciones-list.component';

describe('AsignacionesList', () => {
  let component: AsignacionesListComponent;
  let fixture: ComponentFixture<AsignacionesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
