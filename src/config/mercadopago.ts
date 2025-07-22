import MercadoPagoConfig from "mercadopago";


export const carreraApiClient = new MercadoPagoConfig({
  accessToken: process.env.REGISTRO_CARRERA_ACCESS_TOKEN,
  options: {
    timeout: 5000
  }
})

