import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { CreatePublicParticipanteRequest } from "../middlewares/validators/carrera";
import { Participante } from "../entities/Participante.entity";
import { Boleto } from "../entities/Boleto.entity";
import orm from "../config/db";
import { calculateFees, processDonacionCarrera, registerParticipantes, registerPayerParticipante, roundToTwo } from "../services/carreraService";
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

    // procesamiento de pagos
    const paymentResult = await processDonacionCarrera({
      ...payment,
      total,
      email: main.correo,
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


export async function processBoletoDonation(req: Request, res: Response, _: NextFunction) {
  console.log('got to controller')
  // asignar boletos
  console.log('matchedData', matchedData(req))
  console.log('query', req.query)
  console.log('body', req.body)
  console.log('headers', req.headers)
  res.status(200).json({ message: 'it worked' })
  return;
}