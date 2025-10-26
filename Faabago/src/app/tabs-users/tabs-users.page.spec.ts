import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsUsersPage } from './tabs-users.page';

describe('TabsUsersPage', () => {
  let component: TabsUsersPage;
  let fixture: ComponentFixture<TabsUsersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsUsersPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
