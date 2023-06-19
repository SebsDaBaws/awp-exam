import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/sessions.server.js";

// In case anyone loads this route directly, we'll redirect them to the login page
export function loader() {
  return redirect("/login");
}

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  // Once the user is logged out, redirect them to the login page
  return redirect("/login", {
    headers: {
      // Clear the session cookie, which effectively logs the user out
      "Set-Cookie": await destroySession(session),
    },
  });
}
