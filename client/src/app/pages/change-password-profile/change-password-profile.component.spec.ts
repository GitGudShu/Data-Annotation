import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordProfileComponent } from './change-password-profile.component';

describe('ChangePasswordProfileComponent', () => {
  let component: ChangePasswordProfileComponent;
  let fixture: ComponentFixture<ChangePasswordProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePasswordProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
