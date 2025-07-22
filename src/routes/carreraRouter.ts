import express, { NextFunction, Request, Response } from 'express'
import { createPublicParticipantesValidation } from '../middlewares/validators/carrera';
import { validator } from '../middlewares/validate';
import { registerParticipantesPublic } from '../controllers/carreraController';

const carreraRouter = express.Router();

carreraRouter.post('/participantes', 
  createPublicParticipantesValidation(),
  validator,
  registerParticipantesPublic  
)


export default carreraRouter