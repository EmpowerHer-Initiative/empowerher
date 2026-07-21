"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Facebook, Instagram, LinkedIn } from "@/components/icons";

type AuthorCardProps = {
  authorName: string;
  authorBio?: string;
  authorPosition?: string;
  authorInstagram?: string;
  authorFacebook?: string;
  authorLinkedin?: string;
};

const initial = (name: string) => name.trim().charAt(0).toUpperCase();

const DEFAULT_AVATAR =
  "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTK53dXUCVy1oGkRMuS0Lravl9JbQIxWFcNhtq";

export function AuthorCard({
  authorName,
  authorBio,
  authorPosition,
  authorInstagram,
  authorFacebook,
  authorLinkedin,
}: AuthorCardProps) {
  const [open, setOpen] = useState(false);

  const socials = [
    { href: authorLinkedin, Icon: LinkedIn, label: "LinkedIn" },
    { href: authorInstagram, Icon: Instagram, label: "Instagram" },
    { href: authorFacebook, Icon: Facebook, label: "Facebook" },
  ].filter((s) => s.href);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        onMouseEnter={() => setOpen(true)}
        className="border-border bg-background hover:bg-muted inline-flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-1.5 text-sm font-medium transition-colors"
      >
        <Avatar className="size-7">
          <AvatarImage src={DEFAULT_AVATAR} alt={authorName} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {initial(authorName)}
          </AvatarFallback>
        </Avatar>
        {authorName}
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 gap-0">
        <div className="mb-3 flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={DEFAULT_AVATAR} alt={authorName} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initial(authorName)}
            </AvatarFallback>
          </Avatar>
          <div className="-space-y-0.5">
            <p className="text-foreground font-semibold">{authorName}</p>
            {authorPosition && (
              <p className="text-muted-foreground text-xs">{authorPosition}</p>
            )}
          </div>
        </div>

        {authorBio && (
          <p className="text-muted-foreground text-[13px] leading-relaxed">
            {authorBio}
          </p>
        )}

        {socials.length > 0 && (
          <div className="mt-3 flex items-center gap-3">
            {socials.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
