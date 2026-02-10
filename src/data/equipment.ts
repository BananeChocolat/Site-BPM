import CDJImg from "@/assets/CDJ.png";
import KS118Img from "@/assets/ks118.png";
import X32Img from "@/assets/x32.png";
import Beam5RImg from "@/assets/beam.png";
import EcranImg from "@/assets/ecran.png";

export type EquipmentCard = {
  id?: string;
  label: string;
  title: string;
  description: string;
  image?: string;
  large?: boolean;
  imageOffsetY?: number | string;
  imageHeight?: string;
  cardOffsetY?: number | string;
  gridColumn?: string;
  gridRow?: string;
};

export const equipmentCards: EquipmentCard[] = [
  {
    id: "beam-5r",
    label: "Éclairage",
    title: "Beam 5R",
    description: "Poursuites puissantes pour des effets scéniques dynamiques.",
    image: Beam5RImg,
    gridColumn: "1 / span 1",
    gridRow: "1"
  },
  {
    id: "ecrans-led",
    label: "Effets",
    title: "Écrans LED",
    description: "Mur LED haute résolution pour visuels lumineux et immersifs.",
    image: EcranImg,
    gridColumn: "2 / span 1",
    gridRow: "1"
  },
  {
    id: "cdj-2000-nexus-2",
    label: "DJ",
    title: "CDJ-2000 Nexus 2",
    description: "Lecteurs DJ Pioneer haut de gamme, standard des clubs.",
    image: CDJImg,
    gridColumn: "3 / span 2",
    gridRow: "1"
  },
  {
    id: "qsc-ks118",
    label: "Basses",
    title: "QSC sKS118",
    description: "Caisson de basses performant, grave profond et percutant.",
    image: KS118Img,
    gridColumn: "1 / span 2",
    gridRow: "1"
  },
  {
    id: "behringer-x32",
    label: "Mixage",
    title: "Behringer X32",
    description: "Console numérique puissante avec effets intégrés pour le live.",
    image: X32Img,
    gridColumn: "3 / span 1",
    gridRow: "2"
  },
  {
    id: "grandma-command-wing",
    label: "Contrôle",
    title: "GrandMA Command Wing",
    description: "Contrôleur lumière pro pour une gestion fine des shows.",
    gridColumn: "4 / span 1",
    gridRow: "2"
  }
];
