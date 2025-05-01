import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export default publicProcedure
  .input(z.object({ name: z.string().optional() }))
  .query(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/db/search");
      const json = await response.json();

      if (!response.ok) throw new Error(json.error || "Failed to fetch");

      return {
        adventures: json.data,
        fetchedAt: new Date(),
      };
    } catch (err) {
      console.error("Failed to fetch adventures:", err);
      return {
        adventures: [],
        error: "Unable to fetch adventures",
      };
    }
  });
