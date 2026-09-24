
"use client";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "cn";

interface InputTextareaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  onSubmit?: () => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  classNameWrapper?: string;
  classNameInput?: string;
  classNameLabel?: string;
  classNameHelperText?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export default function InputTextArea({
  onSubmit,
  onKeyDown: externalKeyDownHandler,
  placeholder = "Type your question here... (shift+enter for a new line)",
  label,
  error,
  helperText,
  className = "",
  classNameWrapper = "",
  classNameInput = "",
  classNameLabel = "",
  classNameHelperText = "",
  ref,
  ...restProps
}: InputTextareaProps) {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = ref || internalRef;
  const [isFocused, setIsFocused] = useState(false);

  ///// auto-resize effect /////
  useEffect(() => {
    const textarea =
      textareaRef instanceof Object && "current" in textareaRef
        ? textareaRef.current
        : null;
    if (!textarea) return undefined;

    const autoResize = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };
    autoResize(); // initial resize

    textarea.addEventListener("input", autoResize, false);
    return () => {
      textarea.removeEventListener("input", autoResize, false);
    };
  }, [restProps.value, textareaRef]);

  ////// event handler to submit on Enter /////
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit?.();
    }
    externalKeyDownHandler?.(event);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        className={cn(
          "relative w-full flex items-center py-3\
                  border border-input rounded-sm bg-main transition-[border,outline]\
                  focus-within:border-secondary focus-within:outline-none\
                  aria-invalid:ring-destructive/20 aria-invalid:border-destructive\
                  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-destructive" : "border-input",
          classNameWrapper
        )}
      >
        <textarea
          ref={textareaRef}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "relative w-full h-auto min-h-20 max-h-[15vh] resize-none overflow-y-auto\
                  px-3\
                 file:text-foreground placeholder:text-muted-foreground selection:bg-mainWeak/30\
                  outline-none\
                  text-sm",
            classNameInput
          )}
          aria-invalid={!!error}
          {...restProps}
        />
        {label && (
          <label className="absolute top-[-12px] left-3 text-xs font-medium text-muted-foreground">
            <div className="relative bg-main z-1 top-[10px] left-[-5px] h-[2px] w-[calc(100%+10px)]" />
            <p
              className={cn(
                "relative z-2",
                isFocused ? "text-secondary" : "text-muted-foreground",
                error ? "!text-destructive" : "",
                classNameLabel
              )}
            >
              {label}
            </p>
          </label>
        )}
      </div>
      {(error || helperText) && (
        <p
          className={cn(
            "text-sm",
            "text-muted-foreground",
            classNameHelperText,
            error ? "text-destructive" : ""
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}