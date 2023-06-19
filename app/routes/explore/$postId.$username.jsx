import { Form, Link, useLoaderData, useCatch } from "@remix-run/react";
import {
  TrashIcon,
  PencilSquareIcon, 
} from "@heroicons/react/24/outline";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import { Label, Input } from '~/components/formElements';
import { getSession, requireUserSession } from "~/sessions.server";

export async function loader({ params }) {
  const db = connectDb();
  const post = await db.models.Post.findById(params.postId).populate("userid");
  if (!post) {
    throw new Response("Could not find the post you were looking for", {
      status: 404,
    });
  }
  return json(post);
}

// Delete function
export async function action({ request, params }) {
  const formData = await request.formData();
  const session = await requireUserSession(request);
  if (formData.get("_action") === "delete") {
    const db = connectDb();
    const deletedPost = await db.models.Post.findByIdAndDelete(params.postId);
    
}
// Like function
const userid = session.get("userId");
  if (formData.get("_action") === "like") {
    const db = await connectDb();
    const post = await db.models.Post.findById(formData.get("postId"));
    if (post.likes.includes(userid)) {
      console.log("unliking");
      post.likes = post.likes.filter((id) => id != userid);
    } else {
      post.likes.push(userid);
    }
    await post.save();
    return json(post);
  }
    
    return redirect("/explore");
  }

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p> The post doesn't exist!</p>
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
      <p>It appears this post does not exist</p>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

export default function PostPage() {
  const post = useLoaderData();
  const iconClasses = "mr-2 inline-block h-5 w-5 align-middle";
 
  
  return (
    <div>
      <div className="h-5 w-5">
        <img src={post.userid?.avatar} alt=""  
        /> 
      </div>
      <p>
        @{post.userid?.username}
      </p>
      <div className="flex flex-row">
        <h1 className="mb-1 flex-grow text-2xl font-bold">{post.name}</h1>
        <Link
          to={`/explore/${post._id}/edit`}
          className="p-2 text-slate-400 hover:text-amber-500"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </Link>
        <Form method="post">
          <button
            type="submit"
            name="_action"
            value="delete" 
            className="pointer p-2 text-slate-400 hover:text-red-500"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </Form>
      </div>
      <h2 className="mb-3 text-lg text-slate-400">{post.description}</h2>

     {/* Like button */}
     <Form method="post">
                    <br></br>
                    <input type="hidden" name="postId" value={post._id} />
                    <button className="font-semibold" type="submit" name="_action" value="like"> 
                    {"⭐ " + post.likes.length + " like(s)"}
                    </button>
                    </Form>
      <br></br>

                          
      {/* Time and date */}
      {post.timeCreatedAt.split("T")[0] + "   -   " + post.timeCreatedAt.split("T")[1].split(".")[0]}
    </div>

  );
}
