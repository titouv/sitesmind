"use client";

export {
  Sun,
  Moon,
  TwitterLogo,
  CheckCircle,
  PaperPlaneRight,
  ChatTeardropDots,
  Lightning,
  Globe,
  Paperclip,
  User,
  Article,
  GithubLogo,
} from "@phosphor-icons/react";

type IconProps = any;

export const Logo = (props: IconProps) => (
  <img alt="logo" src="/icon.svg" {...props} />
);
