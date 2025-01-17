import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDashboardConfigComponent } from './create-dashboard-config.component';

describe('CreateDashboardConfigComponent', () => {
  let component: CreateDashboardConfigComponent;
  let fixture: ComponentFixture<CreateDashboardConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDashboardConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDashboardConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
