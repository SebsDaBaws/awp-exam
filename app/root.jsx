import { json } from "@remix-run/node";
import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink,
  useCatch,
  useLoaderData,
  Form,
} from "@remix-run/react";
import styles from "~/tailwind.css";
import { getSession } from "./sessions.server";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Mammothdawn",
    viewport: "width=device-width,initial-scale=1",
  };
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p> You got an error, sorry!</p>
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
      <p>Something went wrong</p>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    isAuthenticated: session.has("userId"),
  });
}

export default function App() {
  const { isAuthenticated } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 p-4 font-sans text-slate-800">
        <header className="mb-4 flex flex-row items-center gap-3 border-b-2 pb-3">
          
          {/* If the user is logged in redirect to explore, if not, then redirect to login */}
          {isAuthenticated ? (
          
            <>
            <Link
            to="/"
            className="mr-auto block transition-colors hover:text-slate-600"
          >
            <h1 className="text-2xl font-bold gap-3 border-b-2 pb-3">🦣 Mammothdawn</h1>
          </Link>
            
          <MenuLink className="align-middle" to="/explore">Explore</MenuLink>

          <MenuLink to="/public/local">Public local</MenuLink>
           
           
            <MenuLink to="/explore/new">Create post</MenuLink>
              
              <Form method="post" action="/logout">
                <button className= "gap-3 border-b-2" type="submit">Logout</button>
              </Form>
            </>
          ) : (
            <>
            <div
            className="mr-auto block transition-colors hover:text-slate-600"
          >
            <h1 className="text-2xl font-bold gap-3 border-b-2 pb-3">Welcome to 🦣 Mammothdawn!</h1>
            <p className="text-3xl gap-4">Please sign in or create an user</p>

          </div> 
            </>
          )}
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function MenuLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "font-semibold" : "font-normal")}
    >
      {children}
    </NavLink>
  );
}
