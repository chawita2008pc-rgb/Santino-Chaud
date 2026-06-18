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
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [isMobileState, setIsMobileState] = useState<boolean>(() => window.innerWidth < 768);

  // Refs — never trigger re-renders
  const scrollProgressRef = useRef(0);
  const mediaFullyExpandedRef = useRef(false);
  const touchStartYRef = useRef(0);
  const isMobileRef = useRef(window.innerWidth < 768);
  const rafRef = useRef<number | null>(null);

  // DOM refs — updated imperatively to bypass React re-render on every scroll frame
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const mediaContainerRef = useRef<HTMLDivElement | null>(null);
  const textLeftRef = useRef<HTMLHeadingElement | null>(null);
  const textRightRef = useRef<HTMLHeadingElement | null>(null);
  const dateRef = useRef<HTMLParagraphElement | null>(null);
  const scrollHintRef = useRef<HTMLParagraphElement | null>(null);

  // Direct DOM updates — no React state, no re-render
  const applyProgress = useCallback((progress: number, isMobile: boolean) => {
    if (mediaContainerRef.current) {
      if (isMobile) {
        // Portrait-friendly sizing on mobile: 80vw×52vh → 95vw×88vh
        const w = 80 + progress * 15;
        const h = 52 + progress * 36;
        mediaContainerRef.current.style.width = `${w}vw`;
        mediaContainerRef.current.style.height = `${h}vh`;
      } else {
        const w = 300 + progress * 1250;
        const h = 400 + progress * 400;
        mediaContainerRef.current.style.width = `${w}px`;
        mediaContainerRef.current.style.height = `${h}px`;
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

  useEffect(() => {
    scrollProgressRef.current = 0;
    mediaFullyExpandedRef.current = false;
    setShowContent(false);
    setMediaFullyExpanded(false);
    applyProgress(0, isMobileRef.current);
  }, [mediaType, applyProgress]);

  useEffect(() => {
    const handleWheel = (e: globalThis.WheelEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isInView = rect.top <= 10 && rect.bottom >= window.innerHeight;
      if (!isInView) return;

      const fullyExpanded = mediaFullyExpandedRef.current;
      const progress = scrollProgressRef.current;

      if (fullyExpanded && e.deltaY < 0 && rect.top >= -5) {
        e.preventDefault();
        mediaFullyExpandedRef.current = false;
        setMediaFullyExpanded(false);
      } else if (!fullyExpanded) {
        e.preventDefault();
        const newProgress = Math.min(Math.max(progress + e.deltaY * 0.0009, 0), 1);
        scrollProgressRef.current = newProgress;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          applyProgress(newProgress, isMobileRef.current);
          if (newProgress >= 1) {
            mediaFullyExpandedRef.current = true;
            setMediaFullyExpanded(true);
            setShowContent(true);
          } else if (newProgress < 0.75) {
            setShowContent(false);
          }
        });
      }
    };

    const handleTouchStart = (e: globalThis.TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (!touchStartYRef.current || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isInView = rect.top <= 10 && rect.bottom >= window.innerHeight;
      if (!isInView) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchY;
      const fullyExpanded = mediaFullyExpandedRef.current;
      const progress = scrollProgressRef.current;

      if (fullyExpanded && deltaY < -20 && rect.top >= -5) {
        e.preventDefault();
        mediaFullyExpandedRef.current = false;
        setMediaFullyExpanded(false);
      } else if (!fullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const newProgress = Math.min(Math.max(progress + deltaY * scrollFactor, 0), 1);
        scrollProgressRef.current = newProgress;
        touchStartYRef.current = touchY;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          applyProgress(newProgress, isMobileRef.current);
          if (newProgress >= 1) {
            mediaFullyExpandedRef.current = true;
            setMediaFullyExpanded(true);
            setShowContent(true);
          } else if (newProgress < 0.75) {
            setShowContent(false);
          }
        });
      }
    };

    const handleTouchEnd = (): void => {
      touchStartYRef.current = 0;
    };

    const handleScroll = (): void => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (!mediaFullyExpandedRef.current && rect.top <= 5 && rect.top >= -5) {
        window.scrollTo({ top: window.scrollY + rect.top });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applyProgress]);

  useEffect(() => {
    const checkIfMobile = (): void => {
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
    <div
      ref={sectionRef}
      className='overflow-x-hidden w-full'
    >
      <section className='relative flex flex-col items-center justify-start min-h-[100dvh] w-full'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>

          {/* Background — opacity driven imperatively */}
          <div
            ref={bgRef}
            className='absolute inset-0 z-0 h-full w-full'
          >
            <img
              src={bgImageSrc}
              alt='Background'
              className='w-full h-full object-cover object-center'
            />
            <div className='absolute inset-0 bg-zinc-950/20' />
          </div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10 w-full'>
            <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>

              {/* Media container — width/height driven imperatively */}
              <div
                ref={mediaContainerRef}
                className='absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl'
                style={{
                  width: isMobileState ? '80vw' : '300px',
                  height: isMobileState ? '52vh' : '400px',
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
                        style={{ objectPosition: 'center 20%' }}
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
                    <p
                      ref={dateRef}
                      className='text-xl md:text-2xl text-blue-400 font-mono tracking-widest uppercase will-change-transform'
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      ref={scrollHintRef}
                      className='text-slate-300 font-medium text-sm md:text-base tracking-widest uppercase mt-4 opacity-70 will-change-transform'
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              {/* Title text — transforms driven imperatively */}
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
