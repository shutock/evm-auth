import { type User } from "@/lib";
import { type Address } from "viem";

const SECRET = process.env.DATABASE_SECRET_KEY;

type Set = (key: Address, value: User) => Promise<{ isSuccess: boolean }>;
type Get = (key: Address) => Promise<User | null>;
type Update = (
  key: Address,
  value: Partial<User>
) => Promise<{ isSuccess: boolean }>;
type Delete = (key: Address) => Promise<{ isSuccess: boolean }>;

type Database = (url: URL) => {
  get: Get;
  set: Set;
  update: Update;
  delete: Delete;
};

export const database: Database = ({ origin }) => {
  if (!SECRET) throw new Error("Database secret key is required");

  return {
    get: async (key) => {
      const res = await fetch(`${origin}/api/database/${key}`, {
        headers: {
          "Secret-Key": SECRET,
        },
      });

      if (!res.ok) throw new Error("An error occurred");

      return res.json();
    },
    set: async (key, value) => {
      const res = await fetch(`${origin}/api/database/${key}`, {
        method: "POST",
        headers: {
          "Secret-Key": SECRET,
        },
        body: JSON.stringify(value),
      });

      if (!res.ok) throw new Error("An error occurred");

      return { isSuccess: true };
    },
    update: async (key, value) => {
      const res = await fetch(`${origin}/api/database/${key}`, {
        method: "PATCH",
        headers: {
          "Secret-Key": SECRET,
        },
        body: JSON.stringify(value),
      });

      if (!res.ok) throw new Error("An error occurred");

      return { isSuccess: true };
    },

    delete: async (key) => {
      const res = await fetch(`${origin}/api/database/${key}`, {
        method: "DELETE",
        headers: {
          "Secret-Key": SECRET,
        },
      });

      if (!res.ok) throw new Error("An error occurred");

      return { isSuccess: true };
    },
  };
};
