import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CakeComponent } from './cake.component';

describe('CakeComponent', () => {
  let component: CakeComponent;
  let fixture: ComponentFixture<CakeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CakeComponent]
    });
    fixture = TestBed.createComponent(CakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
