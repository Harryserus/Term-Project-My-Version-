import fs from "fs";
import path from "path";
import { Game, Platform, Availability } from "../models/game.model";
import { Order } from "../models/order.model";
import { Request, Response } from "express";

const dbpath = path.join(__dirname, "..", "../data", "database.json");

// Helper to read/write
export const getData = () => JSON.parse(fs.readFileSync(dbpath, "utf-8"));
const saveData = (data: any) =>
  fs.writeFileSync(dbpath, JSON.stringify(data, null, 2));

const stringToArray = (str: string): string[] => {
  return str
    ? str
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
};

// 1. Get All Games
export const getAllGames = (): Game[] => {
  const data = getData();
  return data.games[0].games;
};
// get one game product
export const getOneProduct = (req: Request, res: Response) => {
  const gameid = req.params.id;
  const games: Game[] = getData().games[0].games;
  const game = games.find((g) => g.id == gameid);
  return game;
};
// 2. Add Product
export const addProduct = (req: Request, res: Response) => {
  const db = getData();
  const gamesList = db.games[0].games;

  // Ensure platforms is an array even if one checkbox is ticked
  let platforms = req.body.platforms;
  if (!platforms) platforms = [];
  if (!Array.isArray(platforms)) platforms = [platforms];

  const newGame: Game = {
    id: Date.now().toString(), // Generate a real ID
    slug: req.body.title.toLowerCase().replace(/ /g, "-"),
    title: req.body.title,
    developer: req.body.developer,
    publisher: req.body.publisher,
    platforms: platforms as Platform[],
    genres: stringToArray(req.body.genres),
    tags: stringToArray(req.body.tags),
    releaseDate: req.body.releaseDate,
    availability: (req.body.availability as Availability) || "available",
    price: parseFloat(req.body.price),
    currency: "$",
    thumbnailUrl: req.body.thumbnailUrl || "",
    description: req.body.description,
    stock: parseInt(req.body.stock),
    isPreOrder: req.body.isPreOrder === "on",
  };

  gamesList.push(newGame);
  saveData(db); // Actually write to file
  res.redirect("/admin");
};

// 3. Update Product
export const updateProduct = (req: Request, res: Response) => {
  const db = getData();
  const gameId = req.params.id;
  const gamesList = db.games[0].games;

  const index = gamesList.findIndex((g: Game) => g.id === gameId);

  if (index !== -1) {
    let platforms = req.body.platforms;
    if (!platforms) platforms = [];
    if (!Array.isArray(platforms)) platforms = [platforms];

    gamesList[index] = {
      ...gamesList[index], // Keep existing ID/Slug if you want
      ...req.body,
      platforms: platforms as Platform[],
      genres: stringToArray(req.body.genres),
      tags: stringToArray(req.body.tags),
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock),
      isPreOrder: req.body.isPreOrder === "on",
    };

    saveData(db);
  }
  res.redirect("/admin");
};

// 4. Delete Product
export const deleteProduct = (req: Request, res: Response) => {
  const db = getData();
  const gameId = req.params.id;
  db.games[0].games = db.games[0].games.filter((g: Game) => g.id !== gameId);

  saveData(db);
  res.redirect("/admin");
};

export const getAllOrders = () => getData().orders;
export const getAdmin = () => getData().users[1];
// order updates
export const updateOrders = (req: Request, res: Response) => {
  const { orderIds, status } = req.body; // e.g., ["101", "102"], "paid"
  const db = getData();

  // Update the status for matching IDs
  db.orders.forEach((order: any) => {
    if (orderIds.includes(order.id)) {
      order.status = status;
    }
  });

  saveData(db);
  res.sendStatus(200);
};
