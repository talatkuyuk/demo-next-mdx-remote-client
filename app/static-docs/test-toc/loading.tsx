import LoadingComponent from "@/components/LoadingComponent";
import TableResult from "@/components/TableResult";

export default function Loading() {
  return (
    <TableResult leftColumnHeader="evaluate" rightColumnHeader="MDXRemote">
      <LoadingComponent />
      <LoadingComponent />
    </TableResult>
  );
}
