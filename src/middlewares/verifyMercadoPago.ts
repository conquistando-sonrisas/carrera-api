import { NextFunction, Request, Response } from "express";
import crypto from 'crypto'

export async function verifySignature(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers['x-signature'];
  const requestId = req.headers['x-request-id'];

  if (!requestId || !signature) {
    return res.sendStatus(403)
  }

  const [ts, v1] = (signature as string).split(',')
  const timestamp = ts.split('=')[1].trim();
  const hash = v1.split('=')[1].trim();
  const dataId = req.query['data.id'];

  const manifest = `id:${dataId};request-id:${requestId};ts=${timestamp}`;

  const sha = crypto
    .createHmac('sha256', process.env.CARRERA_PAGO_KEY)
    .update(manifest)
    .digest('hex');

  console.log('comparing sha and hash', sha, hash);

  if (sha === hash) {
    return next();
  }

  return res.sendStatus(403)
}