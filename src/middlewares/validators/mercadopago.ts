import { header, query } from "express-validator";


export function paymentWebhookValidation() {
  return [
    query('data.id').exists(),
    header(['x-signature', 'x-request-id']).exists(),
  ]
}