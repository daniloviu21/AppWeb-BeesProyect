import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarDireccionPage } from './agregar-direccion.page';

describe('AgregarDireccionPage', () => {
  let component: AgregarDireccionPage;
  let fixture: ComponentFixture<AgregarDireccionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarDireccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
