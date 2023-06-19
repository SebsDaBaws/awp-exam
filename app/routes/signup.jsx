import { Form, useActionData } from "@remix-run/react";
import { Label, Input, Button, ErrorMessage } from "~/components/formElements";
import connectDb from "~/db/connectDb.server";
import { json, redirect } from "@remix-run/node";

export async function action({ request }) {
  const db = connectDb();
  const formData = await request.formData();
  const user = db.models.User;
  let data = Object.fromEntries(formData);
  if (data.password === "" || data.username === "") {
    return json(
      { errorMessage: "Please fill out all fields", values: data },
      { status: 400 }
    );
  }

// Create new user and throw in a random avatar
  if (data.password !== data.passwordConfirm) {
    return json(
      { errorMessage: "Passwords do not match", values: data },
      { status: 400 }
    );
  } else {
    const newUser = new user({
      username: data.username,
      password: data.password,
      avatar: `https://avatars.dicebear.com/api/bottts/${data.username}.svg`,
    });
    await newUser.save();
    return redirect("/login");
  }
}

export default function SignUp() {
  const dataAction = useActionData();

  return (
    <div>
      <h1 className="mb-1 text-lg font-bold">SignUp</h1>
      <Form method="post">
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
                  />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          defaultValue={dataAction?.values?.password}
        />

        <Label htmlFor="passwordConfirm">Confirm Password</Label>
        <Input
          type="password"
          name="passwordConfirm"
          id="passwordConfirm"
          placeholder="Repeat Password"
          defaultValue={dataAction?.values?.passwordConfirm}
        />
        <br />
        <ErrorMessage>{dataAction?.errorMessage}</ErrorMessage>
        <br />
        <Button type="submit">Sign Up</Button>
      </Form>
    </div>
  );
}
