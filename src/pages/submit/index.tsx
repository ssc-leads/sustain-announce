"use client";

// Import necessary components and utilities
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
import { EVENT_CATEGORIES, formSchema } from "@/lib/formSchema";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

// Define a boolean flag to toggle default values
const USE_DEFAULT_VALUES = false; // set to true for testing/development, false for production
// Define default values for the form
const defaultValuesFilled: z.infer<typeof formSchema> = formSchema.parse({
  id: "",
  name: "John Doe",
  email: "johndoe@example.com",
  organizingGroup: "Example Sustainability Club",
  typeOfSubmission: "opportunityWithoutDeadline",
  eventTitle: "Green Campus Initiative",
  shortTitle: "Green Campus",
  url: "https://example.com/green-campus",
  mainContactEmail: "contact@sustainabilityclub.com",
  shortDescription: "Join us for a campus-wide sustainability event!",
  firstAnnouncementDate: "2024-08-01",
  lastAnnouncementDate: "2024-09-25",
  advertiseOnSSCInsta: "Yes, please share on your story",
  additionalComments: "We'd appreciate any help with promotion",
  exceedsTwoWeeks: false,
  eventOptions: {
    addToCalendar: true, // Set this to true by default
  },
});
const defaultValuesEmpty: z.infer<typeof formSchema> = {
  id: "",
  name: "",
  email: "",
  organizingGroup: "",
  typeOfSubmission: "event",
  eventTitle: "",
  shortTitle: "",
  url: "",
  mainContactEmail: "",
  shortDescription: "",
  firstAnnouncementDate: "",
  lastAnnouncementDate: "",
  advertiseOnSSCInsta: "",
  additionalComments: "",
  exceedsTwoWeeks: false,
};

const defaultValues = USE_DEFAULT_VALUES
  ? defaultValuesFilled
  : defaultValuesEmpty;

// Main component for the Sustain Announce submission form with default values
const SustainAnnounceShared = () => {
  // Initialize the form using react-hook-form and zod for validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  // Set up mutation for form submission
  const { mutate, status } = api.submissions.submit.useMutation();

  // Watch form fields for conditional rendering
  const typeOfSubmission = form.watch("typeOfSubmission");
  const showAdditionalFields =
    typeOfSubmission === "event" ||
    typeOfSubmission === "opportunityWithDeadline";
  const isEvent = typeOfSubmission === "event";
  const hasDeadline = typeOfSubmission === "opportunityWithDeadline";
  const eventCategory = form.watch("eventCategory");
  const allDay = form.watch("eventOptions.isAllDayEvent");
  const isRecurringEvent = form.watch("eventOptions.isRecurringEvent");


  // Log form state for debugging
  // console.log("typeOfSubmission", typeOfSubmission);
  // console.log("eventCategory", eventCategory);
  // console.log("allDay", allDay);
  // console.log("hasDeadline", hasDeadline);
  // console.log(
  //   JSON.stringify({
  //     startDate: form.watch("eventOptions.eventStartDate"),
  //     startTime: form.watch("eventOptions.eventStartTime"),
  //     endDate: form.watch("eventOptions.eventEndDate"),
  //     endTime: form.watch("eventOptions.eventEndTime"),
  //   }),
  // );

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    alert(JSON.stringify(values, null, 2));
    values["id"] = v4(); // Generate a unique ID for the submission
    mutate(values);
  };

  // Render the form
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="https://raw.githubusercontent.com/ssc-leads/sustain-announce/main/GoogleForms_SSCHeader.png"
            alt="SSC Header"
            width="400"
          />
        </div>
        <CardTitle>
          MIT Sustain Announce: Sustainability Events and Opportunity Newsletter
          Submission
        </CardTitle>
      </CardHeader>
          <CardDescription>
      <p className="font-bold mb-2">
        Sustain Announce is a weekly digest of events, activities, and opportunities related to sustainability at MIT, especially those aimed towards the student body.
      </p>
      <ul className="list-disc pl-5 mb-2 space-y-2">
        <li>
          <span className="font-bold">Submission Deadline:</span> Sustain Announce is generally sent out on Monday of each week (except Institute holidays and breaks). 
          <span className="font-bold"> Submissions must be made before Sunday at noon (Eastern Time) to be included in the next day's Announce.</span>
        </li>
        <li>
          <span className="font-bold">Contact:</span> Questions, feedback, and special requests can be directed to the Student Sustainability Coalition (SSC) Co-Leads at 
          <span className="font-bold"> ssc-leads@mit.edu</span>.
        </li>
        <li>
          <span className="font-bold">Edits:</span> Confirmation emails are not sent, so you can assume that if you click submit and receive a success message, your submission was received. If in doubt or any edits are needed, email 
          <span className="font-bold"> ssc-leads@mit.edu</span>.
        </li>
      </ul>
      </CardDescription>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
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
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Your email" {...field} />
                  </FormControl>
                  <FormDescription>
                    In case we need to reach out to you with questions about
                    your submission.
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
                  <FormLabel>Short Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Short title" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is a shorter title if needed in the email. Make it
                    catchy! (If you leave this field empty, the Short title will
                    be your Event title truncated to 45 characters.)
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
                    This can be the URL for a sign up form, organizer webpage,
                    etc. The URL must have an http:// (or preferably https://)
                    in front.
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
                    <Input
                      type="email"
                      placeholder="example@mit.edu"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This should be the organizer or group responsible for the
                    announcement/opportunity.
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
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Short description of the event or opportunity, including all info needed to participate."
                      {...field}
                    />
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
                    run for two consecutive weeks only. Note: if your event ends
                    before 9am on a Monday, do not include that Monday in the
                    range.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="advertiseOnSSCInsta"
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
                      <FormLabel>Event/Opportunity Category</FormLabel>
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
                        Choose the category that best describes your event or
                        opportunity.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {showAdditionalFields && isEvent && (
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
            )}
            {showAdditionalFields && (
              <FormField
                control={form.control}
                name="eventOptions.eventStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Start Date or Deadline</FormLabel>
                    <Input type="date" {...field} />
                    <FormDescription>
                      If this is a deadline for an opportunity or announcement,
                      or an all-day event, this field is required.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {showAdditionalFields && !hasDeadline && !allDay && (
              <>
                <FormField
                  control={form.control}
                  name="eventOptions.eventStartTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Start Time</FormLabel>
                      <Input type="time" {...field} />
                      <FormDescription>
                        All times should be in Eastern Time.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventOptions.eventEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event End Date</FormLabel>
                      <Input type="date" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventOptions.eventEndTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event End Time</FormLabel>
                      <Input type="time" {...field} />
                      <FormDescription>
                        All times should be in Eastern Time.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {isRecurringEvent && (
              <FormField
                control={form.control}
                name="eventOptions.recurringEventDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurring Event Details</FormLabel>
                    <Input {...field} />
                    <FormDescription>
                      Please add all details for the recurring date, time, and
                      location (e.g., Every Friday at 2pm in E52-451, except for
                      holidays).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" disabled={status === "pending"}>
              {status === "pending" ? "Loading..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// New component for the Sustain Announce submission form without default values
const SustainAnnounceForm = () => {
  // Initialize the form using react-hook-form and zod for validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventOptions: {
        addToCalendar: true,
      },
    },
  });

  const { toast } = useToast();

  // Set up mutation for form submission
  const { mutate, status } = api.submissions.submit.useMutation({
    onSuccess: () => {
      toast({
        title: "Submission successful",
        description: "Your submission has been sent to the SSC.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error.message,
      });
    },
  });

  // Watch form fields for conditional rendering
  const typeOfSubmission = form.watch("typeOfSubmission");
  const showAdditionalFields =
    typeOfSubmission === "event" ||
    typeOfSubmission === "opportunityWithDeadline";
  const isEvent = typeOfSubmission === "event";
  const hasDeadline = typeOfSubmission === "opportunityWithDeadline";
  const eventCategory = form.watch("eventCategory");
  const allDay = form.watch("eventOptions.isAllDayEvent");
  const isRecurringEvent = form.watch("eventOptions.isRecurringEvent");

  // Determine if time fields should be shown
  const noTime =
    eventCategory === "Scholarship/Fellowship Deadline" ||
    eventCategory === "Job/Internship/Research Opportunity (Paid)" ||
    eventCategory === "Volunteer Opportunity (Unpaid)" ||
    eventCategory === "Leadership Opportunity" ||
    eventCategory === "Other Application Deadline" ||
    eventCategory === "Announcement with a Deadline" ||
    allDay;

  // Log form state for debugging
  // console.log("typeOfSubmission", typeOfSubmission);
  // console.log("noTime", noTime);
  // console.log("eventCategory", eventCategory);
  // console.log("allDay", allDay);
  // console.log("hasDeadline", hasDeadline);
  // console.log(
  //   JSON.stringify({
  //     startDate: form.watch("eventOptions.eventStartDate"),
  //     startTime: form.watch("eventOptions.eventStartTime"),
  //     endDate: form.watch("eventOptions.eventEndDate"),
  //     endTime: form.watch("eventOptions.eventEndTime"),
  //   }),
  // );

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    values["id"] = v4(); // Generate a unique ID for the submission
    mutate(values);
  };

  // Render the form
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="https://raw.githubusercontent.com/ssc-leads/sustain-announce/main/GoogleForms_SSCHeader.png"
            alt="SSC Header"
            width="400"
          />
        </div>
        <CardTitle>
          MIT Sustain Announce: Sustainability Events and Opportunity Newsletter
          Submission
        </CardTitle>
        <CardDescription>
          Sustain Announce is a weekly digest of events, activities, and
          opportunities related to sustainability at MIT, especially those aimed
          towards the student body. Sustain Announce is generally sent out on
          Monday of each week (except Institute holidays and breaks).
          Submissions must be made before Sunday at noon (Eastern Time) to be
          included in the next day's Announce. Questions, feedback, and special
          requests can be directed to the Student Sustainability Coalition (SSC)
          Co-Leads at ssc-leads@mit.edu. Confirmation emails are not sent, so
          you can assume that if you click submit, your submission was received.
          If in doubt, contact ssc-leads@mit.edu.
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
                  <FormLabel>Your Name</FormLabel>
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
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Your email" {...field} />
                  </FormControl>
                  <FormDescription>
                    In case we need to reach out to you with questions about
                    your submission.
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
                  <FormLabel>Short Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Short title" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is a shorter title if needed in the email. Make it
                    catchy! (If you leave this field empty, the Short title will
                    be your Event title truncated to 45 characters.)
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
                    This can be the URL for a sign up form, organizer webpage,
                    etc. The URL must have an http:// (or preferably https://)
                    in front.
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
                    <Input
                      type="email"
                      placeholder="example@mit.edu"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This should be the organizer or group responsible for the
                    announcement/opportunity.
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
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Short description of the event or opportunity, including all info needed to participate."
                      {...field}
                    />
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
                    run for two consecutive weeks only. Note: if your event ends
                    before 9am on a Monday, do not include that Monday in the
                    range.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="advertiseOnSSCInsta"
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
                      <FormLabel>Event/Opportunity Category</FormLabel>
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
                        Choose the category that best describes your event or
                        opportunity.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {showAdditionalFields && isEvent && (
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
            )}
            {showAdditionalFields && (
              <FormField
                control={form.control}
                name="eventOptions.eventStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Start Date or Deadline</FormLabel>
                    <Input type="date" {...field} />
                    <FormDescription>
                      If this is a deadline for an opportunity or announcement,
                      or an all-day event, this field is required.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {showAdditionalFields && !hasDeadline && !allDay && (
              <>
                <FormField
                  control={form.control}
                  name="eventOptions.eventStartTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Start Time</FormLabel>
                      <Input type="time" {...field} />
                      <FormDescription>
                        All times should be in Eastern Time.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventOptions.eventEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event End Date</FormLabel>
                      <Input type="date" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventOptions.eventEndTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event End Time</FormLabel>
                      <Input type="time" {...field} />
                      <FormDescription>
                        All times should be in Eastern Time.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {isRecurringEvent && (
              <FormField
                control={form.control}
                name="eventOptions.recurringEventDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurring Event Details</FormLabel>
                    <Input {...field} />
                    <FormDescription>
                      Please add all details for the recurring date, time, and
                      location (e.g., Every Friday at 2pm in E52-451, except for
                      holidays).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button
              onClick={() => onSubmit(form.getValues())}
              // type="submit"
              disabled={status === "pending"}
            >
              {status === "pending" ? "Loading..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Export the appropriate component based on USE_DEFAULT_VALUES
export default USE_DEFAULT_VALUES ? SustainAnnounceShared : SustainAnnounceForm;
