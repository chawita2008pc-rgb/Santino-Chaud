import {
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isMobileState, setIsMobileState] = useState<boolean>(() => window.innerWidth < 768);

  const scrollProgressRef = useRef(0);
  const doneRef = useRef(false); // once true, never intercept scroll again
  const isMobileRef = useRef(window.innerWidth < 768);
  const rafRef = useRef<number | null>(null);
  const touchStartYRef = useRef(0);

  // DOM refs — imperatively updated, zero React re-renders during scroll
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const mediaContainerRef = useRef<HTMLDivElement | null>(null);
  const textLeftRef = useRef<HTMLHeadingElement | null>(null);
  const textRightRef = useRef<HTMLHeadingElement | null>(null);
  const dateRef = useRef<HTMLParagraphElement | null>(null);
  const scrollHintRef = useRef<HTMLParagraphElement | null>(null);

  const applyProgress = useCallback((progress: number, isMobile: boolean) => {
    if (mediaContainerRef.current) {
      if (isMobile) {
        mediaContainerRef.current.style.width = `${80 + progress * 15}vw`;
        mediaContainerRef.current.style.height = `${40 + progress * 36}vh`;
      } else {
        mediaContainerRef.current.style.width = `${300 + progress * 1250}px`;
        mediaContainerRef.current.style.height = `${400 + progress * 400}px`;
      }
    }
    if (bgRef.current) {
      bgRef.current.style.opacity = String(Math.max(0, 1 - progress));
    }
    const tx = progress * (isMobile ? 180 : 150);
    if (textLeftRef.current) textLeftRef.current.style.transform = `translateX(-${tx}vw)`;
    if (textRightRef.current) textRightRef.current.style.transform = `translateX(${tx}vw)`;
    if (dateRef.current) dateRef.current.style.transform = `translateX(-${tx}vw)`;
    if (scrollHintRef.current) scrollHintRef.current.style.transform = `translateX(${tx}vw)`;
  }, []);

  const onComplete = useCallback(() => {
    doneRef.current = true;
    setShowContent(true);
  }, []);

  useEffect(() => {
    scrollProgressRef.current = 0;
    doneRef.current = false;
    setShowContent(false);
    applyProgress(0, isMobileRef.current);
  }, [mediaType, applyProgress]);

  useEffect(() => {
    // Only capture scroll when hero is at/near the top of viewport
    const isHeroVisible = () => {
      if (!sectionRef.current) return false;
      const rect = sectionRef.current.getBoundingClientRect();
      return rect.top <= 10 && rect.top >= -50;
    };

    const advance = (delta: number) => {
      if (doneRef.current) return;
      const newProgress = Math.min(Math.max(scrollProgressRef.current + delta, 0), 1);
      scrollProgressRef.current = newProgress;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        applyProgress(newProgress, isMobileRef.current);
        if (newProgress >= 1) onComplete();
      });
    };

    const handleWheel = (e: globalThis.WheelEvent) => {
      if (doneRef.current) return;
      if (!isHeroVisible()) return;
      e.preventDefault();
      advance(e.deltaY * 0.002); // 2× faster than before
    };

    const handleTouchStart = (e: globalThis.TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (doneRef.current) return;
      if (!isHeroVisible()) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchY;
      touchStartYRef.current = touchY;
      e.preventDefault();
      advance(deltaY * 0.012); // ~2 swipes to complete
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = 0;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applyProgress, onComplete]);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      isMobileRef.current = mobile;
      setIsMobileState(mobile);
      applyProgress(scrollProgressRef.current, mobile);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile, { passive: true });
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [applyProgress]);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div ref={sectionRef} className='overflow-x-hidden w-full'>
      <section className='relative flex flex-col items-center justify-start min-h-[100dvh] w-full'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>

          <div ref={bgRef} className='absolute inset-0 z-0 h-full w-full'>
            <img
              src={bgImageSrc}
              alt='Background'
              className='w-full h-full object-cover object-center'
            />
            <div className='absolute inset-0 bg-zinc-950/20' />
          </div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10 w-full'>
            <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>

              <div
                ref={mediaContainerRef}
                className='absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl'
                style={{
                  width: isMobileState ? '80vw' : '300px',
                  height: isMobileState ? '40vh' : '400px',
                  maxWidth: '95vw',
                  maxHeight: '88vh',
                  boxShadow: '0px 0px 50px rgba(0,0,0,0.5)',
                }}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className='relative w-full h-full pointer-events-none'>
                      <iframe
                        width='100%'
                        height='100%'
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc + (mediaSrc.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                            : mediaSrc.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' + mediaSrc.split('v=')[1]
                        }
                        className='w-full h-full rounded-xl'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className='relative w-full h-full pointer-events-none'>
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload='auto'
                        className='w-full h-full object-cover rounded-xl'
                        style={{ objectPosition: isMobileState ? 'center center' : 'center 20%' }}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <div className='absolute inset-0 bg-black/15 rounded-xl pointer-events-none' />
                    </div>
                  )
                ) : (
                  <div className='relative w-full h-full'>
                    <img
                      src={mediaSrc}
                      alt={title || 'Media content'}
                      className='w-full h-full object-cover rounded-xl'
                    />
                    <div className='absolute inset-0 bg-black/20 rounded-xl' />
                  </div>
                )}

                <div className='flex flex-col items-center text-center relative z-10 mt-4'>
                  {date && (
                    <p ref={dateRef} className='text-xl md:text-2xl text-blue-400 font-mono tracking-widest uppercase will-change-transform'>
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p ref={scrollHintRef} className='text-slate-300 font-medium text-sm md:text-base tracking-widest uppercase mt-4 opacity-70 will-change-transform'>
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <h2
                  ref={textLeftRef}
                  className='text-5xl md:text-7xl lg:text-9xl font-black font-display text-white uppercase tracking-tighter will-change-transform'
                >
                  {firstWord}
                </h2>
                <h2
                  ref={textRightRef}
                  className='text-5xl md:text-7xl lg:text-9xl font-black font-display text-center text-transparent tracking-tighter uppercase will-change-transform'
                  style={{ WebkitTextStroke: '2px white' }}
                >
                  {restOfTitle}
                </h2>
              </div>
            </div>

            <motion.section
              className='flex flex-col w-full'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
