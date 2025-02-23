import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetodosPagoPage } from './metodos-pago.page';

describe('MetodosPagoPage', () => {
  let component: MetodosPagoPage;
  let fixture: ComponentFixture<MetodosPagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodosPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
