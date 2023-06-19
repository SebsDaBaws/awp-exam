import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import PostForm from "~/components/PostForm";
import { useActionData, useCatch } from "@remix-run/react";
import { requireUserSession } from '~/sessions.server';

// Create post function
export async function action({ request }) {
  const formData = await request.formData();
  const session = await requireUserSession(request);
  const userid = session.get("userId");

  const data = {
    name: formData.get("name"),
    description: (formData.get("description")),
    timestamps: true,
    userid: userid,
    
  };
  const db = connectDb();
  try {
    const newPost = new db.models.Post(data);
    await newPost.save();
    return redirect(`/explore/`);
  } catch (error) {
    console.log(error);
    return json(error.errors);
  }
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p> Something went wrong creating the post</p>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{JSON.stringify(caught.data, null, 2)}</code>
      </pre>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>Error</h1>
      <p>Something went wrong creating the post</p>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}


export default function CreatePost() {
  const actionData = useActionData();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Create post</h1>
      <PostForm cancelLink="/explore" errors={actionData} />
    </div>
  );
}
