import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { DriversModalComponentPage } from './DriversModalComponent.page';

describe('Tab1Page', () => {
  let component: DriversModalComponentPage;
  let fixture: ComponentFixture<DriversModalComponentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DriversModalComponentPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DriversModalComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
