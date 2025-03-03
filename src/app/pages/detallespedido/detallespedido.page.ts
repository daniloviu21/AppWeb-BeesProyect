
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pedido, PedidosService } from 'src/app/services/pedidos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { jsPDF } from 'jspdf';
import { AlertController, ToastController } from '@ionic/angular';

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
    private usuariosService: UsuariosService,
    private alertCtrl: AlertController,
    private toastController: ToastController
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

  async pdf() {
    const alert = await this.alertCtrl.create({
      header: 'Generar PDF',
      message: 'El recibo PDF se guardara en tu dispositivo. ¿Deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Continuar',
          handler: () => {
            this.generarPDF();
            this.presentToast();
          }
        }
      ]
    });

    await alert.present();
  }

  generarPDF() {
    if (!this.pedido) return;
    
    const doc = new jsPDF();
    doc.text('Vanguard - Recibo de Compra', 10, 10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 20);
    doc.text(`Pedido ID: ${this.pedido.id}`, 10, 30);
    doc.text(`Cliente: ${this.pedido.usuarioId}`, 10, 40);
    doc.text(`Dirección de entrega: ${this.pedido.direccion}`, 10, 50);
    
    let y = 60;
    this.pedido.productos.forEach((producto, index) => {
      doc.text(`${index + 1}. ${producto.nombre} - ${producto.cantidad} x $${producto.precio}`, 10, y);
      y += 10;
    });
    
    doc.text(`Subtotal: $${this.pedido.total}`, 10, y + 10);
    doc.text(`Método de Pago: ${this.pedido.metodoPago}`, 10, y + 20);
    doc.text('Gracias por tu compra en Vanguard. Vuelve pronto', 10, y + 40);
    
    doc.save(`recibo_${this.pedido.id}.pdf`);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'PDF generado con exito!',
      duration: 2400,
      position: 'bottom',
      color: 'success'
    });

    await toast.present();
  }
}
