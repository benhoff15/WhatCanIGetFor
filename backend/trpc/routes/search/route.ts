import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../../create-context";
import { prisma } from "@/lib/prisma";

export const searchRouter = createTRPCRouter({
  getAdventures: publicProcedure
    .input(z.object({
      budget: z.number(),
      adventureType: z.string(),
      location: z.string(),
      timeOfDay: z.string().nullable().optional(),
      groupSize: z.string().nullable().optional(),
      startDate: z.string().nullable().optional(),
      endDate: z.string().nullable().optional(),
    }))
    .query(async ({ input }) => {
      const normalizedLocation = input.location.trim().toLowerCase();
      const normalizedType = input.adventureType.toLowerCase();
      const normalizedTimeOfDay = input.timeOfDay?.toLowerCase();
      const normalizedGroupSize = input.groupSize?.toLowerCase();

      console.log("🔍 Adventure search input:");
      console.log({
        budget: input.budget,
        type: normalizedType,
        location: normalizedLocation,
        timeOfDay: normalizedTimeOfDay,
        groupSize: normalizedGroupSize,
        startDate: input.startDate,
        endDate: input.endDate,
      });

      const adventures = await prisma.adventure.findMany({
        where: {
          location: {
            contains: normalizedLocation,
            mode: "insensitive",
          },
          type: {
            equals: normalizedType,
            mode: "insensitive",
          },
          price: {
            lte: input.budget,
          },
          ...(normalizedTimeOfDay && {
            timeOfDay: {
              equals: normalizedTimeOfDay,
              mode: "insensitive",
            },
          }),
          ...(normalizedGroupSize && {
            groupSize: {
              equals: normalizedGroupSize,
              mode: "insensitive",
            },
          }),
          ...(input.startDate && input.endDate && {
            date: {
              gte: input.startDate,
              lte: input.endDate,
            },
          }),
        }
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
