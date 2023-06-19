import { json, redirect } from "@remix-run/node";
import { useActionData, useCatch, useLoaderData } from "@remix-run/react";
import PostForm from "~/components/PostForm";
import connectDb from "~/db/connectDb.server";

export async function loader({ params }) {
  const db = connectDb();
  const post = await db.models.Post.findById(params.postId);
  return json(post);
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const db = connectDb();
  try {
    // Find the post and update it
    const post = await db.models.Post.findById(params.postId);
    post.name = formData.get("name");

    post.description = (formData.get("description"));

    await post.save();
   
  // Redirect to explore after edit
    return redirect(`/explore`);
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
      <p> The edit didn't work</p>
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
      <p>The edit didn't work</p>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div> 
  );
}

// Edit post form
export default function EditPost() {
  const actionData = useActionData();
  const post = useLoaderData();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Edit post</h1>
      <PostForm
        defaultValues={post}
        cancelLink={`/explore`}
        errors={actionData}
      />
    </div>
  );
}
