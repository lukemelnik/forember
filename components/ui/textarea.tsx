import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        // automatically adjust the height of the textarea based on the content
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto"; // Reset height to recalculate
          target.style.height = `${target.scrollHeight}px`;
        }}
        // I disabled the min-h-[80px] because it was causing the textarea to be too big
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
