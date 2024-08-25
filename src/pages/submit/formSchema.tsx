import { z } from "zod";
export const EVENT_CATEGORIES = [
  "Conference",
  "Speaker Event",
  "Hackathon/Pitch Event",
  "Career/Activities Fair",
  "Workshop",
  "Small Group Event/Meeting",
  "Social/Networking Event",
  "Info Session",
  "Webinar (Online Only)",
  "Scholarship/Fellowship Deadline",
  "Job/Internship/Research Opportunity (Paid)",
  "Volunteer Opportunity (Unpaid)",
  "Leadership Opportunity",
  "Other Application Deadline",
  "Announcement with a Deadline",
] as const;

export const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    organizingGroup: z
      .string()
      .min(2, { message: "Organizing group is required." }),
    typeOfSubmission: z.enum([
      "event",
      "opportunityWithDeadline",
      "opportunityWithoutDeadline",
    ]),
    eventTitle: z.string().min(2, { message: "Event title is required." }),
    shortTitle: z.string().optional(),
    url: z.string().url({ message: "Invalid URL." }),
    mainContactEmail: z.string().email({ message: "Invalid email address." }),
    shortDescription: z.string().min(10, {
      message: "Short description must be at least 10 characters.",
    }),
    firstAnnouncementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date must be in YYYY-MM-DD format",
    }),
    lastAnnouncementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date must be in YYYY-MM-DD format",
    }),
    advertiseOnSSCIntsa: z.string().optional(),
    additionalComments: z.string().optional(),
    exceedsTwoWeeks: z.boolean().optional(),

    physicalLocation: z.string().optional(),
    eventOptions: z
      .object({
        addToCalendar: z.boolean().optional(),
        isAllDayEvent: z.boolean().optional(),
        isRecurringEvent: z.boolean().optional(),
      })
      .optional(),
    eventCategory: z.enum(EVENT_CATEGORIES).optional(),
  })

  .refine(
    (data) => {
      if (
        data.typeOfSubmission === "event" ||
        data.typeOfSubmission === "opportunityWithDeadline"
      ) {
        return data.physicalLocation !== undefined;
      }
      return true;
    },
    {
      message:
        "Physical location is required for events and opportunities with deadlines.",
      path: ["physicalLocation"],
    },
  )
  .refine(
    (data) => {
      if (
        data.typeOfSubmission === "event" ||
        data.typeOfSubmission === "opportunityWithDeadline"
      ) {
        return data.eventCategory !== undefined;
      }
      return true;
    },
    {
      message:
        "Event category is required for events and opportunities with deadlines.",
      path: ["eventCategory"],
    },
  )
  .refine(
    (data) => {
      const firstDate = new Date(
        data.firstAnnouncementDate + "T12:00:00-05:00",
      );
      const lastDate = new Date(data.lastAnnouncementDate + "T12:00:00-05:00");

      // Function to get the next Monday
      const getNextMonday = (date: Date) => {
        const d = new Date(date);
        d.setDate(d.getDate() + ((7 - d.getDay() + 1) % 7 || 7));
        return d;
      };

      // Get the first Monday on or after the first announcement date
      const firstMonday =
        firstDate.getDay() === 1 ? firstDate : getNextMonday(firstDate);

      // Get the third Monday (two weeks after the first Monday)
      const thirdMonday = new Date(firstMonday);
      thirdMonday.setDate(thirdMonday.getDate() + 14);

      // Check if the last announcement date is after the third Monday
      const exceedsTwoConsecutiveMondays = lastDate >= thirdMonday;

      // Set the exceedsTwoWeeks flag
      data.exceedsTwoWeeks = exceedsTwoConsecutiveMondays;

      // If it exceeds and there are no additional comments, return false
      if (exceedsTwoConsecutiveMondays && !data.additionalComments) {
        return false;
      }

      return true;
    },
    {
      message:
        "For periods longer than 2 weeks, please explain why in the Additional Comments for Approval.",
      path: ["lastAnnouncementDate"],
    },
  );
