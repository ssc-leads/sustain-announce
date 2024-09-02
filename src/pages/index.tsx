import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formSchema } from "@/lib/formSchema";
import { api } from "@/utils/api";
import {
  Column,
  Html,
  Img,
  Link,
  render,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Calendar, Loader2 } from "lucide-react";

import { useState } from "react";
import { z } from "zod";

export default function Homepage() {
  const [date, setDate] = useState("");
  const [additionalContent, setAdditionalContent] = useState("");
  const [finalAdditionalContent, setFinalAdditionalContent] = useState("");

  const [submissions, setSubmissions] = useState<z.infer<typeof formSchema>[]>(
    [],
  );

  const [emailContent, setEmailContent] = useState("");

  const { mutateAsync: generateSubmissions, status: submissionsStatus } =
    api.submissions.generateSubmissions.useMutation();

  return (
    <div className="m-4 space-y-4">
      <h1 className="text-2xl font-bold">Generate SSC Announce Email and Calendar Events</h1>
      <label>
        Enter Date of Next Email Here:
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <Textarea
        placeholder="Enter additional content here for the email. This is preceded by 'SSC Updates:' after the template text of the email, so this is the place to put any specific updates from the SSC to be included in the email."
        value={additionalContent}
        onChange={(e) => setAdditionalContent(e.target.value)}
      />
      <Button
        className="w-full"
        onClick={() => {
          generateSubmissions({ date: new Date(date) }).then((data) => {
            setSubmissions(data);
            setFinalAdditionalContent(additionalContent);

            render(
              <FullEmail
                events={data}
                additionalText={additionalContent}
                date={date}
              />,
            ).then((html) => {
              setEmailContent(html);
            });
          });
        }}
        disabled={submissionsStatus === "pending"}
      >
        {submissionsStatus === "pending" && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Generate
      </Button>

      {submissions.length > 0 ? (
        <FullEmail
          events={submissions}
          additionalText={finalAdditionalContent}
          date={date}
        />
      ) : null}
      <h4 className="text-sm font-bold">Below is the raw HTML of the auto-generated email content. Copy the HTML code below and paste it into the Engage Email Composer after selecting the 'Source' option in the editor.</h4>      
      <Textarea value={emailContent} readOnly />
      {submissions.length > 0 && (
        <Button
          className="mt-4 w-full"
          onClick={() => {
            const csvContent = [
              [
                "Subject",
                "Start Date",
                "Start Time",
                "End Date",
                "End Time",
                "All Day Event",
                "Description",
                "Location",
              ],
              ...submissions
                .filter((event) => event.eventOptions?.eventStartDate)
                .map((event) => [
                  event.eventTitle,
                  event.eventOptions?.eventStartDate || "",
                  event.eventOptions?.eventStartTime || "",
                  event.eventOptions?.eventEndDate || "",
                  event.eventOptions?.eventEndTime || "",
                  event.eventOptions?.isAllDayEvent ? "True" : "False",
                  event.shortDescription,
                  event.physicalLocation || "",
                ]),
            ]
              .map((row) =>
                row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
              )
              .join("\n");

            const blob = new Blob([csvContent], {
              type: "text/csv;charset=utf-8;",
            });
            const link = document.createElement("a");
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", `events_${date}.csv`);
              link.style.visibility = "hidden";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
        >
          Download Calendar Events CSV (import this file to the MIT Sustainability Opportunities Google Calendar)
        </Button>

      )}
      <h4 className="text-sm font-bold">NOTE: The downloaded CSV may have duplicate submissions/events from prior weeks. Open the CSV and delete rows that were already imported previously, or manually delete duplicates after importing on Google Calendar.</h4>      

    </div>
  );
}

function FullEmail({
  events,
  additionalText,
  date,
}: {
  events: z.infer<typeof formSchema>[];
  additionalText: string;
  date: string;
}) {
  const categorizedEvents = {
    events: events.filter((event) => event.typeOfSubmission === "event"),
    opportunitiesWithDeadline: events.filter(
      (event) => event.typeOfSubmission === "opportunityWithDeadline",
    ),
    opportunitiesWithoutDeadline: events.filter(
      (event) => event.typeOfSubmission === "opportunityWithoutDeadline",
    ),
  };
  return (
    <Html>
      <Tailwind>
        <Section>
          <center>
            <Img
              src="https://raw.githubusercontent.com/ssc-leads/sustain-announce/main/GoogleForms_SSCHeader.png"
              alt="SSC Header"
              width={400}
            />
          </center>
          <Text className="text-2xl font-bold">
            Sustain Announce:{" "}
            {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
          <Text>
            Sustain Announce is the{" "}
            <Link href="https://ssc.mit.edu">
              Student Sustainability Coalition (SSC)'s
            </Link>{" "}
            weekly announcement email of sustainability-related events and
            opportunities sent to the MIT community. Click the green calendar 
            icons next to event/opportunity titles below to add them to your 
            calendar. General MIT sustainability resources can be found at{" "} 
            <Link href="https://ssc.mit.edu/resources">
              https://ssc.mit.edu/resources
            </Link>.
            </Text>
            <div className="flex justify-center space-x-4 mt-4">
              <Link href="https://sustain-announce.vercel.app/submit">
                <Button>
                  Submit an event/announcement
                </Button>
              </Link>
              <Link href="https://calendar.google.com/calendar/u/0?cid=Y185MmwzaTc1NjlhZWJxcGhiYzNhZTNzNGEyY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t">
                <Button>
                  Add the MIT Sustainability Opportunities Calendar
                </Button>
              </Link>
              <Link href="https://mailman.mit.edu/mailman/listinfo/sustain-interest">
                <Button>
                  (Un)subscribe to sustain-interest@mit.edu
                </Button>
              </Link>

            </div>
            {additionalText && (
              <Text>
                <strong>Updates from the SSC:</strong> {additionalText}
              </Text>
            )}
        </Section>

        <Text className="text-xl font-bold">Events</Text>
        {categorizedEvents.events.map((event, index) => (
          <Opportunity key={index} event={event} />
        ))}
        <Text className="mt-4 text-xl font-bold">Opportunities and Announcements</Text>
        {categorizedEvents.opportunitiesWithDeadline.map((event, index) => (
          <Opportunity key={index} event={event} />
        ))}
        {categorizedEvents.opportunitiesWithoutDeadline.map((event, index) => (
          <Opportunity key={index} event={event} />
        ))}
      </Tailwind>
    </Html>
  );
}

function Opportunity({ event }: { event: z.infer<typeof formSchema> }) {
  const eventDateTime = `${new Date(
    event.eventOptions?.eventStartDate + "T00:00:00",
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })}${
    event.eventOptions?.eventStartTime
      ? ` ${new Date(`2000-01-01T${event.eventOptions.eventStartTime}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
      : ""
  }${
    (event.eventOptions?.eventEndDate && event.eventOptions.eventEndDate !== event.eventOptions.eventStartDate)
      ? ` to ${new Date(event.eventOptions.eventEndDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" })}`
      : ""
  }${
    event.eventOptions?.eventEndTime
      ? ` ${event.eventOptions.eventEndDate === event.eventOptions.eventStartDate ? "to " : ""}${new Date(`2000-01-01T${event.eventOptions.eventEndTime}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
      : ""
  }${
    event.eventOptions?.isRecurringEvent &&
    event.eventOptions?.recurringEventDetails
      ? ` (${event.eventOptions.recurringEventDetails})`
      : ""
  }`;
  return (
    <Section className="mb-4 border border-gray-300 bg-white shadow-xl">
      <Row className="">
        <Column className="p-4 pt-0">
          <Text className="mt-0 flex flex-row text-nowrap text-xl font-semibold text-gray-800">
            {event.eventOptions?.eventStartDate &&
            event.eventOptions?.eventStartTime &&
            event.eventOptions?.eventEndDate &&
            event.eventOptions?.eventEndTime ? (
              <Link
                href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                  event.eventTitle,
                )}&dates=${new Date(
                  `${event.eventOptions.eventStartDate}T${event.eventOptions.eventStartTime}`,
                )
                  .toISOString()
                  .replace(/-|:|\.\d\d\d/g, "")}/${new Date(
                  `${event.eventOptions.eventEndDate}T${event.eventOptions.eventEndTime}`,
                )
                  .toISOString()
                  .replace(/-|:|\.\d\d\d/g, "")}&ctz=America/New_York
                )}Z&details=${encodeURIComponent(
                  event.shortDescription,
                )}&location=${encodeURIComponent(
                  event.physicalLocation || "",
                )}&trp=true&sprop&sprop=name:&pli=1&sf=true&output=xml&ctz=America/ET`}
                className="text-black hover:underline"
              >
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                  <Calendar className="mr-2 text-green-500" />
                  {event.eventTitle}
                </span>
              </Link>
            ) : (
              event.eventTitle
            )}
          </Text>
          {event.eventOptions?.eventStartDate && (
            <>
              <Text className="m-0 text-sm text-gray-600">
                <b>{event.typeOfSubmission === "opportunityWithDeadline" ? "Deadline:" : "When:"}</b> {eventDateTime}
              </Text>
              {event.typeOfSubmission === "event" && (
                <Text className="m-0 text-sm text-gray-600">
                  <b>Location:</b> {event.physicalLocation}
                </Text>
              )}
            </>
          )}
          {event.eventCategory && (
            <Text className="m-0 text-sm text-gray-600">
              <b>Type:</b> {event.eventCategory}
            </Text>
          )}
          <Text className="m-0 text-sm text-gray-600">
            <b>Organizing Group:</b> {event.organizingGroup}
          </Text>
          <Text className="m-0 text-sm text-gray-600">
            <b>Description:</b> {event.shortDescription}
          </Text>
          <Text className="m-0 text-sm text-gray-600">
            <b>Contact:</b>{" "}
            <Link
              href={`mailto:${event.mainContactEmail}`}
              className="text-blue-500 hover:underline"
            >
              {event.mainContactEmail}
            </Link>
          </Text>

          <Text className="m-0 text-sm text-gray-600">
            <b>URL:</b>{" "}
            <a href={event.url} className="text-blue-500 hover:underline">
              {event.url}
            </a>
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

