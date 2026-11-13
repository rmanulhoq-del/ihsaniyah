import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
}

export function ResilientImage({ src, alt, className = '', caption }: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="w-full h-full flex flex-col">
      {!failed ? (
        <div className="relative w-full h-full overflow-hidden bg-[#EFEAE0] dark:bg-[#16233B]">
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className={`w-full h-full object-cover ${className}`}
          />
        </div>
      ) : (
        <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-6 text-center bg-[#EFEAE0] dark:bg-[#16233B] border border-[#E3DCCB] dark:border-[#1F3254]">
          <BookOpen className="w-7 h-7 text-[#8B5E2A] dark:text-[#D4AF6A] mb-2" />
          <span className="text-sm font-editorial text-[#57534E] dark:text-[#9BAAC4]">{alt}</span>
        </div>
      )}
      {caption && (
        <figcaption className="text-xs font-editorial italic text-[#57534E] dark:text-[#9BAAC4] mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
