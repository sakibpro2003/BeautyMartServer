// import { error } from "console";
import { NextFunction, Request, Response } from "express";

const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // console.log(error)
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
