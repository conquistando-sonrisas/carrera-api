declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REGISTRO_CARRERA_ACCESS_TOKEN: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_NAME: string;
      DB_PASSWORD: string;
    }
  }
}

export { }