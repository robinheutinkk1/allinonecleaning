import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const inputBase =
  "block w-full rounded-2xl border bg-white px-4 text-[15px] text-navy-900 placeholder:text-navy-300 transition-all duration-200 focus:outline-none focus:ring-4 disabled:bg-navy-50";

const inputState = (error?: string) =>
  error
    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
    : "border-navy-200 hover:border-navy-300 focus:border-gold-500 focus:ring-gold-100";

export function FieldWrapper({
  label,
  htmlFor,
  error,
  hint,
  optional,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between text-sm font-semibold text-navy-800">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-navy-400">optioneel</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-navy-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  label,
  error,
  hint,
  optional,
  className,
  id,
  ...props
}: ComponentPropsWithoutRef<"input"> & { label: string; error?: string; hint?: string; optional?: boolean; id: string }) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} optional={optional} className={className}>
      <input
        id={id}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(inputBase, "h-13", inputState(error))}
        {...props}
      />
    </FieldWrapper>
  );
}

export function TextArea({
  label,
  error,
  hint,
  optional,
  className,
  id,
  ...props
}: ComponentPropsWithoutRef<"textarea"> & { label: string; error?: string; hint?: string; optional?: boolean; id: string }) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} optional={optional} className={className}>
      <textarea
        id={id}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(inputBase, "min-h-32 resize-y py-3", inputState(error))}
        {...props}
      />
    </FieldWrapper>
  );
}

export function Checkbox({
  id,
  label,
  error,
  className,
  ...props
}: ComponentPropsWithoutRef<"input"> & { id: string; label: ReactNode; error?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-navy-700">
        <input
          id={id}
          type="checkbox"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer appearance-none rounded-md border border-navy-300 bg-white transition-all checked:border-gold-500 checked:bg-gold-500 checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22white%22><path fill-rule=%22evenodd%22 d=%22M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z%22 clip-rule=%22evenodd%22/></svg>')] checked:bg-center checked:bg-no-repeat focus:ring-4 focus:ring-gold-100"
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormAlert({ type, children }: { type: "error" | "success" | "info"; children: ReactNode }) {
  const styles = {
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-gold-200 bg-gold-50 text-gold-900",
  }[type];
  return (
    <div role={type === "error" ? "alert" : "status"} className={cn("rounded-2xl border px-4 py-3 text-sm leading-relaxed", styles)}>
      {children}
    </div>
  );
}
