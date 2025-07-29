import express, { NextFunction, Request, Response } from 'express'
import { createPublicParticipantesValidation } from '../middlewares/validators/carrera';
import { validator } from '../middlewares/validate';
import { processPaymentUpdate, registerParticipantesPublic } from '../controllers/carreraController';
import { paymentWebhookValidation } from '../middlewares/validators/mercadopago';
import { verifySignature } from '../middlewares/verifyMercadoPago';

const carreraRouter = express.Router();

carreraRouter.post('/participantes', 
  createPublicParticipantesValidation(),
  validator,
  registerParticipantesPublic  
)


carreraRouter.post('/webhook',
  paymentWebhookValidation(),
  validator,
  verifySignature,
  processPaymentUpdate
)


export default carreraRouter