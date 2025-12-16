import Link from "next/link";

export default function Announcement({ text, href }: { text: string, href: string }) {
    return (
        <div className="bg-destructive text-primary-foreground text-center py-2 sticky top-16 z-[90]">
          <Link href={href}>
            <span className="font-bold capitalize hover:underline transition-colors">{text}</span>
          </Link>
    </div>
  );
}