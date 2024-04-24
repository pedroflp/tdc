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
    url: string;
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
      {limitedAvatars.map((avatar, index) => (
        <TooltipProvider key={avatar.name}>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <TooltipContent>{avatar.name}</TooltipContent>
              <Avatar className={avatarStackVariants()}>
                <AvatarImage className="border-4 border-slate-0" src={avatar.url} />
                <AvatarFallback className="border-4 border-white text-sm font-bold text-slate-500">{avatar.name.slice(0,2)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      ))}

      {limitedAvatars.length < avatars.length ?
        <Avatar className="cursor-default">
          <AvatarFallback className="border-4 border-white text-sm font-bold text-slate-500">+{avatars.length - limitedAvatars.length }</AvatarFallback>
        </Avatar>
      : null}
    </div>
  );
}

export { AvatarStack, avatarStackVariants };