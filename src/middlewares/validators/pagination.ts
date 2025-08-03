import { query } from "express-validator";



export function validatePagination() {
  return [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('page').default(1),
    query('perPage').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('perPage').default(25)
  ]
}