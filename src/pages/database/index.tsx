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
  const {
    data: submissions,
    refetch,
    isLoading,
  } = api.submissions.getAllSubmissions.useQuery();
  const deleteSubmission = api.submissions.deleteSubmission.useMutation();

  const handleDelete = async (index: number) => {
    await deleteSubmission.mutateAsync({ index });
    refetch();
  };

  return (
    <div className="m-8">
      <h1 className="text-2xl font-bold">Submissions</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableCaption>A list of your recent submissions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
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
            {submissions?.map((submission, index) => (
              <TableRow
                key={index}
                className={submission.exceedsTwoWeeks ? "bg-red-100" : ""}
              >
                <TableCell>{index}</TableCell>
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
                      await handleDelete(index);
                    }}
                  >
                    Delete
                  </AsyncButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default DatabasePage;
