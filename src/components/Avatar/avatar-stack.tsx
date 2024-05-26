import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import Avatar from "@/components/Avatar";
import { Player } from "@/flows/queue/types";

const avatarStackVariants = cva(
  "flex",
  {
    variants: {
      orientation: {
        vertical: "flex-row",
        horizontal: "flex-col",
      },
      spacing: {
            sm: "-space-x-5 -space-y-5",
            md:"-space-x-4 -space-y-4",
            lg: "-space-x-3 -space-y-3",
            xl: "-space-x-2 -space-y-2",
            "2xl": "-space-x-1 -space-y-1",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      spacing: "md"
    },
  }
);

export interface AvatarStackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarStackVariants> {
  avatars: Array<Player | any>;
  avatarsOffset?: number;
  maxAvatarsAmount?: number;
  size?: number;
  fallbackSize?: "text-xs" | "text-sm" | "text-md" | "text-lg";
  avatarClassName?: string;
}

function AvatarStack({ className, avatarClassName, size = 10, fallbackSize = "text-sm", orientation, avatars, spacing, avatarsOffset = 4, maxAvatarsAmount = 4, ...props }: AvatarStackProps) {
  const limitedAvatars = avatars.slice(0, maxAvatarsAmount);

  return (
    <div
      className={cn(
        avatarStackVariants({ orientation, spacing }),
        className,
        orientation === "horizontal" ? "-space-x-0" : "-space-y-0"
      )}
      {...props}
    >

      {limitedAvatars.map((user) => (
        <TooltipProvider key={user?.username}>
          <Tooltip delayDuration={100}>
            <TooltipTrigger className="cursor-default">
              <TooltipContent>{user?.name ?? user?.username}</TooltipContent>
              <Avatar className={avatarClassName} fallbackSize={fallbackSize} size={size} fallback={String(user?.name ?? user?.username).slice(0, 2)} image={user?.avatar} />
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      ))}

      {limitedAvatars.length < avatars.length ?
        <Avatar size={size} fallback={`+${avatars.length - limitedAvatars.length }`} />
      : null}
    </div>
  );
}

export { AvatarStack, avatarStackVariants };