
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallespedidoPage } from './detallespedido.page';

describe('DetallespedidoPage', () => {
  let component: DetallespedidoPage;
  let fixture: ComponentFixture<DetallespedidoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallespedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});