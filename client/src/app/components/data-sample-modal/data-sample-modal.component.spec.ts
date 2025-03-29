import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSampleModalComponent } from './data-sample-modal.component';

describe('DataSampleModalComponent', () => {
  let component: DataSampleModalComponent;
  let fixture: ComponentFixture<DataSampleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSampleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSampleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
