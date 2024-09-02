import { formSchema } from "@/lib/formSchema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { kv } from "@vercel/kv";
import { z } from "zod";

let submissions: string[] = [];

export const submissionsRouter = createTRPCRouter({
  submit: publicProcedure.input(formSchema).mutation(async ({ input }) => {
    let submissions = (await kv.get<string[]>("submissions")) || [];
    submissions.push(JSON.stringify(input));
    await kv.set("submissions", submissions);
    return {
      success: true,
      message: "Submission received successfully",
    };
  }),
  generateSubmissions: publicProcedure
    .input(
      z.object({
        date: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      const allSubmissions = await kv.get<string[]>("submissions");

      const parsedSubmissions = allSubmissions
        ? allSubmissions
            .map((submission) => {
              try {
                return formSchema.parse(JSON.parse(submission));
              } catch (error) {
                return null;
              }
            })
            .filter(
              (submission): submission is z.infer<typeof formSchema> =>
                submission !== null,
            )
        : [];

      console.log(parsedSubmissions);

      const filteredSubmissions = parsedSubmissions.filter((submission) => {
        return (
          input.date >= new Date(submission.firstAnnouncementDate) &&
          input.date <= new Date(submission.lastAnnouncementDate)
        );
      });

      console.log(filteredSubmissions);

      return filteredSubmissions;
    }),
});
