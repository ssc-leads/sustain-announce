import { formSchema } from "@/lib/formSchema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { kv } from "@vercel/kv";
import { z } from "zod";

export const submissionsRouter = createTRPCRouter({
  // Endpoint for submitting a new event/opportunity
  submit: publicProcedure.input(formSchema).mutation(async ({ input }) => {
    // Retrieve existing submissions from the Vercel KV store
    let submissions = (await kv.get<string[]>("submissions")) || [];
    
    // Add the new submission to the array
    submissions.push(JSON.stringify(input));
    
    // Update the KV store with the new array of submissions
    await kv.set("submissions", submissions);
    
    // Return a success message
    return {
      success: true,
      message: "Submission received successfully",
    };
  }),

  // Endpoint for generating submissions for a specific date
  generateSubmissions: publicProcedure
    .input(
      z.object({
        date: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      // Retrieve all submissions from the KV store
      const allSubmissions = await kv.get<string[]>("submissions");

      // Parse and validate each submission
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

      // Filter submissions based on the input date
      const filteredSubmissions = parsedSubmissions.filter((submission) => {
        return (
          input.date >= new Date(submission.firstAnnouncementDate) &&
          input.date <= new Date(submission.lastAnnouncementDate)
        );
      });

      console.log(filteredSubmissions);

      return filteredSubmissions;
    }),

  // Endpoint for retrieving all submissions, optionally filtered by a cutoff date
  getAllSubmissions: publicProcedure
    .input(
      z
        .object({
          cutoffDate: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      // Retrieve all submissions from the KV store
      const allSubmissions = await kv.get<string[]>("submissions");
      
      // Parse and validate each submission
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

      // If a cutoff date is provided, filter submissions
      if (input?.cutoffDate) {
        const cutoffDate = new Date(input.cutoffDate);
        return parsedSubmissions.filter(
          (submission) =>
            new Date(submission.firstAnnouncementDate) > cutoffDate,
        );
      }

      return parsedSubmissions;
    }),

  // Endpoint for deleting a specific submission
  deleteSubmission: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      // Retrieve all submissions from the KV store
      let submissions = (await kv.get<string[]>("submissions")) || [];
      
      // Filter out the submission with the matching ID
      submissions = submissions.filter((submission) => {
        const parsedSubmission = formSchema.safeParse(JSON.parse(submission));
        return (
          parsedSubmission.success && parsedSubmission.data.id !== input.id
        );
      });
      
      console.log("filtered!: ", submissions);
      console.log("input: ", input);
      
      // Update the KV store with the filtered submissions
      await kv.set("submissions", submissions);
      
      return { success: true };
    }),
});
