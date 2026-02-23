import * as React from "react";
import gsap from "gsap";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ref: externalRef,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
  }) {
  const Comp = asChild ? Slot : "button";
  const internalRef = React.useRef<HTMLButtonElement>(null);

  // Use either external or internal ref
  const buttonRef = (externalRef ||
    internalRef) as React.RefObject<HTMLButtonElement>;

  const { contextSafe } = useGSAP({ scope: buttonRef });

  const handleMouseEnter = contextSafe(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) return;
      gsap.to(e.currentTarget, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
      props.onMouseEnter?.(e);
    },
  );

  const handleMouseLeave = contextSafe(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) return;
      gsap.to(e.currentTarget, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
      props.onMouseLeave?.(e);
    },
  );

  // const handleMouseMove = contextSafe(
  //   (e: React.MouseEvent<HTMLButtonElement>) => {
  //     if (props.disabled) return;
  //     const rect = e.currentTarget.getBoundingClientRect();
  //     const x = e.clientX - rect.left - rect.width / 2;
  //     const y = e.clientY - rect.top - rect.height / 2;

  //     gsap.to(e.currentTarget, {
  //       x: x * 0.1,
  //       y: y * 0.1,
  //       duration: 0.3,
  //       ease: "power2.out",
  //     });
  //     props.onMouseMove?.(e);
  //   },
  // );

  const handleMouseDown = contextSafe(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) return;
      gsap.to(e.currentTarget, {
        scale: 0.95,
        duration: 0.1,
      });
      props.onMouseDown?.(e);
    },
  );

  const handleMouseUp = contextSafe(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) return;
      gsap.to(e.currentTarget, {
        scale: 1.02,
        duration: 0.1,
      });
      props.onMouseUp?.(e);
    },
  );

  const isSolid = variant === "default" || variant === "destructive";

  if (asChild) {
    return (
      <Slot
        ref={buttonRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(
          isSolid && "relative overflow-hidden group",
          buttonVariants({ variant, size, className }),
        )}
        {...props}
      />
    );
  }

  return (
    <button
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        isSolid && "relative overflow-hidden group",
        buttonVariants({ variant, size, className }),
      )}
      {...props}
    >
      {isSolid ? (
        <React.Fragment>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out skew-y-12 origin-bottom pointer-events-none" />
          <span className="relative flex items-center justify-center gap-2 pointer-events-none">
            {props.children}
          </span>
        </React.Fragment>
      ) : (
        props.children
      )}
    </button>
  );
}

export { Button, buttonVariants };
