import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodoDetailComponent } from './periodo-detail.component';

describe('PeriodoDetailComponent', () => {
  let component: PeriodoDetailComponent;
  let fixture: ComponentFixture<PeriodoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodoDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
