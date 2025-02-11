/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NotFountComponent } from './not-fount.component';

describe('NotFountComponent', () => {
  let component: NotFountComponent;
  let fixture: ComponentFixture<NotFountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotFountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
