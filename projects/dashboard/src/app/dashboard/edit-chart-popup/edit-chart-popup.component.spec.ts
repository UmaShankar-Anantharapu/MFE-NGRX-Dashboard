import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChartPopupComponent } from './edit-chart-popup.component';

describe('EditChartPopupComponent', () => {
  let component: EditChartPopupComponent;
  let fixture: ComponentFixture<EditChartPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditChartPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditChartPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
