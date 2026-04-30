import Image from "next/image";
import { BRAND_LOGO_SRC } from "@/lib/brand-logo";

/**
 * Brand PNG in /public. `unoptimized` keeps alpha clean (no sharp pipeline flattening the plate).
 */
export function BrandMark({
  className,
  priority,
}: {
  className?: string;
  /** Pass true for the hero (LCP). */
  priority?: boolean;
}) {
  return (
    <Image
      src={BRAND_LOGO_SRC}
      alt=""
      width={800}
      height={500}
      unoptimized
      className={className}
      priority={priority}
    />
  );
}
