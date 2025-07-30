import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { CreatePublicParticipanteRequest } from "../middlewares/validators/carrera";
import { Participante } from "../entities/Participante.entity";
import { Boleto } from "../entities/Boleto.entity";
import orm from "../config/db";
import { assignBoletos, calculateFees, processDonacionCarrera, registerParticipantes, registerPayerParticipante, roundToTwo, assignBoletosToParticipantes as assignAndSendBoletosToPayer, updateStatusOfRegistroWithPayment } from "../services/carreraService";
import logger from "../config/logger";
import { Registro } from "../entities/Registro.entity";



export async function registerParticipantesPublic(req: Request, res: Response, _: NextFunction) {
  const { main, extra = [], payment } = matchedData(req) as CreatePublicParticipanteRequest;
  // TODO: validate user has not use its email to register themselves
  const grossAmount = (extra.length + 1) * 350;
  const fees = calculateFees(grossAmount);
  const total = roundToTwo(grossAmount + fees);

  await orm.em.begin();
  try {
    const payer = registerPayerParticipante(main);
    const registro = new Registro(payer);
    orm.em.persist(registro);

    payer.registro = registro;
    await orm.em.flush()

    registerParticipantes(extra, registro.id);

    const paymentResult = await processDonacionCarrera({
      ...payment,
      total,
      email: main.correo,
      firstName: main.nombre,
      lastName: main.apellido,
      registroId: registro.id
    });

    await orm.em.commit();
    return res.status(200).json(paymentResult)
  } catch (err) {
    logger.error(err)
    await orm.em.rollback();
    throw new Error(`Error al registrar participante${extra.length > 0 ? ' (s)' : ''}`)
  }
}


export async function processPaymentUpdate(req: Request, res: Response, _: NextFunction) {
  const { action } = req.body;
  const { data } = matchedData(req);
  const { id: paymentId } = data;

  if (action !== 'payment.updated') {
    logger.info('unhandle webhook event', req.body);
    return res.sendStatus(200); // sending OK to avoid MP sending the webhook request again
  }

  const { registro, payment } = await updateStatusOfRegistroWithPayment(paymentId);
  if (registro.status !== 'paid') {
    logger.warn({
      message: 'registro had an invalid payment state',
      paymentReason: `${payment.status}: ${payment.status_detail}`
    })
    return res.sendStatus(200); // sending OK to avoid MP sending the webhook request again
  }
  
  await assignAndSendBoletosToPayer(registro);

  return res.status(200).json({
    message: `Boletos enviados a ${registro.payer.correo}`
  })
}