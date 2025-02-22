import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TerminosCondicionesPage } from './terminos-condiciones.page';

describe('TerminosCondicionesPage', () => {
  let component: TerminosCondicionesPage;
  let fixture: ComponentFixture<TerminosCondicionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminosCondicionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
