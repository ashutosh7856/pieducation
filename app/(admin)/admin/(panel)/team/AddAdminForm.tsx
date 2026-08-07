"use client";

import { useActionState, useEffect, useRef } from "react";
import { addAdmin } from "../actions";

export default function AddAdminForm() {
  const [error, formAction, pending] = useActionState(addAdmin, null);
  const ref = useRef<HTMLFormElement>(null);

  // Clear the fields once the action reports success, so a stray second submit
  // can't re-post the password that's still sitting in the inputs.
  useEffect(() => {
    if (!pending && error === null) ref.current?.reset();
  }, [pending, error]);

  return (
    <form ref={ref} action={formAction} className="card p-5">
      <h2 className="font-display text-lg font-bold">Add an admin</h2>
      <p className="mt-1 text-sm text-muted">
        They sign in with the username and password you set here. Send the password over
        something other than email.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          name="username"
          required
          placeholder="Username"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
        />
        <input
          type="text"
          name="name"
          placeholder="Full name (optional)"
          autoComplete="off"
          className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
        />
        <input
          type="text"
          name="password"
          required
          placeholder="Password"
          autoComplete="off"
          className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary mt-4 px-4 py-2.5 text-sm disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add admin"}
      </button>
    </form>
  );
}
