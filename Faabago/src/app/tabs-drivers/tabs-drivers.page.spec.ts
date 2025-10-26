import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsDriversPage } from './tabs-drivers.page';

describe('TabsDriversPage', () => {
  let component: TabsDriversPage;
  let fixture: ComponentFixture<TabsDriversPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsDriversPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsDriversPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
