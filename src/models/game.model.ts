export type Platform = "PC" | "PS5" | "Xbox" | "Switch" | "Mobile";
export type Availability =
  | "available"
  | "coming_soon"
  | "early_access"
  | "delisted";

export interface Game {
  id: string;
  slug: string;
  title: string;
  developer: string;
  publisher: string;

  platforms: Platform[]; // Reusable
  genres: string[];
  tags: string[];

  releaseDate: string;
  isPreOrder?: boolean;
  availability: Availability; // Reusable

  price: number;
  currency: String;

  thumbnailUrl: string;
  screenshots?: string[];
  description: string;

  stock: number; // Added for the Cart MVP logic
}
