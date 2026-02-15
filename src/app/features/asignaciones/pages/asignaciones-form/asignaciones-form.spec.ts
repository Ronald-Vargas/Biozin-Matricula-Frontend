import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionesFormComponent } from './asignaciones-form.component';

describe('AsignacionesForm', () => {
  let component: AsignacionesFormComponent;
  let fixture: ComponentFixture<AsignacionesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
