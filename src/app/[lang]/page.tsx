import {FloatingDock} from "@/components/ui/floating-dock";
import {Contact, House} from "lucide-react";

export default function Home() {
    const links = [
        {
            title: "Home",
            icon: (
                <House className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/",
        },
        {
            title: "Project",
            icon: (
                <Contact className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/project",
        },
        {
            title: "Contact",
            icon: (
                <Contact className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/contact",
        }
    ];
  return (
    <div>
      <FloatingDock items={links} />
    </div>
  );
}
