import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoliticaPrivacidadPage } from './politica-privacidad.page';

describe('PoliticaPrivacidadPage', () => {
  let component: PoliticaPrivacidadPage;
  let fixture: ComponentFixture<PoliticaPrivacidadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticaPrivacidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
