import NextImage from "next/image";

interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
  unoptimized?: boolean;
}

const Image = ({ src, alt, className = "", unoptimized = false }: ImageProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <NextImage
        src={src}
        unoptimized={unoptimized}
        alt={`${alt} image`}
        // layout="responsive"
        // width={1000}
        // height={1000}
        fill
        className={`relative object-cover w-full h-auto`}
      />
    </div>
  );
};

export default Image;