
type Link = {
  text: string;
  href: string;
  disabled?: boolean;
}

type SidebarSection = {
  icon?: React.ReactNode;
  title: string;
  links: Link[];
}
