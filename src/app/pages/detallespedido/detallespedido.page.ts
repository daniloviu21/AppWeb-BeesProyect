import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pedido, PedidosService } from 'src/app/services/pedidos.service';
import { Observable } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-detallespedido',
  templateUrl: './detallespedido.page.html',
  styleUrls: ['./detallespedido.page.scss'],
  standalone: false
})
export class DetallespedidoPage implements OnInit {
  pedido: Pedido | null = null;

  constructor(
    private route: ActivatedRoute,
    private pedidosService: PedidosService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    const pedidoId = this.route.snapshot.paramMap.get('id');
    const usuario = this.usuariosService.getUsuario();

    if (pedidoId && usuario) {
      const pedido = this.pedidosService.obtenerPedidoPorId(usuario.user, pedidoId);
      if (pedido) {
        this.pedido = pedido;
      } else {
        console.error('Pedido no encontrado');
      }
    } else {
      console.error('Usuario no autenticado o ID de pedido no proporcionado');
    }
  }
}