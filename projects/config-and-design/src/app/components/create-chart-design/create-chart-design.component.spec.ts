import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChartDesignComponent } from './create-chart-design.component';

describe('CreateChartDesignComponent', () => {
  let component: CreateChartDesignComponent;
  let fixture: ComponentFixture<CreateChartDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChartDesignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateChartDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
