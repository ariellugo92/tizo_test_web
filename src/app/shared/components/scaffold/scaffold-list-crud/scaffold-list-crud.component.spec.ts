import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaffoldListCrudComponent } from './scaffold-list-crud.component';

describe('ScaffoldListCrudComponent', () => {
  let component: ScaffoldListCrudComponent;
  let fixture: ComponentFixture<ScaffoldListCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaffoldListCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScaffoldListCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
