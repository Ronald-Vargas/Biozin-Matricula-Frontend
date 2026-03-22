import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeriodoFormComponent } from './periodo-form.component';


describe('PeriodoFormComponent', () => {
  let component: PeriodoFormComponent;
  let fixture: ComponentFixture<PeriodoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
