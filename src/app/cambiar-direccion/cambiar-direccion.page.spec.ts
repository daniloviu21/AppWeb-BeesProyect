import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarDireccionPage } from './cambiar-direccion.page';

describe('CambiarDireccionPage', () => {
  let component: CambiarDireccionPage;
  let fixture: ComponentFixture<CambiarDireccionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarDireccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
