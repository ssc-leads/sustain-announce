"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const EVENT_CATEGORIES = [
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

const formSchema = z
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

const SustainAnnounceShared = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formSchema.parse({
      name: "John Doe",
      email: "johndoe@example.com",
      organizingGroup: "Sustainability Club",
      typeOfSubmission: "opportunityWithoutDeadline",
      eventTitle: "Green Campus Initiative",
      shortTitle: "Green Campus",
      url: "https://example.com/green-campus",
      mainContactEmail: "contact@sustainabilityclub.com",
      shortDescription: "Join us for a campus-wide sustainability event!",
      firstAnnouncementDate: "2023-09-01",
      lastAnnouncementDate: "2023-09-15",
      advertiseOnSSCIntsa: "Yes, please share on your story",
      additionalComments: "We'd appreciate any help with promotion",
      exceedsTwoWeeks: false,
    }),
  });

  const typeOfSubmission = form.watch("typeOfSubmission");
  const showAdditionalFields =
    typeOfSubmission === "event" ||
    typeOfSubmission === "opportunityWithDeadline";

  const eventCategory = form.watch("eventCategory");
  const allDay = form.watch("eventOptions.isAllDayEvent");
  const isRecurringEvent = form.watch("eventOptions.isRecurringEvent");

  const noTime =
    eventCategory === "Scholarship/Fellowship Deadline" ||
    eventCategory === "Job/Internship/Research Opportunity (Paid)" ||
    eventCategory === "Volunteer Opportunity (Unpaid)" ||
    eventCategory === "Leadership Opportunity" ||
    eventCategory === "Other Application Deadline" ||
    eventCategory === "Announcement with a Deadline" ||
    allDay;

  const onSubmit = (values: z.infer<typeof formSchema>) => {};

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          MIT Sustain Announce: Sustainability Events and Opportunity Newsletter
          Submission
        </CardTitle>
        <CardDescription>
          Sustain Announce is a weekly digest of events, activities, and
          opportunities related to sustainability at MIT, especially those aimed
          towards the student body. Sustain Announce is sent out on Monday of
          each week (except Institute holidays and breaks). Submissions must be
          made before Sunday at noon (Eastern Time) to be included in the next
          day's Announce. Questions, feedback, and special requests can be
          directed to the Student Sustainability Coalition (SSC) Co-Leads at
          ssc-leads@mit.edu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Your email" {...field} />
                  </FormControl>
                  <FormDescription>
                    A confirmation email will be sent to this email address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organizingGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Organizing Group</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of Organizing Group" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeOfSubmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Submission</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type of submission" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="opportunityWithDeadline">
                        Opportunity/announcement with a deadline
                      </SelectItem>
                      <SelectItem value="opportunityWithoutDeadline">
                        Opportunity/announcement without a deadline
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event/Announcement Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event/announcement title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short title</FormLabel>
                  <FormControl>
                    <Input placeholder="Short title" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the hyperlinked label that goes in the table of
                    contents at the top of the Anno. Make it catchy! (If you
                    leave this field empty, the Short title will be your Event
                    title truncated to 45 characters.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://" {...field} />
                  </FormControl>
                  <FormDescription>
                    This can be the URL of a signup form, facebook event, etc.
                    The URL must have an http:// (or preferably https://) in
                    front.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mainContactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Contact Email*</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="blah@mit.edu" {...field} />
                  </FormControl>
                  <FormDescription>
                    This should be the organizer or group responsible for the
                    announcement/opportunity
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short description</FormLabel>
                  <FormControl>
                    <Input placeholder="Short description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstAnnouncementDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Announcement Date*</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the date from which your announcement should be
                    active. It will be included from the Monday following this
                    date.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastAnnouncementDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Announcement Date*</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the last date your announcement will be active.
                    Unless there is a compelling reason, each submission will
                    run for two consecutive digests only. Note: if your event
                    ends before 9am on a Monday, do not include that Monday in
                    the range.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="advertiseOnSSCIntsa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Advertise on SSC Instagram (@mitsustainability)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Only fill this out if you want us to advertise this
                    submission on the SSC Instagram through either a post (only
                    with a compelling reason&mdash;we can create collaborative
                    posts with your group's account as well) or by sharing a
                    link/graphic on our story. Please include an editable Canva
                    link or downloadable link (Google Drive, Dropbox, etc) of
                    the graphic you want posted, when you want it posted and
                    caption/accounts to tag, and include any other details
                    below. We post to our Instagram at our discretion, so not
                    all requests will be honored.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments for Approval</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is a good place to add any additional context, such as
                    reasons for why your submission should run for longer than
                    two consecutive weeks (if applicable).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showAdditionalFields && (
              <>
                <FormField
                  control={form.control}
                  name="physicalLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Physical Location or Meeting Link (if fully virtual)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Please include room number if applicable"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventOptions"
                  render={() => (
                    <FormItem>
                      <FormLabel>Event/Opportunity Options</FormLabel>
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="eventOptions.addToCalendar"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Add to the MIT Sustainability Opportunities
                                  calendar
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="eventOptions.isAllDayEvent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>This is an all-day event</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="eventOptions.isRecurringEvent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>This is a recurring event</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an event category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EVENT_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the category that best describes your event.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SustainAnnounceShared;
