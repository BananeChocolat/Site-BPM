import DomeImg1 from "@/assets/egeg.jpg";
import DomeImg2 from "@/assets/egeggg.jpg";
import DomeImg3 from "@/assets/ec1.jpg";
import DomeImg4 from "@/assets/ec2.jpg";
import DomeImg5 from "@/assets/side.jpg";
import DomeImg6 from "@/assets/samy.jpg";

export type EventImage = {
  src: string;
  alt: string;
};

export const eventImages: EventImage[] = [
  { src: DomeImg1, alt: "Show light 1" },
  { src: DomeImg2, alt: "Show light 2" },
  { src: DomeImg3, alt: "Scene image 1" },
  { src: DomeImg4, alt: "Scene image 2" },
  { src: DomeImg5, alt: "Scene image 3" },
  { src: DomeImg6, alt: "Scene image 4" }
];
