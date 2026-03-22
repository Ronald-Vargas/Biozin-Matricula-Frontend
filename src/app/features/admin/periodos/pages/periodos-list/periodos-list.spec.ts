import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodosListComponent } from './periodos-list.component';

describe('PeriodosListComponent', () => {
  let component: PeriodosListComponent;
  let fixture: ComponentFixture<PeriodosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
