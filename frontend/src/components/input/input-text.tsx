
import React, { useRef } from "react";
import { cn } from "@/utils/shadcn-utils";

import { Eye } from "lucide-react";

interface ITextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  className?: string;
  classNameWrapper?: string;
  classNameLabelWrapper?: string;
  classNameInput?: string;
  classNameLabel?: string;
  classNameHelperText?: string;
  classNameStartAdornment?: string;
  classNameEndAdornment?: string;
  variant?: "default" | "inline";
  ref?: React.Ref<HTMLInputElement>;
}

function TextInput({
  id,
  type = "text",
  label,
  error,
  helperText,
  startAdornment,
  endAdornment,
  className = "",
  classNameWrapper = "",
  classNameLabelWrapper = "",
  classNameInput = "",
  classNameLabel = "",
  classNameHelperText = "",
  classNameStartAdornment = "",
  classNameEndAdornment = "",
  variant = "default",
  ref,
  ...props
}: ITextInputProps) {
  const internalRef = useRef<HTMLInputElement>(null);

  const inputRef = ref || internalRef;
  function onTogglePassword() {
    const input =
      inputRef instanceof Object && "current" in inputRef
        ? inputRef.current
        : null;
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
    input.focus();
  }
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className={cn("group/field relative flex items-center", classNameLabelWrapper)}>
        <div
          className={cn(
            "group relative flex w-full items-center",
            classNameWrapper,
            variant === "default"
              ? "rounded-sm border border-input bg-background focus-within:border-secondary"
              : variant === "inline"
                ? "focus-within:border-b border-input"
                : "",
          )}
        >
          {startAdornment && (
            <div className={cn("absolute left-3", classNameStartAdornment)}>
              {startAdornment}
            </div>
          )}
          <input
            type={type}
            id={id}
            data-slot="input"
            ref={inputRef}
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-backgroundWeak/30 flex h-9 w-full min-w-0 transition-[color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm",
              variant === "default"
                ? "rounded-sm bg-background px-3 py-1"
                : variant === "inline"
                  ? "bg-transparent p-0 pl-1"
                  : "",
              "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
              startAdornment && "pl-10",
              (endAdornment || type == "password") && "pr-10",
              classNameInput,
            )}
            aria-invalid={!!error}
            aria-describedby={
              error || helperText ? `${id}-description` : undefined
            }
            {...props}
          />
          {(endAdornment || type == "password") && (
            <div className={cn("absolute right-1", classNameEndAdornment)}>
              {type == "password" ? (
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={onTogglePassword}
                  className="mr-2 flex cursor-pointer rounded-sm focus-visible:outline-2"
                >
                  <Eye className="size-4" />
                </button>
              ) : (
                endAdornment
              )}
            </div>
          )}
        </div>
        {label && variant === "default" && (
          <label
            htmlFor={id}
            className="absolute top-[-10px] left-3 text-xs font-medium text-muted-foreground"
          >
            <div className="relative z-1 top-[10px] left-[-5px] bg-background h-[2px] w-[calc(100%+10px)]" />
            <p
              className={cn(
                `relative group-focus-within/field:text-secondary ${
                  error ? "!text-destructive" : ""
                } z-2`,
                classNameLabel,
              )}
            >
              {label}
            </p>
          </label>
        )}
      </div>
      {(error || helperText) && (
        <p
          id={`${id}-description`}
          className={cn(
            "text-sm",
            "text-muted-foreground",
            classNameHelperText,
            error ? "text-destructive" : "",
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export { TextInput };