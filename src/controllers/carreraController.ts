import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { CreatePublicParticipanteRequest } from "../middlewares/validators/carrera";
import { Participante } from "../entities/Participante.entity";
import { Boleto } from "../entities/Boleto.entity";
import orm from "../config/db";
import { calculateFees, processDonacionCarrera, roundToTwo } from "../services/carreraService";
import logger from "../config/logger";



/**
 * process payment
 * - start transaction
 * 
 * - create participants
 * - if creation has error
 *   - rollback
 *   - return error
 * 
 * - create payment
 * - if payment has error
 *   - rollback 
 *   - return error
 * 
 * - commit transaction
 * 
 * - return response with payment id
*/
export async function registerParticipantesPublic(req: Request, res: Response, next: NextFunction) {
  const { main, extra = [], payment } = matchedData(req) as CreatePublicParticipanteRequest;
  const em = orm.em.fork();
  await em.begin();

  try {

    const { correo, telefono, ..._main } = main;
    const mainParticipante = new Participante(_main, { correo, telefono });

    const participantes: Participante[] = [];
    for (let i = 0; i < extra.length; i++) {
      const currentParticipante = extra[i];
      const participanteExtra = new Participante({ ...currentParticipante, registeredBy: main.correo });
      participantes.push(participanteExtra);
    }
    const allParticipantes = [mainParticipante, ...participantes];
    em.persist(allParticipantes)

    const boletos: Boleto[] = []
    for (let i = 0; i < allParticipantes.length; i++) {
      const currentParticipante = allParticipantes[i];
      const boleto = new Boleto();
      boleto.participante = currentParticipante;
      boleto.status = 'pending_payment';
      boleto.createdBy = correo;
      boletos.push(boleto)
    }
    em.persist(boletos);

    // procesamiento de pagos
    const grossAmount = allParticipantes.length * 350;
    const fees = calculateFees(grossAmount);
    const total = roundToTwo(grossAmount + fees);

    const paymentResult = await processDonacionCarrera({
      issuer_id: payment.issuer_id,
      payment_method_id: payment.payment_method_id,
      token: payment.token,
      transaction_amount: total,
      email: main.correo,
      boletoId: boletos[0].id,
    })

    res.status(200).json(paymentResult)

    await em.commit();
    return;
  } catch (err) {
    logger.error(err)
    await em.rollback();
    throw new Error('Error al registrar participante (s)')
  }
}