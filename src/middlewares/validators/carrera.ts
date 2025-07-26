import { body } from "express-validator";


export const createPublicParticipantesValidation = () => {
  return [

    body(['extra.*.nombre', 'main.nombre']).notEmpty().trim(),
    body(['extra.*.edad', 'main.edad']).isInt().toInt(),
    body(['extra.*.talla', 'main.talla']).isIn(['infantil', 'xs', 's', 'm', 'g', 'xg']),
    body(['extra.*.sexo', 'main.sexo']).isIn(['mujer', 'hombre']),

    body('main.correo').isEmail().optional(),
    body('main.telefono').isLength({ max: 14, min: 14 }).trim().optional(),

    body(`payment.transaction_amount`).isFloat().toFloat(),
    body(`payment.issuer_id`).isInt().toInt(),
    body(`payment.payer.email`).trim().notEmpty().isEmail(),
    body(`payment.token`).trim().notEmpty(),
    body(`payment.payment_method_id`).trim().notEmpty(),
  ]
}


export interface CreatePublicParticipanteRequest {
  extra: ParticipanteExtra[];
  main: MainParticipante;
  payment: PaymentBase

}


export interface ParticipanteExtra {
  nombre: string;
  edad: number;
  talla: 'infantil' | 'xs' | 's' | 'm' | 'g' | 'xg';
  sexo: 'mujer' | 'hombre';
}


export interface MainParticipante extends ParticipanteExtra {
  correo: string;
  telefono: string;
}


export interface PaymentBase {
  transaction_amount: number;
  issuer_id: number;
  payer: {
    email: string;
  };
  token: string;
  payment_method_id: string;
  paymentType: string;
}