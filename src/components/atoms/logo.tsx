import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  /** Tamanho do ícone em px */
  size?: number;
  showText?: boolean;
  priority?: boolean;
}

/**
 * Logo da aplicação. O import estático da imagem permite ao <Image> do Next.js
 * conhecer largura/altura (evita layout shift) e gerar versões redimensionadas.
 */
export function Logo({ href = "/", className, size = 32, showText = true, priority }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}
      aria-label="MoneyTrack - página inicial"
    >
      <Image src={logo} alt="" width={size} height={size} priority={priority} className="rounded-lg" />
      {showText && <span className="text-lg">MoneyTrack</span>}
    </Link>
  );
}
