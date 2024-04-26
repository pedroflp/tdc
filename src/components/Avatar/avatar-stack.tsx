import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
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
  avatars: Array<Player>;
  avatarsOffset?: number;
  maxAvatarsAmount?: number;
}

function AvatarStack({ className, orientation, avatars, spacing, avatarsOffset = 4, maxAvatarsAmount = 4, ...props }: AvatarStackProps) {
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
      {limitedAvatars.map((user) => !!user && (
        <TooltipProvider key={user.username}>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <TooltipContent>{user.name}</TooltipContent>
              <Avatar fallback={String(user.name).slice(0, 2)} image={user.avatar} />
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      ))}

      {limitedAvatars.length < avatars.length ?
        <Avatar fallback={`+${avatars.length - limitedAvatars.length }`} />
      : null}
    </div>
  );
}

export { AvatarStack, avatarStackVariants };