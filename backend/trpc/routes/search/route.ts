import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../../create-context";
import { prisma } from "@/lib/prisma";

export const searchRouter = createTRPCRouter({
  getAdventures: publicProcedure
    .input(z.object({
      budget: z.number(),
      adventureType: z.string(),
      location: z.string(),
    }))
    .query(async ({ input }) => {
      const normalizedLocation = input.location.trim().toLowerCase();
      const normalizedType = input.adventureType.toLowerCase();

      console.log("🔍 Adventure search input:");
      console.log({
        budget: input.budget,
        type: normalizedType,
        location: normalizedLocation,
      });

      const adventures = await prisma.adventure.findMany({
        where: {
          type: {
            equals: normalizedType,
            mode: "insensitive",
          },
          location: {
            contains: normalizedLocation,
            mode: "insensitive",
          },
          price: {
            lte: input.budget,
          },
        },
      });

      console.log(`✅ ${adventures.length} adventure(s) found.`);

      return adventures.map((adv: any) => ({
        ...adv,
        details: typeof adv.details === "string"
          ? adv.details.split(",").map((d: string) => d.trim()).filter(Boolean)
          : adv.details,
      }));
    }),
});
