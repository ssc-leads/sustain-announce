import { formSchema } from "@/lib/formSchema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
// import { kv } from "@vercel/kv";
import { z } from "zod";

let submissions: string[] = [];

export const submissionsRouter = createTRPCRouter({
  submit: publicProcedure.input(formSchema).mutation(async ({ input }) => {
    const formValueString = JSON.stringify(input);
    // let submissions = (await kv.get<string[]>("submissions")) || [];
    submissions.push(formValueString);
    // await kv.set("submissions",submissions);
    return {
      success: true,
      message: "Submission received successfully",
    };
  }),
  getAllSubmissions: publicProcedure.input(z.object({
    date: z.date(),
  })).query(async ({ input }) => {
    const date = new Date();
    console.log(date);
    // const submissions = (await kv.get<string[]>("submissions")) || [];
    const parsedSubmissions = submissions.map((submission) => {
      const parsedSubmission = formSchema.safeParse(JSON.parse(submission));
      return parsedSubmission.success ? parsedSubmission.data : null;
    });

    console.log("Parsed submissions:", parsedSubmissions);

    return parsedSubmissions.filter(
      (submission): submission is NonNullable<typeof submission> => {
        if (submission === null) {
          return false;
        }
        const firstDate = new Date(submission.firstAnnouncementDate).setHours(
          0,
          0,
          0,
          0,
        );
        const lastDate = new Date(submission.lastAnnouncementDate).setHours(
          0,
          0,
          0,
          0,
        );
        const currentDate = date.setHours(0, 0, 0, 0);
        const isValid = firstDate <= currentDate && lastDate >= currentDate;
        if (!isValid) {
          console.log(
            `Filtered out: First: ${new Date(firstDate).toISOString()}, Last: ${new Date(lastDate).toISOString()}, Current: ${new Date(currentDate).toISOString()}`,
          );
        }
        return isValid;
      },
    );
  }),
});
