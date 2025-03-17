
import { 
  Github, 
  LucideProps,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube
} from "lucide-react";

export const Icons = {
  gitHub: Github,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  logo: (props: LucideProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="24" height="24" rx="4" fill="currentColor" />
      <path
        d="M12 17V7M7 12h10"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
