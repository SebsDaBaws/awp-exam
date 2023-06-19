import { redirect} from "@remix-run/node";
import { requireUserSession } from "~/sessions.server";


export async function loader({request}) {
  await requireUserSession(request);
  return redirect("/explore");
}


