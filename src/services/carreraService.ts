import { Payment } from "mercadopago";
import { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";
import { carreraApiClient } from "../config/mercadopago";

type DonacionUnicaArgs = {
  transaction_amount: number,
  email: string,
} & Required<Pick<PaymentCreateRequest, 'token' | 'payment_method_id' | 'issuer_id'>>


const carreraDonacion = new Payment(carreraApiClient);


export const processDonacionCarrera = async (args: DonacionUnicaArgs & { boletoId: string }) => {
  const res = await carreraDonacion.create({
    body: {
      transaction_amount: args.transaction_amount,
      token: args.token,
      description: 'Registro a carrera 5k Conquistando Mil Sonrisas',
      installments: 1,
      payment_method_id: args.payment_method_id,
      issuer_id: args.issuer_id,
      external_reference: args.boletoId,
      payer: {
        email: args.email
      },
      notification_url: process.env.NOTIFICATION_URL,
      three_d_secure_mode: 'optional'
    },
  });

  return {
    paymentId: res.id,
    threeDsInfo: res.three_ds_info
      ? {
        externalResourceURL: res.three_ds_info.external_resource_url,
        creq: res.three_ds_info.creq
      }
      : null
  };
}

export const roundToTwo = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;

export const calculateFees = (grossAmount: number) => {
  // se toma 2.89% de tarifas con base en documentacion de Mercado Libre Solidario https://www.mercadolibre.com.mx/ayuda/4942
  return (grossAmount / 0.966476) - grossAmount;
}