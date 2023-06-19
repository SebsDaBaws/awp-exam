import { createCookie } from "@remix-run/node";

// Create a cookie that will be used to store the session
export const sessionCookie = createCookie("__session", {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7, // 1 week
  secrets: [process.env.COOKIE_SECRET],
});
