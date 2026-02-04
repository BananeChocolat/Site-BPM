import GrandMA2Logo from "@/assets/grandMA2-Photoroom.png";
import QLClogo from "@/assets/QLC+.png";
import TechnoParadeLogo from "@/assets/technoparad.png";
import TedxLogo from "@/assets/tedx.png";
import TspLogo from "@/assets/tsp.png";
import ImtLogo from "@/assets/logo_IMT_BS_W.png";
import ParisLogo from "@/assets/paris.png";
import LanetLogo from "@/assets/lanet.png";
import NavaLogo from "@/assets/nava.png";
import SketLogo from "@/assets/sket.png";
import VectorworksLogo from "@/assets/unnamed.jpg";
import CaptureLogo from "@/assets/Capture.png";

export type LogoItem = {
  image: string;
  alt: string;
  primary?: string;
};

export const softwareLogos: LogoItem[] = [
  { image: GrandMA2Logo, alt: "grandMA2", primary: "grandMA2" },
  { image: QLClogo, alt: "QLC+", primary: "QLC+" },
  { image: SketLogo, alt: "SketchUp", primary: "SketchUp" },
  { image: VectorworksLogo, alt: "Vectorworks", primary: "Vectorworks" },
  { image: CaptureLogo, alt: "Capture", primary: "Capture" }
];

export const trustLogos: LogoItem[] = [
  { image: TechnoParadeLogo, alt: "Techno Parade", primary: "Techno Parade" },
  { image: TedxLogo, alt: "TEDx", primary: "TEDx" },
  { image: TspLogo, alt: "TSP", primary: "TSP" },
  { image: ImtLogo, alt: "IMT Business School", primary: "IMT Business School" },
  { image: ParisLogo, alt: "Paris", primary: "Paris" },
  { image: LanetLogo, alt: "LANET", primary: "LANET" },
  { image: NavaLogo, alt: "Nava", primary: "Nava" }
];
