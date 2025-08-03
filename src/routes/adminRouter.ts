import express, { NextFunction, Request, Response } from 'express'
import { requiredScopes } from 'express-oauth2-jwt-bearer';
import { getBoleto, getBoletos, getLatestRegistros, registerParticipantesPrivate } from '../controllers/adminController';
import { validatePagination } from '../middlewares/validators/pagination';
import { validator } from '../middlewares/validate';
import { createPrivateParticipantesValidation } from '../middlewares/validators/carrera';
import { param } from 'express-validator';

const adminRouter = express.Router();

adminRouter.get(
  '/boletos',
  validatePagination(),
  validator,
  getBoletos
);

adminRouter.get(
  '/registros',
  getLatestRegistros
);

adminRouter.post(
  '/participantes',
  createPrivateParticipantesValidation(),
  validator,
  requiredScopes('create:participantes'),
  registerParticipantesPrivate
);

adminRouter.get(
  '/boletos/:boletoId',
  param('boletoId').isUUID(4),
  validator,
  getBoleto
)


export default adminRouter;