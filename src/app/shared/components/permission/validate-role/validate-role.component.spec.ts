import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateRoleComponent } from './validate-role.component';

describe('ValidateRoleComponent', () => {
  let component: ValidateRoleComponent;
  let fixture: ComponentFixture<ValidateRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateRoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidateRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
