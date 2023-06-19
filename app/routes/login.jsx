import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { getSession, commitSession } from "~/sessions.server.js";
import { Button, Label, Input } from "~/components/formElements";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  // Our session cookie is HTTPOnly, so we have to read it on the server and
  // return it to the client as loader data
  return json({ userId: session.get("userId") });
}

// Login function
export default function Login() {
  const actionData = useActionData();
  const { userId } = useLoaderData();
  return (
    <div>
      <h1 className="mb-1 text-lg font-bold">Login</h1>
      {actionData?.errorMessage && (
        <p className="mb-3 rounded border border-red-500 bg-red-50 p-2 text-red-900">
          {actionData?.errorMessage}
        </p>
      )}
      {userId ? (
        <div>
          <p>
            You are already logged in as user
            <code className="ml-2 inline-block rounded bg-black p-2 text-white">
              {userId}
            </code>
          </p>
          <Form method="post" action="/logout">
            <Button>Logout</Button>
          </Form>
        </div>
      ) : (
        <>
          <Form method="post" reloadDocument>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              defaultValue={actionData?.values?.username}
            />
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              defaultValue={actionData?.values?.password}
            />
            <br />
            <Button>Login</Button>
          </Form>

          <br />
          <h2>
            Don't have an account? <br />
            <Link to="/signup" className="text-blue-600">
              Sign up here
            </Link>
          </h2>
        </>
      )}
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData);
  const session = await getSession(request.headers.get("Cookie"));
  const db = connectDb();
  const user = await db.models.User.findOne({
    username: formData.get("username").trim(),
  });
  if (!user) {
    return json(
      // Also return values so we can pre-populate the form
      { errorMessage: "User not found", values: formDataObject },
      { status: 404 }
    );
  }
  const passwordIsValid = user.password === formData.get("password").trim();
  if (!passwordIsValid) {
    return json(
      // Also return values so we can pre-populate the form
      { errorMessage: "Invalid password", values: formDataObject },
      { status: 401 }
    );
  }
  // If the user exists and the password is valid, set the userId in the session...
  session.set("userId", user._id);
  // ...and reload the login page, updating the session cookie
  return redirect("/", {
    headers: {
      // Because we've set a value on the session, we need to commit it to the
      // session cookie
      "Set-Cookie": await commitSession(session),
    },
  });
}
