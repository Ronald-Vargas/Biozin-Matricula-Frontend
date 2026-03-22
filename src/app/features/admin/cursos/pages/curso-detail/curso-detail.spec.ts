import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosDetail } from './cursos-detail.component';

describe('CursosDetail', () => {
  let component: CursosDetail;
  let fixture: ComponentFixture<CursosDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
