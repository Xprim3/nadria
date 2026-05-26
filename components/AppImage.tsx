import NextImage, { type ImageProps } from "next/image";

function isRemoteImageSource(src: ImageProps["src"]) {
  return typeof src === "string" && /^https?:\/\//.test(src);
}

/**
 * Remote CDN/storage images can be served directly when Vercel image
 * transformations are unavailable or quota-limited.
 */
export default function AppImage({ unoptimized, ...props }: ImageProps) {
  return (
    <NextImage
      {...props}
      unoptimized={unoptimized ?? isRemoteImageSource(props.src)}
    />
  );
}
