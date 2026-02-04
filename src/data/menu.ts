export type MenuItem = {
  label: string;
  link: string;
  ariaLabel?: string;
};

export type SocialItem = {
  label: string;
  link: string;
};

export const menuItems: MenuItem[] = [
  { label: "Home", link: "/", ariaLabel: "Aller à la page d'accueil" },
  { label: "Équipe", link: "/equipe", ariaLabel: "Voir l'équipe" },
  { label: "Event", link: "/event", ariaLabel: "Voir les événements" }
];

export const socialItems: SocialItem[] = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "SoundCloud", link: "https://soundcloud.com" }
];
