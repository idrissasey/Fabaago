import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { InscriptionPage } from './inscription.page';

describe('InscriptionPage', () => {
  let component: InscriptionPage;
  let fixture: ComponentFixture<InscriptionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InscriptionPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InscriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
