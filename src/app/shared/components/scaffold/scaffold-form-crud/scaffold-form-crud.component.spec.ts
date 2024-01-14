import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaffoldFormCrudComponent } from './scaffold-form-crud.component';

describe('ScaffoldFormCrudComponent', () => {
  let component: ScaffoldFormCrudComponent;
  let fixture: ComponentFixture<ScaffoldFormCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaffoldFormCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScaffoldFormCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
