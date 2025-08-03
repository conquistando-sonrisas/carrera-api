import { NextFunction, Request, Response } from "express";
import orm from "../config/db";
import { Registro } from "../entities/Registro.entity";
import { Boleto } from "../entities/Boleto.entity";
import { matchedData } from "express-validator";
import { assignAndSendBoletosToPayer, assignBoletos, registerParticipantes, registerPayerParticipante } from "../services/carreraService";
import { CreatePrivateParticipanteRequest } from "../middlewares/validators/carrera";
import logger from "../config/logger";



export async function getLatestRegistros(req: Request, res: Response, _: NextFunction) {

  const [registros, total] = await orm.em.findAndCount(Registro, {}, {
    offset: 0, // page
    limit: 10, // perpage
    orderBy: {
      createdAt: 'desc'
    },
    populate: ['payer', 'boletosCount'],

  });

  return res.status(200).json({
    data: registros,
    total
  })
}


export async function getBoletos(req: Request, res: Response, _: NextFunction) {
  const { perPage, page } = matchedData(req);

  const [boletos, total] = await orm.em.findAndCount(Boleto, {}, {
    offset: (page - 1) * perPage,
    limit: perPage,
    populate: ['participante', 'participante.registro']
  })

  return res.status(200).json({ data: boletos, total, page, perPage })
}


export async function registerParticipantesPrivate(req: Request, res: Response, _: NextFunction) {
  const { main, extra = [], ...matched } = matchedData(req) as CreatePrivateParticipanteRequest;
  console.log(req.auth)
  await orm.em.begin()

  try {
    const payer = registerPayerParticipante(main);

    orm.em.flush();

    const registro = new Registro(payer, 'example@email.com');
    registro.status = matched.status;
    registro.type = 'private'
    orm.em.persist(registro);

    payer.registro = registro;

    await orm.em.flush()

    registerParticipantes(extra, registro.id);

    let boletos: Boleto[] = [];

    if (registro.status === 'paid') {
      await assignAndSendBoletosToPayer(registro);
    } else {
      boletos = await assignBoletos(registro.id, { createdBy: 'email@example.com' });
    }

    await orm.em.commit()
    return res.status(200).json({ data: boletos })
  } catch (err) {
    logger.error(err)
    await orm.em.rollback();
    return res.sendStatus(500);
  }

}


export async function getBoleto(req: Request, res: Response, _: NextFunction) {
  const { boletoId } = matchedData(req);

  const boleto = await orm.em.findOneOrFail(Boleto, {
    id: boletoId,
  }, {
    populate: ['participante', 'participante.registro']
  })

  return res.status(200).json({ data: boleto })
}