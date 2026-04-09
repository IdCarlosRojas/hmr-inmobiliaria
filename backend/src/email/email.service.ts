import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly from: string;
  private readonly destino: string;

  constructor(private config: ConfigService) {
    const user = this.config.get<string>('EMAIL_USER');
    const pass = this.config.get<string>('EMAIL_PASS');
    this.from = `"Grupo Inmobiliario HMR" <${user}>`;
    this.destino = user!;

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('Error conectando al email: ' + error.message);
      } else {
        this.logger.log('✅ Servidor de email conectado correctamente');
      }
    });
  }

  // ─── Notificación a la inmobiliaria — nueva cita/consulta ────────────────
  async enviarNotificacionCita(cita: {
    id: number;
    clienteNombre: string;
    clienteEmail: string;
    clienteTelefono: string;
    propiedadTitulo?: string;
    fecha?: string;
    hora?: string;
    mensaje?: string;
  }) {
    const esConsulta = !cita.propiedadTitulo || cita.propiedadTitulo === 'Consulta general';
    const asunto = esConsulta
      ? `📩 Nueva consulta de ${cita.clienteNombre}`
      : `📅 Nueva cita — ${cita.clienteNombre} · ${cita.propiedadTitulo}`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f9fb;padding:24px;border-radius:12px;">
        <div style="background:#1B3A6B;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
          <h1 style="color:white;margin:0;font-size:20px;">${esConsulta ? '📩 Nueva consulta' : '📅 Nueva solicitud de visita'}</h1>
          <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:13px;">Grupo Inmobiliario HMR</p>
        </div>
        <div style="background:white;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e8ecf0;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;width:38%;">Nombre</td><td style="padding:10px 0;font-weight:700;">${cita.clienteNombre}</td></tr>
            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Email</td><td style="padding:10px 0;"><a href="mailto:${cita.clienteEmail}" style="color:#1B3A6B;">${cita.clienteEmail}</a></td></tr>
            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Teléfono</td><td style="padding:10px 0;">${cita.clienteTelefono}</td></tr>
            ${cita.propiedadTitulo && !esConsulta ? `<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Propiedad</td><td style="padding:10px 0;font-weight:600;">${cita.propiedadTitulo}</td></tr>` : ''}
            ${cita.mensaje ? `<tr><td style="padding:10px 0;color:#6b7280;vertical-align:top;">Mensaje</td><td style="padding:10px 0;font-style:italic;">"${cita.mensaje}"</td></tr>` : ''}
          </table>
          <div style="margin-top:20px;">
            <a href="mailto:${cita.clienteEmail}" style="display:inline-block;background:#1B3A6B;color:white;padding:10px 20px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none;">Responder por Email</a>
          </div>
          <p style="margin-top:20px;color:#9ca3af;font-size:12px;border-top:1px solid #f3f4f6;padding-top:16px;">Sistema HMR — ID: #${cita.id}</p>
        </div>
      </div>`;

    await this.transporter.sendMail({ from: this.from, to: this.destino, subject: asunto, html });
    this.logger.log(`✅ Email cita #${cita.id} enviado a inmobiliaria`);
  }

  // ─── Email al CLIENTE cuando confirman o cancelan su cita ────────────────
  async enviarConfirmacionCliente(cita: {
    clienteNombre: string;
    clienteEmail: string;
    propiedadTitulo?: string;
    fecha?: string;
    hora?: string;
    estado: string;
  }) {
    const confirmada = cita.estado === 'confirmada';
    const asunto = confirmada
      ? `✅ Tu visita ha sido confirmada — Grupo Inmobiliario HMR`
      : `❌ Tu solicitud de visita fue cancelada — Grupo Inmobiliario HMR`;

    const fechaFormateada = cita.fecha
      ? new Date(cita.fecha).toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
      : null;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f9fb;padding:24px;border-radius:12px;">
        <div style="background:${confirmada ? '#1B3A6B' : '#dc2626'};padding:24px;border-radius:8px 8px 0 0;text-align:center;">
          <h1 style="color:white;margin:0;font-size:22px;">${confirmada ? '✅ ¡Visita Confirmada!' : '❌ Visita Cancelada'}</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Grupo Inmobiliario HMR</p>
        </div>
        <div style="background:white;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e8ecf0;">
          <p style="color:#374151;font-size:15px;margin-top:0;">Hola <strong>${cita.clienteNombre}</strong>,</p>

          ${confirmada ? `
          <p style="color:#374151;font-size:15px;line-height:1.7;">¡Buenas noticias! Tu solicitud de visita ha sido <strong style="color:#059669;">confirmada</strong>. Te esperamos con gusto.</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin:20px 0;">
            <h3 style="margin:0 0 12px;color:#166534;font-size:15px;">📋 Detalles de tu visita</h3>
            ${cita.propiedadTitulo ? `<p style="margin:0 0 6px;font-size:14px;color:#374151;">🏠 <strong>${cita.propiedadTitulo}</strong></p>` : ''}
            ${fechaFormateada ? `<p style="margin:0 0 6px;font-size:14px;color:#374151;text-transform:capitalize;">📅 ${fechaFormateada}</p>` : ''}
            ${cita.hora ? `<p style="margin:0;font-size:14px;color:#374151;">🕐 ${cita.hora}</p>` : ''}
          </div>
          <p style="color:#374151;font-size:14px;">Si necesitas cambiar la fecha o tienes preguntas, contáctanos:</p>
          ` : `
          <p style="color:#374151;font-size:15px;line-height:1.7;">Lamentamos informarte que tu solicitud de visita ${cita.propiedadTitulo ? `para <strong>${cita.propiedadTitulo}</strong>` : ''} ha sido <strong style="color:#dc2626;">cancelada</strong>.</p>
          <p style="color:#374151;font-size:15px;line-height:1.7;">Esto puede deberse a disponibilidad del inmueble u otras razones. Te invitamos a contactarnos para reagendar o explorar otras opciones.</p>
          `}

          <div style="display:flex;gap:12px;margin-top:20px;flex-wrap:wrap;">
            <a href="https://wa.me/573202797261" target="_blank" style="display:inline-block;background:#25D366;color:white;padding:12px 22px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;">💬 WhatsApp</a>
            <a href="tel:+573202797261" style="display:inline-block;background:#1B3A6B;color:white;padding:12px 22px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;">📞 Llamar</a>
          </div>

          <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e8ecf0;font-size:13px;color:#6b7280;">
            <p style="margin:0 0 4px;"><strong style="color:#374151;">Grupo Inmobiliario HMR S.A.S.</strong></p>
            <p style="margin:0 0 4px;">📍 Cra 16 #53-38, Galerías, Bogotá</p>
            <p style="margin:0 0 4px;">📞 320 279 7261</p>
            <p style="margin:0;">✉️ grupoinmobiliariohmr@gmail.com</p>
          </div>
        </div>
      </div>`;

    await this.transporter.sendMail({ from: this.from, to: cita.clienteEmail, subject: asunto, html });
    this.logger.log(`✅ Email ${cita.estado} enviado al cliente ${cita.clienteEmail}`);
  }

  // ─── Alerta vencimiento de contrato ──────────────────────────────────────
  async enviarAlertaVencimiento(contrato: {
    id: number;
    arrendatarioNombre: string;
    arrendatarioEmail: string;
    propiedadTitulo: string;
    fechaFin: Date;
    valorMensual: number;
  }) {
    const fechaFormateada = new Date(contrato.fechaFin).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });
    const valor = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(contrato.valorMensual);

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f9fb;padding:24px;border-radius:12px;">
        <div style="background:#1B3A6B;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
          <h1 style="color:white;margin:0;font-size:20px;">⚠️ Alerta de Vencimiento de Contrato</h1>
        </div>
        <div style="background:white;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e8ecf0;">
          <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:14px;margin-bottom:20px;">
            <p style="margin:0;color:#92400e;font-weight:700;font-size:14px;">⏰ Vence en 3 meses — Plazo legal para cancelación</p>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;width:40%;">Contrato</td><td style="padding:10px 0;font-weight:600;">#${contrato.id}</td></tr>
            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Arrendatario</td><td style="padding:10px 0;font-weight:600;">${contrato.arrendatarioNombre}</td></tr>
            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Propiedad</td><td style="padding:10px 0;font-weight:600;">${contrato.propiedadTitulo}</td></tr>
            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Valor mensual</td><td style="padding:10px 0;color:#1B3A6B;font-weight:700;">${valor}</td></tr>
            <tr><td style="padding:10px 0;color:#6b7280;">Vence el</td><td style="padding:10px 0;color:#dc2626;font-weight:700;">${fechaFormateada}</td></tr>
          </table>
          <p style="margin-top:20px;color:#9ca3af;font-size:12px;border-top:1px solid #f3f4f6;padding-top:16px;">Sistema HMR — Ingresa al panel para gestionar este contrato.</p>
        </div>
      </div>`;

    await this.transporter.sendMail({
      from: this.from, to: this.destino,
      subject: `⚠️ Contrato #${contrato.id} vence en 3 meses — ${contrato.arrendatarioNombre}`,
      html,
    });
    this.logger.log(`✅ Alerta contrato #${contrato.id} enviada`);
  }
}