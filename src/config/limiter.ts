import rateLimit from "express-rate-limit";


const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 50,
  standardHeaders: false,
});


export default limiter;