declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_NAME: string;
      DB_PASSWORD: string;
      
      REGISTRO_CARRERA_ACCESS_TOKEN: string;
      CARRERA_PAGO_KEY: string;
      NOTIFICATION_URL: string;
      
      MAIL_HOST: string;
      MAIL_PORT: string;
      MAIL_USER: string;
      MAIL_PASSWORD: string;

      AUTH_AUDIENCE: string;
      AUTH_ISSUER_BASE_URL: string;
    }
  }
}

export { }