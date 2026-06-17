import { useRef, useEffect, useState } from 'react';
import { Mail, Instagram, MapPin, Trophy, Target, Flag } from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  animate,
} from 'framer-motion';
import ScrollExpandMedia from './components/ui/scroll-expansion-hero';
import { TextReveal } from './components/ui/cascade-text';

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};
const clipReveal = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  visible: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── parallax image wrapper ─── */
function ParallaxImg({ src, alt, className = '', hoverScale = 1.15, imgHeight = 'h-[120%]' }: { src: string; alt: string; className?: string; hoverScale?: number; imgHeight?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  return (
    <div ref={ref} className="w-full h-full overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        variants={{ zoom: { scale: hoverScale } }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full ${imgHeight} object-cover ${className}`}
      />
    </div>
  );
}

/* ─── count-up number ─── */
function CountUp({ to, suffix = '', decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()),
    });
    return controls.stop;
  }, [inView]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* ─── floating blob ─── */
function Blob({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      animate={{ y: [0, -24, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ─── section badge ─── */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.06 }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-mono tracking-widest font-bold"
    >
      {children}
    </motion.div>
  );
}

/* ─── image card with hover + clip reveal ─── */
function ImgCard({
  src, alt, aspect, label, sublabel, className = '', hoverScale = 1.15, imgHeight,
}: {
  src: string; alt: string; aspect: string; label: string; sublabel: string; className?: string; hoverScale?: number; imgHeight?: string;
}) {
  return (
    <motion.div
      variants={clipReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover="zoom"
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${aspect} rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 ${className}`}
    >
      <ParallaxImg src={src} alt={alt} hoverScale={hoverScale} {...(imgHeight ? { imgHeight } : {})} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute bottom-6 left-6 right-6"
      >
        <p className="font-mono text-xs text-blue-400 tracking-widest mb-1">{label}</p>
        <p className="font-display font-bold text-xl uppercase">{sublabel}</p>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  return (
    <>
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-blue-600 overflow-x-hidden">

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 w-full z-50 mix-blend-difference px-6 lg:px-12 py-6 flex justify-between items-center pointer-events-none"
      >
        <a href="#hero" className="font-display font-bold text-xl tracking-wider text-white pointer-events-auto">
          S.CHAUD
        </a>
      </motion.nav>

      {/* ── Hero ── */}
      <div id="hero" className="w-full">
        <ScrollExpandMedia
          mediaType="video"
          mediaSrc="/karting-hero.mov"
          bgImageSrc="/karting-bg.jpeg"
          title="SANTINO CHAUD"
          date="BUENOS AIRES • ARGENTINA"
          scrollToExpand="SCROLLEÁ PARA ARRANCAR"
          textBlend={true}
        >
          <div className="max-w-4xl mx-auto py-12 md:py-24 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-5xl font-display font-light mb-8 text-zinc-300"
            >
              Del simulador a la pista. <br />
              <span className="font-bold text-white italic">Del sueño al campeonato.</span>
            </motion.h2>
          </div>
        </ScrollExpandMedia>
      </div>

      {/* ── 01 El Origen ── */}
      <section className="w-full py-28 lg:py-40 border-t border-zinc-900 relative overflow-hidden">
        <Blob className="right-0 top-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px]" />
        <Blob className="left-1/4 bottom-0 w-[300px] h-[300px] bg-blue-400/3 blur-[100px]" />

        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="space-y-7"
            >
              <Badge>01 / ORIGEN</Badge>

              <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none">
                Miles de<br />
                <span className="text-transparent" style={{ WebkitTextStroke: '2px #ffffff' }}>horas.</span>
              </motion.h2>

              <motion.p variants={fadeUp} className="text-zinc-300 text-xl leading-relaxed font-light">
                Empecé en el simulador. No en la pista, en una pantalla, con volante y pedales, repitiendo cada curva hasta que quedara grabada en el músculo.
              </motion.p>

              <motion.p variants={fadeUp} className="text-zinc-500 text-lg leading-relaxed font-light">
                Miles de horas de práctica construyeron la base técnica que después trasladé al karting real. Cada frenada, cada salida, cada trayectoria aprendida primero en el simulador.
              </motion.p>

              <motion.div variants={scaleIn} className="inline-block p-6 border border-blue-500/20 rounded-2xl bg-blue-500/5">
                <motion.p
                  className="text-5xl font-display font-black text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <CountUp to={2500} suffix="+" />
                </motion.p>
                <p className="font-mono text-zinc-500 text-xs tracking-widest uppercase mt-2">Horas en sim</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <ImgCard src="/simulador.jpeg" alt="Simulador" aspect="aspect-[4/5]" label="EN PISTA" sublabel="Karting real" />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-blue-500/20 rounded-br-3xl pointer-events-none"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 02 Desafío Motor ── */}
      <section className="w-full py-28 lg:py-40 border-t border-zinc-900 relative overflow-hidden">
        <Blob className="left-0 top-0 w-[600px] h-[400px] bg-blue-600/5 blur-[150px]" />

        <div className="container mx-auto px-6 lg:px-12">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="mb-20"
          >
            <Badge><Target className="w-4 h-4" />02 / EL DESAFÍO</Badge>
            <motion.h2 variants={fadeUp} className="text-6xl md:text-9xl font-display font-black uppercase tracking-tighter leading-none mt-6">
              Desafío<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2px #ffffff' }}>Motor.</span>
            </motion.h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              <ImgCard src="/desafio-motor.jpeg" alt="Desafío Motor" aspect="aspect-[3/4]" label="DESAFÍO MOTOR" sublabel="35 pilotos. 1 ganador." hoverScale={1.05} imgHeight="h-full" />

              <div className="grid grid-cols-2 gap-3">
                {[
                  { to: 35, suffix: '', label: 'Competidores' },
                  { to: 1, suffix: '°', label: 'Puesto final' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.6 }}
                    whileHover={{ scale: 1.04, borderColor: 'rgba(59,130,246,0.4)' }}
                    className="p-5 border border-zinc-800 rounded-2xl bg-zinc-900/60 text-center cursor-default"
                  >
                    <p className="text-4xl font-display font-black text-white mb-1">
                      <CountUp to={stat.to} suffix={stat.suffix} />
                    </p>
                    <p className="font-mono text-zinc-500 text-xs tracking-widest uppercase">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="space-y-8 lg:pt-8"
            >
              <motion.p variants={fadeUp} className="text-zinc-200 text-2xl leading-relaxed font-light">
                Me presenté al concurso de{' '}
                <span className="text-white font-semibold">Desafío Motor</span>{' '}
                compitiendo contra <span className="text-white font-semibold">35 pilotos</span>. El premio era una temporada completa pagada en la{' '}
                <span className="text-white font-semibold">Copa Honda</span>.
              </motion.p>

              <motion.p variants={fadeUp} className="text-zinc-400 text-lg leading-relaxed font-light">
                Lo gané. Eso me dio la oportunidad de correr esa temporada con muy poco presupuesto propio, una chance que pocos tienen y que aproveché al máximo.
              </motion.p>

              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(59,130,246,0.15)' }}
                className="p-7 border border-blue-500/25 rounded-2xl bg-blue-500/5 backdrop-blur-sm cursor-default"
              >
                <p className="font-mono text-blue-400 text-xs tracking-widest mb-3">EL PREMIO</p>
                <p className="font-display font-black text-3xl uppercase text-white mb-2">Temporada completa</p>
                <p className="text-zinc-400 font-light text-lg">Copa Honda · sin costo para el piloto</p>
              </motion.div>

              <motion.blockquote variants={fadeUp} className="pl-6 py-1 relative">
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{ originY: 0 }}
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"
                />
                <p className="text-zinc-300 text-xl font-light italic leading-relaxed">
                  "Una oportunidad. Un campeonato."
                </p>
              </motion.blockquote>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 03 Campeón ── */}
      <section className="w-full py-28 lg:py-40 border-t border-zinc-900 relative overflow-hidden">
        <Blob className="inset-0 left-1/4 top-1/4 w-[800px] h-[400px] bg-blue-950/20 blur-[180px]" />

        <div className="container mx-auto px-6 lg:px-12">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-mono tracking-widest font-bold mb-10"
            >
              <motion.span
                animate={{ rotate: [0, 15, -10, 0] }}
                transition={{ duration: 0.6, delay: 1.2, repeat: 2, repeatDelay: 4 }}
              >
                <Trophy className="w-4 h-4" />
              </motion.span>
              03 / EL RESULTADO
            </motion.div>

            <TextReveal
              as="div"
              text="CAMPEÓN"
              fontSize="clamp(5rem, 18vw, 16rem)"
              color="#ffffff"
              hoverColor="#3b82f6"
              staggerDelay={40}
              duration={350}
              className="font-display font-black tracking-tighter"
            />
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-zinc-500 text-xl mt-6 font-light tracking-widest uppercase font-mono"
            >
              Copa Honda · Buenos Aires
            </motion.p>
          </motion.div>

          <ImgCard
            src="/campeon.jpeg"
            alt="Campeón"
            aspect="aspect-[3/4] w-full max-w-lg mx-auto mb-16"
            label="HIGHLIGHT"
            sublabel="El podio"
          />

          <div className="max-w-3xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-zinc-300 text-xl md:text-2xl leading-relaxed font-light"
            >
              Salí campeón. Con poco presupuesto, mucho trabajo y la base que construí en el simulador, demostré que podía competir y ganar en un alto nivel.
            </motion.p>
          </div>

        </div>
      </section>

      {/* ── 04 Primera prueba en 2 tiempos ── */}
      <section className="w-full py-28 lg:py-40 border-t border-zinc-900 relative overflow-hidden">
        <Blob className="right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px]" />

        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="space-y-7"
            >
              <Badge>04 / 2 TIEMPOS</Badge>

              <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none">
                Primera<br />
                <span className="text-transparent" style={{ WebkitTextStroke: '2px #ffffff' }}>prueba.</span>
              </motion.h2>

              <motion.p variants={fadeUp} className="text-zinc-300 text-xl leading-relaxed font-light">
                Probé por primera vez un kart de 2 tiempos en el kartódromo de{' '}
                <span className="text-white font-semibold">Ciudad Evita</span>, con un motor{' '}
                <span className="text-white font-semibold">Rotax de 30 HP</span>.
              </motion.p>

              <motion.p variants={fadeUp} className="text-zinc-400 text-lg leading-relaxed font-light">
                En esa primera prueba quedé a solo{' '}
                <span className="text-white font-semibold">0.4 segundos</span>{' '}
                de un piloto profesional de Rotax.
              </motion.p>

              <motion.div
                variants={scaleIn}
                whileHover={{ scale: 1.03, boxShadow: '0 0 50px rgba(59,130,246,0.2)' }}
                animate={{ boxShadow: ['0 0 0px rgba(59,130,246,0)', '0 0 30px rgba(59,130,246,0.12)', '0 0 0px rgba(59,130,246,0)'] }}
                transition={{ boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
                className="p-6 border border-blue-500/25 rounded-2xl bg-blue-500/5 cursor-default"
              >
                <p className="font-mono text-blue-400 text-xs tracking-widest mb-3">DIFERENCIA AL PROFESIONAL</p>
                <p className="font-display font-black text-6xl text-white">
                  <CountUp to={0.4} suffix="s" decimals={1} />
                </p>
                <p className="text-zinc-400 font-light mt-2">Primera vez en un kart de 2 tiempos</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <ImgCard src="/prueba-rotax.jpeg" alt="Primera prueba Rotax" aspect="aspect-[4/5]" label="CIUDAD EVITA" sublabel="Rotax 30 HP" />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-blue-500/20 rounded-br-3xl pointer-events-none"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 05 El Siguiente Paso ── */}
      <section className="w-full py-28 lg:py-40 border-t border-zinc-900 relative overflow-hidden">
        <Blob className="left-1/2 -translate-x-1/2 top-0 w-[900px] h-[300px] bg-blue-600/8 blur-[160px]" />

        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="space-y-8"
            >
              <Badge><Flag className="w-4 h-4" />05 / EL SIGUIENTE PASO</Badge>

              <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none">
                Categorías<br />
                <span className="text-transparent" style={{ WebkitTextStroke: '2px #ffffff' }}>top.</span>
              </motion.h2>

              <motion.p variants={fadeUp} className="text-zinc-300 text-xl leading-relaxed font-light">
                Ahora quiero pasar a las categorías más exigentes del automovilismo. El nivel es mayor. El presupuesto también.
              </motion.p>

              <motion.p variants={fadeUp} className="text-zinc-400 text-lg leading-relaxed font-light">
                Por eso busco sponsors. Personas o empresas que quieran ser parte de una historia que recién empieza, y que ya tiene un campeonato encima.
              </motion.p>

              <motion.div variants={fadeUp} className="space-y-2">
                <p className="text-base tracking-widest uppercase mb-5 text-white [font-family:'Montserrat',sans-serif] font-black [text-shadow:0_0_12px_rgba(255,255,255,0.9),0_0_30px_rgba(255,255,255,0.5),0_0_60px_rgba(255,255,255,0.2)]">Lo que obtenés</p>
                {[
                  { label: 'Menciones en Historias', desc: 'Presencia directa con tu audiencia' },
                  { label: 'Reels', desc: 'Producto mostrado + etiqueta en la descripción' },
                  { label: 'Sorteos', desc: 'Alto engagement con tu marca como protagonista' },
                  { label: 'Menciones especiales', desc: 'Integradas dentro de los videos' },
                  { label: 'Reviews de productos', desc: 'Contenido auténtico y detallado' },
                  { label: 'Presencia en vlogs', desc: 'Pop-up + uso orgánico del producto' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    whileHover={{ x: 6, borderColor: 'rgba(96,165,250,0.5)' }}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-transparent hover:from-blue-500/20 transition-all duration-300 cursor-default"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, repeatDelay: 3 }}
                      className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0 group-hover:bg-blue-500/30 group-hover:border-blue-400/70 transition-all"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:bg-blue-300" />
                    </motion.div>
                    <div>
                      <p className="text-white font-bold text-base group-hover:text-blue-100 transition-colors">{item.label}</p>
                      <p className="text-zinc-400 text-sm font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.a
                variants={fadeUp}
                href="mailto:"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-display font-black uppercase tracking-widest text-base rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.6 }}
                />
                Hablemos
                <motion.span
                  className="inline-block"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >→</motion.span>
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <ImgCard src="/categoria-top.png" alt="Categoría top" aspect="aspect-video" label="PRÓXIMO NIVEL" sublabel="El futuro es ahora" />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-blue-500/20 rounded-tl-3xl pointer-events-none"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full border-t border-zinc-900 py-16 bg-[#050505]"
      >
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display font-black text-3xl mb-2"
            >
              SANTINO CHAUD
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-zinc-500 flex items-center justify-center md:justify-start gap-2"
            >
              <MapPin size={16} /> Buenos Aires, Argentina
            </motion.p>
          </div>
          <div className="flex gap-6">
            {[
              { Icon: Instagram, href: '#' },
              { Icon: Mail, href: '#' },
            ].map(({ Icon, href }, i) => (
              <motion.a
                key={i}
                href={href}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3, type: 'spring', stiffness: 300, damping: 18 }}
                whileHover={{ scale: 1.15, rotate: 8, backgroundColor: '#ffffff', color: '#000000' }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center transition-colors"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.footer>

    </div>

    {/* ── WhatsApp floating button ── */}
    <motion.a
      href="https://wa.me/5491160022197"
      onClick={(e: MouseEvent) => {
        e.preventDefault();
        const phone = '5491160022197';
        window.location.href = `whatsapp://send?phone=${phone}`;
        setTimeout(() => {
          window.open(`https://wa.me/${phone}`, '_blank');
        }, 1500);
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_4px_36px_rgba(37,211,102,0.65)] transition-shadow"
      aria-label="Contactar por WhatsApp"
    >
      <svg viewBox="0 0 32 32" fill="white" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.67 4.8 1.836 6.795L2 30l7.404-1.812A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.56 11.56 0 01-5.893-1.61l-.422-.25-4.393 1.074 1.106-4.27-.276-.44A11.56 11.56 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.34-8.67c-.348-.174-2.058-1.015-2.378-1.13-.32-.116-.553-.174-.786.174-.232.347-.9 1.13-1.103 1.362-.203.232-.406.26-.754.087-.348-.174-1.47-.542-2.8-1.726-1.034-.923-1.732-2.063-1.935-2.41-.203-.348-.022-.536.153-.71.157-.155.348-.406.522-.61.174-.202.232-.347.348-.579.116-.232.058-.435-.029-.61-.087-.173-.786-1.894-1.077-2.594-.283-.682-.57-.59-.786-.6l-.67-.012c-.232 0-.61.087-.928.435-.319.348-1.22 1.19-1.22 2.902s1.249 3.366 1.423 3.598c.174.232 2.457 3.75 5.955 5.262.833.36 1.482.574 1.988.734.835.265 1.595.228 2.196.138.67-.1 2.058-.841 2.348-1.655.29-.813.29-1.51.203-1.655-.086-.145-.319-.232-.667-.406z" />
      </svg>
    </motion.a>
    </>
  );
}
