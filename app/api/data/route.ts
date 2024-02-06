import { delay } from "@/utils";
import { getSource } from "@/utils/file";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const file = searchParams.get("file");

  if (!file) {
    return Response.json({ file: "Please add a query param 'file' !" });
  }

  await delay(2000); // iot see the loading state on the client

  try {
    const data = await getSource(file);
    return Response.json({ file: data });
  } catch (error) {
    return Response.json({ file: (error as Error).message });
  }
}
