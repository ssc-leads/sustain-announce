import { useState } from "react";
import { api } from "@/utils/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AsyncButton, Button } from "@/components/ui/button";

const DatabasePage = () => {
  const [cutoffDate, setCutoffDate] = useState<string | undefined>(undefined);
  const {
    data: submissions,
    refetch,
    isLoading,
  } = api.submissions.getAllSubmissions.useQuery();
  const deleteSubmission = api.submissions.deleteSubmission.useMutation();

  const filteredSubmissions = cutoffDate ? submissions?.filter((submission) => submission.lastAnnouncementDate >= cutoffDate) : submissions;
  
  const handleDelete = async (id: string) => {
    await deleteSubmission.mutateAsync({ id });
    refetch();
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCutoffDate(event.target.value);
    refetch();
  };

  const downloadCSV = () => {
    if (!filteredSubmissions || filteredSubmissions.length === 0) return;

    const headers = [
      "id", "name", "email", "organizingGroup", "typeOfSubmission", "eventTitle", "shortTitle", "url", "mainContactEmail", "shortDescription",
      "firstAnnouncementDate", "lastAnnouncementDate", "advertiseOnSSCInsta", "additionalComments", "exceedsTwoWeeks",
      "physicalLocation", "eventStartDate", "eventStartTime", "eventEndDate", "eventEndTime", "recurringEventDetails", "eventCategory"
    ];
    const csvContent = [
      headers.join(","),
      ...filteredSubmissions.map(sub => headers.map(h => {
        const value = sub[h as keyof typeof sub];
        if (value instanceof Date) {
          return `"${value.toISOString()}"`;
        } else if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value)}"`;
        } else {
          return `"${value || ""}"`;
        }
      }).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "submissions.csv";
    link.click();
  };
  
  return (
    <div className="m-8">
      <h1 className="text-2xl font-bold">Database of Form Submissions</h1>
      <div className="mb-4">
        <label htmlFor="cutoffDate" className="mr-2">
          Enter Cutoff Date (the table will filter to show submissions for on or after this date):
        </label>
        <input
          type="date"
          id="cutoffDate"
          value={cutoffDate || ""}
          onChange={handleDateChange}
          className="border p-2"
        />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Table>
            <TableCaption>A list of recent submissions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Event Title</TableHead>
                <TableHead>First Announcement Date</TableHead>
                <TableHead>Last Announcement Date</TableHead>
                <TableHead>Advertise on SSC Insta</TableHead>
                <TableHead>Additional Comments</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions?.map((submission, index) => (
                <TableRow
                  key={submission.id}
                  className={submission.exceedsTwoWeeks ? "bg-red-100" : ""}
                >
                  <TableCell>{submission.id}</TableCell>
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.eventTitle}</TableCell>
                  <TableCell>{submission.firstAnnouncementDate}</TableCell>
                  <TableCell>{submission.lastAnnouncementDate}</TableCell>
                  <TableCell>
                    {submission.advertiseOnSSCInsta ? (
                      <span className="text-green-500">
                        {submission.advertiseOnSSCInsta}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>{submission.additionalComments || "N/A"}</TableCell>
                  <TableCell>
                    <AsyncButton
                      action={async () => {
                        await handleDelete(submission.id);
                      }}
                    >
                      Delete
                    </AsyncButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={downloadCSV}>Download CSV</Button>
        </>
      )}
    </div>
  );
};

export default DatabasePage;
