import { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler<
  Req extends Request = Request,
  Res extends Response = Response
>(
  fn: (req: Req, res: Res, next: NextFunction) => any
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req as any, res as any, next)).catch(next);
  };
}
