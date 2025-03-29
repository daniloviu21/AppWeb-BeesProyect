import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from 'src/app/services/pedidos.service';
import { Direccion, MetodosPago, UsuariosService } from 'src/app/services/usuarios.service';
import { jsPDF } from 'jspdf';
import { AlertController, ToastController } from '@ionic/angular';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { forkJoin } from 'rxjs';

interface ProductoPedido {
  id: number;
  idpedido: number;
  idproducto: number;
  cantidad: number;
  preciounitario: string;
  subtotal: string;
  nombreproducto: string;
  descripcion?: string;
}

interface PedidoCompleto {
  id: number;
  total: string;
  fecha: string;
  estado: string;
  idcliente: number;
  iddireccion: number;
  idmetodopago: number;
  detalles: ProductoPedido[];
  direccion?: string;
  metodoPago?: string;
}

@Component({
  selector: 'app-detallespedido',
  templateUrl: './detallespedido.page.html',
  styleUrls: ['./detallespedido.page.scss'],
  standalone: false
})
export class DetallespedidoPage implements OnInit {
  pedido: PedidoCompleto | null = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private pedidosService: PedidosService,
    private usuariosService: UsuariosService,
    private alertCtrl: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const pedidoId = this.route.snapshot.paramMap.get('id');
    
    if (pedidoId) {
      this.cargarPedidoCompleto(+pedidoId);
    }
  }

  cargarPedidoCompleto(pedidoId: number) {
    this.cargando = true;
    
    forkJoin([
      this.pedidosService.obtenerPedidoPorId(pedidoId),
      this.usuariosService.obtenerDirecciones(this.usuariosService.getUsuario()?.id || 0),
      this.usuariosService.obtenerMetodosPago(this.usuariosService.getUsuario()?.id || 0)
    ]).subscribe(
      ([pedido, direcciones, metodosPago]) => {
        // Encontrar la dirección específica
        const direccion = direcciones.find((d: Direccion) => d.id === pedido.iddireccion);
        
        // Encontrar el método de pago específico
        const metodoPago = metodosPago.find((m: MetodosPago) => m.id === pedido.idmetodopago);
        
        // Formatear el método de pago para mostrar solo los últimos 4 dígitos
        const metodoPagoFormateado = metodoPago 
          ? `${metodoPago.tipo} •••• ${metodoPago.numeroTarjeta.slice(-4)}` 
          : 'Método no disponible';

        this.pedido = {
          ...pedido,
          direccion: direccion 
            ? `${direccion.calle}, ${direccion.ciudad}, ${direccion.estado}` 
            : 'Dirección no disponible',
          metodoPago: metodoPagoFormateado
        };
        
        this.cargando = false;
      },
      (error) => {
        console.error('Error al cargar el pedido:', error);
        this.cargando = false;
      }
    );
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
    
    // Encabezado
    doc.setFontSize(18);
    doc.text('Vanguard - Recibo de Compra', 10, 10);
    doc.setFontSize(12);
    
    // Información del pedido
    doc.text(`Pedido ID: ${this.pedido.id}`, 10, 20);
    doc.text(`Fecha: ${new Date(this.pedido.fecha).toLocaleDateString()}`, 10, 30);
    doc.text(`Estado: ${this.pedido.estado}`, 10, 40);
    doc.text(`Dirección de entrega: ${this.pedido.direccion}`, 10, 50);
    doc.text(`Método de pago: ${this.pedido.metodoPago}`, 10, 60);
    
    // Productos
    doc.text('Productos:', 10, 80);
    
    let y = 90;
    this.pedido.detalles.forEach((producto: ProductoPedido, index: number) => {
      doc.text(`${index + 1}. ${producto.nombreproducto}`, 15, y);
      doc.text(`Cantidad: ${producto.cantidad}`, 15, y + 5);
      doc.text(`Precio unitario: ${producto.preciounitario}`, 15, y + 10);
      doc.text(`Subtotal: ${producto.subtotal}`, 15, y + 15);
      y += 25;
    });
    
    // Total
    doc.text(`Total: ${this.pedido.total}`, 10, y + 10);
    
    // Pie de página
    doc.text('Gracias por tu compra en Vanguard. Vuelve pronto', 10, y + 30);
    
    const pdfOutput = doc.output('blob');
    this.savePDFToDevice(pdfOutput, `recibo_${this.pedido.id}.pdf`);
  }

  async savePDFToDevice(pdfBlob: Blob, fileName: string) {
    try {
      const base64Data = await this.blobToBase64(pdfBlob);
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true
      });
      this.presentToast('PDF guardado en la carpeta de documentos.');
    } catch (error) {
      console.error('Error al guardar el PDF', error);
      this.presentToast('Error al guardar el PDF.');
    }
  }

  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async presentToast(message: string = 'PDF generado con éxito!') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2400,
      position: 'bottom',
      color: 'success'
    });

    await toast.present();
  }
}