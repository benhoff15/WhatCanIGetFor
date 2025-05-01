import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../../create-context";
import { prisma } from "@/lib/prisma"; // Prisma client
import { Adventure } from "@prisma/client"; // Optional: if you want to type responses

export const searchRouter = createTRPCRouter({
  getAdventures: publicProcedure
    .input(z.object({
      budget: z.number(),
      adventureType: z.string(),
      location: z.string(),
    }))
    .query(async ({ input }) => {
      const adventures = await prisma.adventure.findMany({
        where: {
          type: input.adventureType,
          location: {
            contains: input.location
          },
          price: {
            lte: input.budget,
          },
        },
      });

      // Convert comma-separated `details` string to array
      return adventures.map((adv) => ({
        ...adv,
        details: adv.details.split(", ").filter(Boolean),
      }));
    }),
});
