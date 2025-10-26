import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { SearchridePage } from './searchride.page';

describe('SearchridePage', () => {
  let component: SearchridePage;
  let fixture: ComponentFixture<SearchridePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchridePage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchridePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
