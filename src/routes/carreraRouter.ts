import express from 'express'
import { createPublicParticipantesValidation } from '../middlewares/validators/carrera';
import { validator } from '../middlewares/validate';

const carreraRouter = express.Router();

carreraRouter.post('/participantes', 
  createPublicParticipantesValidation(),
  validator,
  
)


export default carreraRouter