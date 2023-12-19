import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FairworksComponent } from './fairworks.component';

describe('FairworksComponent', () => {
  let component: FairworksComponent;
  let fixture: ComponentFixture<FairworksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FairworksComponent]
    });
    fixture = TestBed.createComponent(FairworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
