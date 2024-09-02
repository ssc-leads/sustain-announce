import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { useState } from "react";

export default function Homepage() {
  // const [date, setDate] = useState<Date | undefined>(undefined);

  const { data } = api.submissions.getAllSubmissions.useQuery({
    date: date ?? new Date()
  });

  const [value, setValue] = useState<string>("foo");


  return (
    <div className="space-y-4 m-4">
      {value}
      <Button onClick={() => {
        setValue(value + " clicked ")
      }}>
        Hello
      </Button>
      {/* <Input placeholder="Fill in value" value={value} onChange={(e) => setValue(e.target.value)}/> */}
      {/* <Input type="date" onChange={(e) => setDate(new Date(e.target.value))} value={date?.toString()}
      /> */}
      {/* {data?.map((submission, index) => (
        <div key={index} className="rounded-lg border p-4">
          <h2 className="mb-2 text-xl font-bold">{submission.eventTitle}</h2>
          <p>
            <strong>When:</strong>
          </p>
          <p>
            <strong>Where:</strong> {submission.physicalLocation}
          </p>
          <p>
            <strong>Contact:</strong> {submission.mainContactEmail}
          </p>
          <p>
            <strong>URL:</strong>{" "}
            <a href={submission.url} className="text-blue-500 hover:underline">
              {submission.url}
            </a>
          </p>
          <ul className="mt-2 list-inside list-disc">
            {submission.shortDescription.split("\n").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <button
            className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => {
              const content = `
                <h2>${submission.eventTitle}</h2>
                <p><strong>Where:</strong> ${submission.physicalLocation}</p>
                <p><strong>Contact:</strong> ${submission.mainContactEmail}</p>
                <p><strong>URL:</strong> <a href="${submission.url}">${submission.url}</a></p>
                <ul>
                  ${submission.shortDescription
                    .split("\n")
                    .map((item) => `<li>${item}</li>`)
                    .join("")}
                </ul>
              `;
              navigator.clipboard.writeText(content);
            }}
          >
            Copy as HTML
          </button>
        </div>
      ))} */}
    </div>
  );
}
