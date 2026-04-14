import Link from "next/link";
import { format } from "date-fns";

type Props = {
  title: string;
  description: string;
  date: Date;
  image?: string;
  href: string;
};

export const BlogCard = ({ title, description, date, href }: Props) => {
  return (
    <Link href={href} className="block">
      <p className="text-muted-foreground text-xs">
        {format(date, "MMMM d, yyyy")}
      </p>
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
    </Link>
  );
};
