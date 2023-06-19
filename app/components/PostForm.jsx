import { Form, Link, useTransition } from "@remix-run/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Label, Input, ErrorMessage, Button } from "~/components/formElements";

export default function PostForm({
  action,
  errors,
  defaultValues,
  submittedValues,
  cancelLink,
}) {
  const transition = useTransition();

  return (
   
    <Form  method="post" action={action}>
      <fieldset disabled={transition.state === "submitting"}>
        <Label htmlFor="name">Title</Label>
        <Input
          name="name"
          placeholder="Post title"
          className="mb-3 rounded border border-slate-300 py-2 px-3"
          defaultValue={submittedValues?.name ?? defaultValues?.name}
        />
        <ErrorMessage>{errors?.name?.message}</ErrorMessage>

        <Label htmlFor="description">Text</Label>
        <textarea
          type="text"
          name="description"
          maxLength={500}
          placeholder="Text here"
          className="mb-3 rounded border border-slate-300 py-2 px-3"
          defaultValue={submittedValues?.description ?? defaultValues?.description ?? ""}
          
        />
        <ErrorMessage>{errors?.description?.message}</ErrorMessage>

       
          
        <div className="mt-4 flex flex-row gap-3">
          <Button type="submit">
            {transition.state === "submitting" ? (
              <span className="flex flex-row items-center gap-2">
                Saving <ArrowPathIcon className="h-4 w-4 animate-spin" />
              </span>
            ) : (
              "Save"
            )}
          </Button>
          {cancelLink && (
            <Link
              to={cancelLink}
              className="order-first rounded border border-slate-300 py-2 px-3"
            >
              Cancel
            </Link>
          )}
        </div>
      </fieldset>
    </Form>
  );
}
