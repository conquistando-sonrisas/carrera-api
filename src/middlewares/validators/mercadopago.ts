import { header, query } from "express-validator";


export function paymentWebhookValidation() {
  return [
    query('id').exists(),
    header(['x-signature', 'x-request-id']).exists(),
  ]
}