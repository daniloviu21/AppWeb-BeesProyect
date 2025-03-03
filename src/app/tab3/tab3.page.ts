import { Component } from '@angular/core';
import { Usuario, UsuariosService } from '../services/usuarios.service';
import { Pedido, PedidosService } from '../services/pedidos.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  pedidos: Pedido[] = [];
  usuario!: Usuario | null;

  constructor(
    private pedidosService: PedidosService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    // Obtener el usuario actual
    this.usuario = this.usuariosService.getUsuario();

    if (this.usuario) {
      // Obtener los pedidos del usuario actual
      this.pedidos = this.pedidosService.obtenerPedidosUsuario(this.usuario.user);
    } else {
      console.error('Usuario no autenticado');
    }
  }
}
