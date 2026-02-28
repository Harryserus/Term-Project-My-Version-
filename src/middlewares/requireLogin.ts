import { Request, Response, NextFunction } from "express";
export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) return res.redirect("/?q=need-login");
  next();
}

export function requireAdminCredentials(req: Request, res: Response, next: NextFunction) {
  if(req.session.role !== 'admin') return res.redirect("/customer?alert=You are not authorized to view this page.");
  next();
}
