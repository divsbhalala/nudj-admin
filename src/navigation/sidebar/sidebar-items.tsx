import { File, Inbox, Send, Receipt, KeySquare, LucideIcon, PanelsTopLeft } from "lucide-react";

export interface NavSubItem {
  title: string;
  path: string;
}

export interface NavMainItem {
  title: string;
  path: string;
  icon?: LucideIcon;
  isActive?: boolean;
  subItems?: NavSubItem[];
}

export interface NavGroup {
  id: number;
  label: string;
  items: NavMainItem[];
}

const basePath = "/dashboard";

export const sidebarItems: NavGroup[] = [
  {
    id: 2,
    label: "Overview",
    items: [
      {
        title: "Engagement",
        path: "#",
        icon: Receipt,
        subItems: [
          { title: "Overview", path: `/engagement` },
          { title: "Challenges", path: `/challenges` },
        ],
      },
    ],
  },
];
