import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChartConfigComponent } from './create-chart-config.component';

describe('CreateChartConfigComponent', () => {
  let component: CreateChartConfigComponent;
  let fixture: ComponentFixture<CreateChartConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChartConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateChartConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
