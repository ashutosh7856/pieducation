"use client";

import { useActionState } from "react";
import { changePassword, removeAdmin } from "../actions";

export type RowAdmin = {
  username: string;
  name: string;
  createdAt: string;
  lastLoginAt: string | null;
};

function fmt(iso: string | null) {
  if (!iso) return "never";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * A card rather than a table row: the account list is short, and both controls
 * are forms, which a table crushes on a phone.
 */
export default function AdminRow({ admin, isSelf }: { admin: RowAdmin; isSelf: boolean }) {
  const [pwError, pwAction, pwPending] = useActionState(changePassword, null);
  const [removeError, removeAction, removePending] = useActionState(removeAdmin, null);
  const error = pwError ?? removeError;

  return (
    <li className="p-4 sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-ink">
            {admin.name}
            {isSelf && <span className="ml-1.5 chip chip-brand">you</span>}
          </p>
          <p className="text-xs text-muted">@{admin.username}</p>
        </div>
        <p className="text-xs text-muted">
          Added {fmt(admin.createdAt)} · Last sign-in{" "}
          <span className={admin.lastLoginAt ? "" : "text-faint"}>{fmt(admin.lastLoginAt)}</span>
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <form action={pwAction} className="flex flex-1 items-center gap-1.5 sm:flex-none">
          <input type="hidden" name="username" value={admin.username} />
          <input
            type="text"
            name="password"
            required
            placeholder="New password"
            autoComplete="off"
            className="w-full min-w-0 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs sm:w-40"
            aria-label={`New password for ${admin.username}`}
          />
          <button
            disabled={pwPending}
            className="shrink-0 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold hover:bg-paper-2 disabled:opacity-60"
          >
            {pwPending ? "Setting…" : "Set password"}
          </button>
        </form>

        <form action={removeAction}>
          <input type="hidden" name="username" value={admin.username} />
          <button
            disabled={removePending || isSelf}
            title={isSelf ? "You can't remove your own account" : undefined}
            className="rounded-lg border border-danger/40 px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5 disabled:opacity-40"
          >
            Remove
          </button>
        </form>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </li>
  );
}
