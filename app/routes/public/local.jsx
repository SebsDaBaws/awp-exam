import { useLoaderData, Outlet, NavLink, useCatch, Form, Link} from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import postFilters from "~/config/postFilters";
import { json } from "@remix-run/node";
import { useState } from "react";
import { requireUserSession } from "~/sessions.server";


export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p> You got an error in your posts page!</p>
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

export async function loader({request}) {
  await requireUserSession(request);

  const db = connectDb();

  // Sort by newest posts first
  const posts = await db.collection("posts").find({}).sort({ timeCreatedAt: -1 }).toArray();
  // Render username and avatar
  for (const post of posts) {
    const user = await db.collection("users").findOne({ _id: post.userid });
    post.userid = {
      username: user.username,
      avatar: user.avatar,
    };
 
  }

  return json(posts);
}

export default function Index() {
  const [filterTerm, setFilterTerm] = useState("");
  const posts = useLoaderData();
  const filteredPosts = filterTerm ? filterPosts(posts, filterTerm) : posts;
  const sortedPosts = filteredPosts.sort((a, b) => {
    return 0;
  }); 



  return (
    <div className="grid grid-cols-2 content-start gap-6">
      <div>
        <input
          type="search"
          className="mb-3 w-full rounded-md border border-slate-200 p-2 shadow-sm"
          placeholder="Search posts or users"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
        />
        
        {filteredPosts.length > 0 ? (
          <ul className="rounded border border-slate-200 bg-white shadow-sm">
      
            {sortedPosts.map((post) => {
              return (
                <li key={post._id} className="border-b border-slate-200">
                  <NavLink
                      to={`/explore/${post._id}/${post.userid?.username}`}
                    className={({ isActive }) =>
                      [
                        "block p-3 transition-colors",
                        isActive ? "bg-blue-300" : "hover:bg-slate-500",
                      ].join(" ")
                    }
                  >
                      <div className="h-5 w-5">
                      <img src={post.userid?.avatar} alt=""  
                      /> 
                  </div>
                    <p>
                     @{post.userid?.username}
                    </p>
                    <span className="font-bold mb-10">{post.name}</span>
                    <br></br>
                    <span className="fonts-light mb-1">{post.description}</span>
                    <span className="flex flex-row items-center gap-2 text-sm text-slate-400">
                    <br></br>


                    <br></br>
                    {/* Time and date */}
                    {post.timeCreatedAt.split("T")[0] /*+ "   -   " + post.timeCreatedAt.split("T")[1].split(".")[0]*/}
                    </span>

                  </NavLink>
                </li>
              );
            })}
          </ul>
        ) : null}
        {filteredPosts.length !== posts.length ? (
          <p className="mt-3 text-center text-sm text-slate-400">
            Showing {filteredPosts.length} of {posts.length}
          </p>
        ) : null}
      </div>
      <Outlet />
    </div>
  );
}

// Search functionality
function filterPosts(posts, filterTerm) {
  const sanitizedFilterTerm = filterTerm.trim().toLowerCase();
  return posts.filter((post) => {

     // Search by userid/username
     if (post.userid?.username.toLowerCase().includes(sanitizedFilterTerm)) {
      return post.userid?.username;
    }

    /*  // Search by date and time
    if (post.timeCreatedAt.toLowerCase().includes(sanitizedFilterTerm)) {
      return post.timeCreatedAt;
    }
    */

    // If the filterTerm is a whole number, we'll assume it's a (minimum) seat count
    if (Number.isInteger(Number(sanitizedFilterTerm))) {
      return post.facilities?.seatCount >= Number(sanitizedFilterTerm);
    }

    // Otherwise, we'll check if it matches the postFilter name
    if (
      Object.values(postFilters).some((postFilter) =>
        postFilter.toLowerCase().startsWith(sanitizedFilterTerm)
      )
    ) {
      return (
        post.postFilter ==
        Object.keys(postFilters).find((key) =>
          postFilters[key].toLowerCase().startsWith(sanitizedFilterTerm)
        )
      );
    }

    // Or if none of the above, filter by title
    return post.name.toLowerCase().includes(sanitizedFilterTerm);
    
  });
  
}

