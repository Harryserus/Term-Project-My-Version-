import fs from "fs";
import path from "path";

const dbpath = path.join(__dirname, "..", "../data", "database.json");
// Helper to read/write
export const getData = () => JSON.parse(fs.readFileSync(dbpath, "utf-8"));
export const saveData = (data: any) =>
  fs.writeFileSync(dbpath, JSON.stringify(data, null, 2));

export const stringToArray = (str: string): string[] => {
  return str
    ? str
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
};
