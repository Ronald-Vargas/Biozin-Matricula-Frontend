import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionesDetailComponent } from './asignaciones-detail.component';

describe('AsignacionesDetail', () => {
  let component: AsignacionesDetailComponent;
  let fixture: ComponentFixture<AsignacionesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionesDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
