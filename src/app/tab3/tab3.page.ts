import { Component, OnInit } from '@angular/core';
import { Usuario, UsuariosService } from '../services/usuarios.service';
import { PedidosService } from '../services/pedidos.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  pedidos: any[] = []; // Cambiado a any[] temporalmente
  usuario!: Usuario | null;

  constructor(
    private pedidosService: PedidosService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    this.usuario = this.usuariosService.getUsuario();

    if (this.usuario?.id) { // Usamos id en lugar de usuario
      this.pedidosService.obtenerPedidosUsuario(this.usuario.id).subscribe(
        (pedidos: any[]) => {
          this.pedidos = pedidos;
        },
        (error) => {
          console.error('Error al cargar pedidos:', error);
        }
      );
    } else {
      console.error('Usuario no autenticado');
    }
  }
}