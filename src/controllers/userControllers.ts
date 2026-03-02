import { Request, Response } from "express";
import { getData } from "../services/util";
import { User } from "../models/user.model";
export const loadHome = (req: Request, res: Response) => {
  const error =
    req.query.q === "invalid" ? "Invalid username or password" : null;

  res.render("landing-page", { error });
};
export const loginController = (req: Request, res: Response) => {
  const seedUsers = getData().users;
  const username = (req.body.username ?? "").toString().trim();
  const password = (req.body.password ?? "").toString();
  const user = seedUsers.find(
    (u: User) => u.username === username && u.password === password,
  );
  if (!user) return res.redirect("/?q=invalid");
  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.role = user.role;
  //   route logi here
  res.redirect(user.role == "admin" ? "/admin" : "/customer");
};
export const logoutController = (req: Request, res: Response) => {
  req.session.destroy(() => res.redirect("/"));
};
