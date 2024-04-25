import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

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
  avatars: Array<{
    name: string;
    avatar: string;
  }>;
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
      {limitedAvatars.map((user, index) => !!user && (
        <TooltipProvider key={user.name}>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <TooltipContent>{user.name}</TooltipContent>
              <Avatar className={cn(
                avatarStackVariants(),
              )}>
                <AvatarImage className="object-cover rounded-full" src={user.avatar} />
                <AvatarFallback className="text-sm font-bold text-slate-500 border-1">{user.name.slice(0,2)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      ))}

      {/* {limitedAvatars.length < avatars.length ?
        <Avatar className="cursor-default">
          <AvatarFallback className="text-sm font-bold text-slate-500">+{avatars.length - limitedAvatars.length }</AvatarFallback>
        </Avatar>
      : null} */}
    </div>
  );
}

export { AvatarStack, avatarStackVariants };