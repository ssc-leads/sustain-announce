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

const basicFormSchemaObject = z.object({
  id: z.string(),
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
  advertiseOnSSCInsta: z.string().optional(),
  additionalComments: z.string().optional(),
  exceedsTwoWeeks: z.boolean().optional(),

  physicalLocation: z.string().optional(),
  eventOptions: z
    .object({
      addToCalendar: z.boolean().optional(),
      isAllDayEvent: z.boolean().optional(),
      isRecurringEvent: z.boolean().optional(),
      eventStartDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
          message: "Date must be in YYYY-MM-DD format",
        })
        .optional(),
      eventStartTime: z
        .string()
        .regex(/^\d{2}:\d{2}([AP]M)?$/, {
          message: "Time must be in HH:MM or HH:MM AM/PM format (Eastern Time)",
        })
        .optional(),
      eventEndDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
          message: "Date must be in YYYY-MM-DD format",
        })
        .optional(),
      eventEndTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/, {
          message: "Time must be in HH:MM format (Eastern Time)",
        })
        .optional(),
      recurringEventDetails: z.string().optional(),
    })
    .optional(),
  eventCategory: z.enum(EVENT_CATEGORIES).optional(),
});
export const formSchema = basicFormSchemaObject
  .refine(
    (data) => {
      if (data.typeOfSubmission === "event") {
        return data.physicalLocation !== undefined;
      }
      return true;
    },
    {
      message: "Physical location or meeting location is required for events.",
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
        "Event/opportunity category is required for events and opportunities with deadlines.",
      path: ["eventCategory"],
    },
  )
  .refine(
    (data) => {
      if (
        data.eventOptions?.isRecurringEvent &&
        !data.eventOptions.recurringEventDetails
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Details for recurring events are required when 'Is Recurring Event' is selected.",
      path: ["eventOptions", "recurringEventDetails"],
    },
  )
  .refine(
    (data) => {
      if (
        data.typeOfSubmission === "event" ||
        data.typeOfSubmission === "opportunityWithDeadline"
      ) {
        return data.eventOptions?.eventStartDate !== undefined;
      }
      return true;
    },
    {
      message:
        "Event start date/deadline is required for all events or opportunities with a deadline.",
      path: ["eventOptions", "eventStartDate"],
    },
  )

  .refine(
    (data) => {
      if (
        data.typeOfSubmission === "event" &&
        !data.eventOptions?.isAllDayEvent
      ) {
        return (
          data.eventOptions?.eventStartTime !== undefined &&
          data.eventOptions?.eventEndDate !== undefined &&
          data.eventOptions?.eventEndTime !== undefined
        );
      }
      return true;
    },
    {
      message:
        "Event start time, end date, and end time are required for non-all-day events. End dates for all day events are one day after the start date.",
      path: ["eventOptions", "eventStartTime", "eventEndDate", "eventEndTime"],
    },
  )
  .refine(
    (data) => {
      if (
        (data.typeOfSubmission === "event" ||
          data.typeOfSubmission === "opportunityWithDeadline") &&
        data.eventOptions?.isAllDayEvent
      ) {
        const startDate = new Date(
          data.eventOptions.eventStartDate + "T00:00:00-05:00",
        );
        startDate.setDate(startDate.getDate() + 1);
        data.eventOptions.eventEndDate = startDate.toISOString().split("T")[0];
      }
      return true;
    },
    {
      message:
        "Calendar end date set to one day after start date for all-day events or opportunities with a deadline.",
      path: ["eventEndDate"],
    },
  )
  .refine(
    (data) => {
      if (
        data.typeOfSubmission === "event" &&
        !data.eventOptions?.isAllDayEvent
      ) {
        const startTime = new Date(
          data.eventOptions?.eventStartDate +
            "T" +
            data.eventOptions?.eventStartTime,
        );
        const endTime = new Date(
          data.eventOptions?.eventEndDate +
            "T" +
            data.eventOptions?.eventEndTime,
        );
        console.log(startTime, endTime);
        console.log("startTime < endTime", startTime < endTime);
        return startTime < endTime;
      }
      return true;
    },
    {
      message:
        "Event start time and date must be before the event end time and date.",
      path: ["eventStartDate"],
    },
  )
  .transform((data) => {
    if (!data.shortTitle && data.eventTitle) {
      data.shortTitle = data.eventTitle.substring(0, 45);
    }
    return data;
  })
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
