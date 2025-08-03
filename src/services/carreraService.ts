import { Payment } from "mercadopago";
import { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";
import { carreraApiClient } from "../config/mercadopago";
import { Participante } from "../entities/Participante.entity";
import { Boleto } from "../entities/Boleto.entity";
import orm from "../config/db";
import { MainParticipante as PayerParticipante, ParticipanteExtra } from "../middlewares/validators/carrera";
import { rel } from "@mikro-orm/core";
import { Registro } from "../entities/Registro.entity";
import QRCode from "qrcode";
import logger from "../config/logger";
import transporter from "../config/mail";
import { Attachment } from "nodemailer/lib/mailer";


type DonacionUnicaArgs = {
  total: number,
  email: string,
} & Required<Pick<PaymentCreateRequest, 'token' | 'payment_method_id' | 'issuer_id'>>


const carreraDonacion = new Payment(carreraApiClient);


export const processDonacionCarrera = async (args: DonacionUnicaArgs & { registroId: string, firstName: string, lastName: string }) => {
  const res = await carreraDonacion.create({
    body: {
      transaction_amount: args.total,
      token: args.token,
      description: `Donativo Conquistando Mil Sonrisas ${new Date().getFullYear()}.`,
      installments: 1,
      payment_method_id: args.payment_method_id,
      issuer_id: args.issuer_id,
      external_reference: args.registroId,
      statement_descriptor: 'CONQUISONRISAS CARRERA',
      payer: {
        email: args.email,
        first_name: args.firstName,
        last_name: args.lastName
      },
      three_d_secure_mode: 'optional'
    },
  });

  return {
    paymentId: res.id,
    threeDsInfo: res.three_ds_info
      ? {
        externalResourceURL: res.three_ds_info.external_resource_url,
        creq: res.three_ds_info.creq
      }
      : null
  };
}

export const roundToTwo = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;

export const calculateFees = (grossAmount: number) => {
  // se toma 2.89% de tarifas con base en documentacion de Mercado Libre Solidario https://www.mercadolibre.com.mx/ayuda/4942
  return (grossAmount / 0.966476) - grossAmount;
}


export const registerParticipantes = (participantes: ParticipanteExtra[], registroId: string) => {
  const _participantes: Participante[] = []
  for (let i = 0; i < participantes.length; i++) {
    const currentParticipante = participantes[i];
    const participanteExtra = new Participante(currentParticipante);
    participanteExtra.registro = rel(Registro, registroId);
    _participantes.push(participanteExtra);
  }
  orm.em.persist(_participantes);

  return _participantes;
}

export const registerPayerParticipante = (participante: PayerParticipante) => {
  const { correo, telefono, ...main } = participante;
  const mainParticipante = new Participante(main, { correo, telefono });
  orm.em.persist(mainParticipante)
  return mainParticipante;
}


export const assignBoletos = async (registroId: string, args: { createdBy: string }) => {
  const participantes = await orm.em.findAll(Participante, { where: { registro: { id: registroId } } });
  const boletos: Boleto[] = [];

  for (let i = 0; i < participantes.length; i++) {
    const currentParticipante = participantes[i];
    const boleto = new Boleto();
    boleto.participante = currentParticipante;
    boleto.createdBy = args.createdBy;
    boletos.push(boleto);
  }

  orm.em.persist(boletos);
  await orm.em.flush();
  return boletos;
}

export const assignAndSendBoletosToPayer = async (registro: Registro) => {
  try {
    const payer = await orm.em.findOneOrFail(Participante, { id: registro.payer.id })
    if (!payer.correo) {
      throw new Error('Payer does not have an email');
    }

    const boletos = await assignBoletos(registro.id, { createdBy: payer.correo });
    const QRs = await generateQRs(boletos);
    await sendQRsToPayer(payer.correo, payer.nombreCompleto, QRs);

  } catch (err) {
    logger.error('Error while assigning boletos', err);
  }
}


const generateQRs = async (boletos: Boleto[]) => {
  const attachments: Attachment[] = []
  for (let i = 0; i < boletos.length; i++) {
    const boleto = boletos[i];
    try {
      const qr = await QRCode.toBuffer(boleto.id, { scale: 8 });
      attachments.push({
        filename: `Boleto #${boleto.folio} - ${boleto.participante.nombreCompleto}`,
        content: qr,
        contentType: 'image/png'
      })

    } catch (err) {
      logger.error(`Error while processing QR for boleto with id ${boletos[i]}`, err)
    }
  }
  return attachments;
}


const sendQRsToPayer = async (email: string, nombre: string, QRAttachments: Attachment[]) => {
  try {
    const info = await transporter.sendMail({
      from: `"Conquistando Sonrisas A.C." <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Boletos Carrera Conquistando Mil Sonrisas',
      text: `Hola ${nombre}, aqui están tus boletos :)`,
      attachments: QRAttachments
    })
    logger.info(`Email sent to ${email} <messageId: ${info.messageId}>`);
  } catch (err) {
    logger.error('Error while sending email', err);
  }
}

export const updateStatusOfRegistroWithPayment = async (paymentId: string) => {
  const payment = await carreraDonacion.get({ id: paymentId });

  const registro = await orm.em.findOneOrFail(Registro, {
    paymentId,
    id: payment.external_reference
  });

  registro.status = payment.status === 'approved' ? 'paid' : 'failed';
  orm.em.flush();

  return { registro, payment };
}