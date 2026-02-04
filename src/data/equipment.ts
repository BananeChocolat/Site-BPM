import CDJImg from "@/assets/CDJ.png";
import KS118Img from "@/assets/ks118.png";
import X32Img from "@/assets/x32.png";
import Beam5RImg from "@/assets/beam.png";
import EcranImg from "@/assets/ecran.png";

export type EquipmentCard = {
  label: string;
  title: string;
  description: string;
  image?: string;
  large?: boolean;
  imageOffsetY?: number;
  imageHeight?: string;
};

export const equipmentCards: EquipmentCard[] = [
  {
    label: "Éclairage",
    title: "Beam 5R",
    description: "Poursuites puissantes pour des effets scéniques dynamiques.",
    image: Beam5RImg
  },
  {
    label: "Effets",
    title: "Écrans LED",
    description: "Mur LED haute résolution pour visuels lumineux et immersifs.",
    image: EcranImg
  },
  {
    label: "Mixage",
    title: "Behringer X32",
    description: "Console numérique puissante avec effets intégrés pour le live.",
    image: X32Img,
    imageOffsetY: 6,
    imageHeight: "clamp(120px, 24vh, 190px)"
  },
  {
    label: "Basses",
    title: "QSC KS118",
    description: "Caisson de basses performant, grave profond et percutant.",
    image: KS118Img
  },
  {
    label: "Contrôle",
    title: "GrandMA Command Wing",
    description: "Contrôleur lumière pro pour une gestion fine des shows."
  },
  {
    label: "DJ",
    title: "CDJ-2000 Nexus 2",
    description: "Lecteurs DJ Pioneer haut de gamme, standard des clubs.",
    image: CDJImg,
    large: true
  }
];
