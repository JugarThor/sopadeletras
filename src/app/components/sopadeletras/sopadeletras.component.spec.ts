import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopadeletrasComponent } from './sopadeletras.component';

describe('SopadeletrasComponent', () => {
  let component: SopadeletrasComponent;
  let fixture: ComponentFixture<SopadeletrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SopadeletrasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SopadeletrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
