import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritocomprasPage } from './carritocompras.page';

describe('CarritocomprasPage', () => {
  let component: CarritocomprasPage;
  let fixture: ComponentFixture<CarritocomprasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarritocomprasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
