"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Define an interface compatible with what was there, but using Next.js primitives
type NextLinkProps = ComponentProps<typeof Link>;

interface NavLinkCompatProps extends Omit<NextLinkProps, "href" | "className"> {
  to: string; // Use 'to' instead of 'href' to maintain compatibility with existing usages
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    const pathname = usePathname();
    
    // Logic to determine if the link is active
    // If 'to' is exactly the current path, it's active.
    // If 'to' is not root ('/') and the current path starts with 'to', it's active (nested routes).
    const isActive = pathname === to || (to !== '/' && pathname?.startsWith(`${to}/`));

    return (
      <Link
        ref={ref}
        href={to}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
