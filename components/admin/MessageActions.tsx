"use client";

import { useTransition } from "react";
import { Archive, Check, MailOpen, Trash2 } from "lucide-react";
import { deleteMessage, updateMessageStatus } from "@/lib/admin/actions";
import { btnDanger, btnSecondary, btnSmall } from "./ui";

export function MessageActions({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const set = (s: string) => start(() => updateMessageStatus(id, s).then(() => undefined));
  const cls = `${btnSecondary} ${btnSmall}`;
  return (
    <div className="flex flex-wrap gap-2">
      {status === "new" && (
        <button type="button" disabled={pending} onClick={() => set("read")} className={cls}>
          <MailOpen /> Gelezen
        </button>
      )}
      {status !== "replied" && status !== "archived" && (
        <button type="button" disabled={pending} onClick={() => set("replied")} className={cls}>
          <Check /> Beantwoord
        </button>
      )}
      {status !== "archived" && (
        <button type="button" disabled={pending} onClick={() => set("archived")} className={cls}>
          <Archive /> Archiveren
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        aria-label="Verwijderen"
        title="Verwijderen"
        onClick={() => {
          if (window.confirm("Dit bericht definitief verwijderen?")) start(() => deleteMessage(id).then(() => undefined));
        }}
        className={`${btnDanger} ${btnSmall}`}
      >
        <Trash2 /> <span className="sr-only sm:not-sr-only">Verwijderen</span>
      </button>
    </div>
  );
}
