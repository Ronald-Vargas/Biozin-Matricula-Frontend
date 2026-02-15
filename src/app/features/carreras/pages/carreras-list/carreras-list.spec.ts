import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrerasListComponent } from './carreras-list.component';

describe('CarrerasListComponent', () => {
  let component: CarrerasListComponent;
  let fixture: ComponentFixture<CarrerasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrerasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrerasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
