"use client";

import { useTransition } from "react";
import { Archive, Check, MailOpen, Trash2 } from "lucide-react";
import { deleteMessage, updateMessageStatus } from "@/lib/admin/actions";
import { btnDanger, btnSecondary } from "./ui";

export function MessageActions({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const set = (s: string) => start(() => updateMessageStatus(id, s).then(() => undefined));
  return (
    <div className="flex flex-wrap gap-2">
      {status === "new" && (
        <button type="button" disabled={pending} onClick={() => set("read")} className={`${btnSecondary} h-9 px-3 text-xs`}>
          <MailOpen className="size-3.5" /> Gelezen
        </button>
      )}
      {status !== "replied" && status !== "archived" && (
        <button type="button" disabled={pending} onClick={() => set("replied")} className={`${btnSecondary} h-9 px-3 text-xs`}>
          <Check className="size-3.5" /> Beantwoord
        </button>
      )}
      {status !== "archived" && (
        <button type="button" disabled={pending} onClick={() => set("archived")} className={`${btnSecondary} h-9 px-3 text-xs`}>
          <Archive className="size-3.5" /> Archiveren
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (window.confirm("Dit bericht definitief verwijderen?")) start(() => deleteMessage(id).then(() => undefined));
        }}
        className={`${btnDanger} h-9 px-3 text-xs`}
      >
        <Trash2 className="size-3.5" /> Verwijderen
      </button>
    </div>
  );
}
