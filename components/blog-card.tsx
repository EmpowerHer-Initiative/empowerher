import Link from "next/link";
import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
  date: Date;
  image?: string;
  href: string;
};

export const BlogCard = ({ title, description, date, image, href }: Props) => {
  return (
    <Link href={href}>
      <Card className="group hover:bg-muted h-full overflow-hidden py-0 duration-300">
        {image && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={image}
              alt={title}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <CardContent className="flex flex-col gap-2 p-5">
          <p className="text-muted-foreground text-xs">
            {format(date, "MMMM d, yyyy")}
          </p>
          <h3 className="text-base leading-snug font-semibold">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
