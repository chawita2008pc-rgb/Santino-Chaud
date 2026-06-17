import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Instagram } from 'lucide-react';

type Page = 'home' | 'about';
type Section = 'about' | 'learn' | 'drives';

interface Props {
  onNavigate: (page: Page) => void;
}

interface EnneagramType {
  num: number;
  name: string;
  desire: string;
  fear: string;
  shadow: string;
  gift: string;
  isMe: boolean;
  note?: string;
}

const enneagramTypes: EnneagramType[] = [
  { num: 1, name: 'Reformer',    desire: 'Be good, right, perfect',       fear: 'Being corrupt or wrong',              shadow: 'Critical, rigid',                  gift: 'Ethical, disciplined',               isMe: false },
  { num: 2, name: 'Helper',      desire: 'Be loved, needed',              fear: 'Being unloved or unwanted',           shadow: 'People-pleasing, possessive',       gift: 'Warm, generous',                     isMe: false },
  { num: 3, name: 'Achiever',    desire: 'Succeed and be admired',        fear: 'Being worthless or a failure',        shadow: 'Image-obsessed, workaholic',        gift: 'Driven, adaptable, effective',       isMe: true,  note: "This is my primary type. I track PBs obsessively, always measuring myself against standards. Losing bothers me more than it should. I care how things look — my times, my results. The positive side: I'm extremely goal-oriented and I get things done." },
  { num: 4, name: 'Individualist',desire: 'Be authentic, unique',         fear: 'Having no identity or significance', shadow: 'Moody, self-absorbed',              gift: 'Creative, deep, emotionally honest',  isMe: false },
  { num: 5, name: 'Investigator', desire: 'Understand and be capable',    fear: 'Being useless or incompetent',        shadow: 'Detached, hoarding energy',         gift: 'Analytical, perceptive, self-sufficient', isMe: false },
  { num: 6, name: 'Loyalist',    desire: 'Have security and support',     fear: 'Being without guidance or support',   shadow: 'Anxious, suspicious',               gift: 'Reliable, committed, courageous',    isMe: false },
  { num: 7, name: 'Enthusiast',  desire: 'Be satisfied and free',         fear: 'Being trapped in pain or boredom',   shadow: 'Scattered, escapist',               gift: 'Spontaneous, optimistic, versatile', isMe: false },
  { num: 8, name: 'Challenger',  desire: 'Be in control, self-reliant',   fear: 'Being controlled or violated',        shadow: 'Domineering, confrontational',      gift: 'Direct, decisive, protective',       isMe: true,  note: "Strong wing alongside Type 3. I don't wait for permission. I need autonomy. I'm direct, I don't back down, and I get frustrated when things feel out of my control. Shows up a lot in competition and in how I approach training." },
  { num: 9, name: 'Peacemaker',  desire: 'Have peace and harmony',        fear: 'Loss of connection, conflict',        shadow: 'Avoidant, passive',                 gift: 'Calm, inclusive, patient',           isMe: false },
];

const intelligences = [
  { name: 'Bodily-kinesthetic',   pct: 95 },
  { name: 'Spatial',              pct: 78 },
  { name: 'Intrapersonal',        pct: 95 },
  { name: 'Interpersonal',        pct: 60 },
  { name: 'Logical-mathematical', pct: 42 },
  { name: 'Musical',              pct: 90 },
  { name: 'Linguistic',           pct: 28 },
];

const questions = [
  {
    q: 'Who am I at this moment?',
    a: "I'm a competitive U20 sprinter and jumper, and right now athletics is basically my whole world. I train seriously, eat clean — zero processed food — sleep well, and repeat. I'm in my last year of school and trying to squeeze every bit of progress I can before the season. I also have ideas for things I want to build down the line, but for now the focus is simple: get faster, jump further, recover well.",
  },
  {
    q: 'What questions do I have about my future?',
    a: "The big one: is my athletic level good enough to pursue the NCAA/NAIA route in the US? Can I hit 10.50 or better and get to 7.00m in the long jump? And beyond athletics — what do I actually want to build? I'm figuring out what kind of life I want: Argentina, the US, or somewhere else entirely.",
  },
  {
    q: 'What feels important right now?',
    a: "Breaking personal bests. Getting my body right — food, sleep, training load. Finishing school strong. Not overthinking the future and just being consistent day to day.",
  },
];

const tabs: { id: Section; label: string }[] = [
  { id: 'about',  label: 'About me' },
  { id: 'learn',  label: 'How I learn' },
  { id: 'drives', label: 'What drives me' },
];

export default function About({ onNavigate }: Props) {
  const [activeSection, setActiveSection] = useState<Section>('about');
  const [selectedType, setSelectedType] = useState<number | null>(null);

  const selectedTypeData = enneagramTypes.find(t => t.num === selectedType) ?? null;

  const handleTab = (id: Section) => {
    setActiveSection(id);
    setSelectedType(null);
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-blue-600">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference px-6 lg:px-12 py-6 flex justify-between items-center pointer-events-none">
        <button
          onClick={() => onNavigate('home')}
          className="font-display font-bold text-xl tracking-wider text-white pointer-events-auto cursor-pointer"
        >
          S.CHAUD
        </button>
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase">
          <button onClick={() => onNavigate('home')} className="cursor-pointer pointer-events-auto hover:text-blue-400 transition-colors">
            Home
          </button>
          <span className="pointer-events-auto text-blue-400">About</span>
        </div>
      </nav>

      {/* ── Page Header ── */}
      <div className="pt-32 pb-12 px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-mono tracking-widest font-bold mb-8">
            PORTFOLIO
          </div>
          <h1 className="text-7xl md:text-[10rem] leading-none font-display font-black uppercase tracking-tighter">
            Who Am <span className="text-transparent" style={{ WebkitTextStroke: '2px #fff' }}>I.</span>
          </h1>
        </motion.div>
      </div>

      {/* ── Sticky Tab Navigation ── */}
      <div className="sticky top-[72px] z-40 bg-[#050505]/95 backdrop-blur-sm border-b border-zinc-900 px-6 py-4">
        <div className="flex gap-3 max-w-7xl mx-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-mono tracking-widest uppercase transition-all border ${
                activeSection === tab.id
                  ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                  : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Section Content ── */}
      <AnimatePresence mode="wait">

        {/* ABOUT ME */}
        {activeSection === 'about' && (
          <motion.section
            key="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="w-full py-24 px-6 lg:px-12"
          >
            <div className="max-w-6xl mx-auto space-y-16">

              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-mono tracking-widest font-bold mb-6">
                  SECTION 01
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter">
                  Where I <span className="text-transparent" style={{ WebkitTextStroke: '2px #fff' }}>am now.</span>
                </h2>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '10.70', label: '100m PB', unit: 's' },
                  { value: '6.40m', label: 'Long Jump PB' },
                  { value: '12.15m', label: 'Triple Jump PB' },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 md:p-10 border border-zinc-800 rounded-2xl bg-zinc-900/50 backdrop-blur-sm text-center"
                  >
                    <p className="text-4xl md:text-6xl font-display font-black text-white mb-3">{stat.value}</p>
                    <p className="font-mono text-zinc-500 text-xs tracking-widest uppercase">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Question cards */}
              <div className="grid md:grid-cols-3 gap-6">
                {questions.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/50 backdrop-blur-sm space-y-4"
                  >
                    <p className="font-mono text-blue-400 text-xs tracking-widest">0{idx + 1}</p>
                    <h3 className="font-display font-bold text-base uppercase leading-snug">{item.q}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed font-light">{item.a}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="border-l-2 border-blue-500 pl-8 py-2"
              >
                <p className="text-2xl md:text-3xl font-display font-light italic text-zinc-300">
                  "The secret of getting ahead is getting started."
                </p>
              </motion.div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                {['Sprinter & jumper', 'Karting champion', 'Clean eating', 'Buenos Aires', "Bede's Grammar School"].map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 border border-zinc-800 rounded-full text-sm font-mono text-zinc-400 hover:border-zinc-600 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

            </div>
          </motion.section>
        )}

        {/* HOW I LEARN */}
        {activeSection === 'learn' && (
          <motion.section
            key="learn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="w-full py-24 px-6 lg:px-12"
          >
            <div className="max-w-6xl mx-auto space-y-16">

              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-mono tracking-widest font-bold mb-6">
                  SECTION 02
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter">
                  How I <span className="text-transparent" style={{ WebkitTextStroke: '2px #fff' }}>learn.</span>
                </h2>
              </div>

              {/* What are MI? */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 border border-zinc-800 rounded-2xl bg-zinc-900/50 backdrop-blur-sm"
              >
                <p className="font-mono text-blue-400 text-xs tracking-widest mb-4">THEORY</p>
                <h3 className="font-display font-bold text-2xl uppercase mb-4">What are Multiple Intelligences?</h3>
                <p className="text-zinc-400 leading-relaxed font-light max-w-3xl">
                  Howard Gardner's theory says intelligence isn't one single thing. Each person has a profile of different abilities — some stronger, some weaker. You can be bad at reading but incredible at sports, or terrible at music but great at logic. The idea is that 'smart' looks different for everyone.
                </p>
              </motion.div>

              {/* Progress bars */}
              <div className="space-y-5">
                <p className="font-mono text-zinc-500 text-xs tracking-widest uppercase mb-6">My Intelligence Profile</p>
                {intelligences.map((intel, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.07 }}
                    className="flex items-center gap-4"
                  >
                    <span className="font-mono text-xs text-zinc-400 w-48 shrink-0">{intel.name}</span>
                    <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${intel.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: idx * 0.09 + 0.2 }}
                        className={`h-full rounded-full ${
                          intel.pct >= 70 ? 'bg-blue-500' : intel.pct >= 50 ? 'bg-blue-500/60' : 'bg-zinc-600'
                        }`}
                      />
                    </div>
                    <span className="font-mono text-sm font-bold text-zinc-400 w-10 text-right">{intel.pct}%</span>
                  </motion.div>
                ))}
              </div>

              {/* Top two cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 border border-blue-500/30 rounded-2xl bg-blue-500/5"
                >
                  <p className="font-mono text-blue-400 text-xs tracking-widest mb-3">STRONGEST</p>
                  <h3 className="font-display font-bold text-2xl uppercase mb-4">Bodily-kinesthetic</h3>
                  <p className="text-zinc-400 leading-relaxed font-light">
                    I learn by doing. In athletics I figure out technique through repetition and feel, not by reading a manual. I have to physically experience something to really get it.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="p-8 border border-zinc-800 rounded-2xl bg-zinc-900/50"
                >
                  <p className="font-mono text-zinc-500 text-xs tracking-widest mb-3">SECOND</p>
                  <h3 className="font-display font-bold text-2xl uppercase mb-4">Intrapersonal</h3>
                  <p className="text-zinc-400 leading-relaxed font-light">
                    I spend a lot of time looking inward — reflecting on how I feel, what I want, and why I do things. I imagine scenarios, think through decisions in my head, and understand myself better than most people around me. My inner world is very active.
                  </p>
                </motion.div>
              </div>

              {/* Reflection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 border border-zinc-800 rounded-2xl bg-zinc-900/50"
              >
                <p className="font-mono text-blue-400 text-xs tracking-widest mb-4">REFLECTION</p>
                <h3 className="font-display font-bold text-2xl uppercase mb-4">How does this shape how I learn and decide?</h3>
                <p className="text-zinc-400 leading-relaxed font-light max-w-3xl">
                  I get bored fast with pure theory. I need to try things to understand them. In training that's a huge advantage — I iterate fast, I'm not scared to experiment, and I adjust quickly. In school it can be harder — sitting through explanations when I'd rather just do the exercise — but I usually land on things by applying them. Reading and writing aren't my strongest tools, so I rely on doing, watching, and feeling instead.
                </p>
              </motion.div>

            </div>
          </motion.section>
        )}

        {/* WHAT DRIVES ME */}
        {activeSection === 'drives' && (
          <motion.section
            key="drives"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="w-full py-24 px-6 lg:px-12"
          >
            <div className="max-w-6xl mx-auto space-y-16">

              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-mono tracking-widest font-bold mb-6">
                  SECTION 03
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter">
                  What <span className="text-transparent" style={{ WebkitTextStroke: '2px #fff' }}>drives me.</span>
                </h2>
                <p className="text-zinc-500 font-light mt-4">
                  Click any type to explore. Types marked <span className="text-blue-400 font-mono">— ME</span> are my results.
                </p>
              </div>

              {/* 3×3 Grid */}
              <div className="grid grid-cols-3 gap-3">
                {enneagramTypes.map(type => (
                  <motion.button
                    key={type.num}
                    onClick={() => setSelectedType(selectedType === type.num ? null : type.num)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-4 md:p-6 rounded-xl border text-left transition-all cursor-pointer ${
                      type.isMe
                        ? 'border-blue-500/40 bg-blue-500/10 hover:border-blue-500/70'
                        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'
                    } ${selectedType === type.num ? 'ring-1 ring-blue-400 border-blue-400/50' : ''}`}
                  >
                    <p className="font-mono text-zinc-500 text-xs mb-2">{String(type.num).padStart(2, '0')}</p>
                    <p className="font-display font-bold text-sm md:text-base uppercase">{type.name}</p>
                    {type.isMe && (
                      <span className="text-xs text-blue-400 font-mono tracking-widest mt-1 block">— ME</span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Detail Panel */}
              <AnimatePresence mode="wait">
                {selectedTypeData && (
                  <motion.div
                    key={selectedType}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`p-8 rounded-2xl border ${
                      selectedTypeData.isMe
                        ? 'border-blue-500/40 bg-blue-500/5'
                        : 'border-zinc-800 bg-zinc-900/50'
                    }`}
                  >
                    {/* Type name */}
                    <div className="mb-8">
                      <p className="font-mono text-zinc-500 text-xs mb-3 tracking-widest">
                        {String(selectedTypeData.num).padStart(2, '0')} — ENNEAGRAM
                      </p>
                      <h3 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tighter">
                        {selectedTypeData.name}
                        {selectedTypeData.isMe && (
                          <span className="text-blue-400 ml-4 text-2xl md:text-3xl">— ME</span>
                        )}
                      </h3>
                    </div>

                    {/* 4 attribute cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {[
                        { label: 'CORE DESIRE', value: selectedTypeData.desire },
                        { label: 'CORE FEAR',   value: selectedTypeData.fear },
                        { label: 'GIFT',         value: selectedTypeData.gift },
                        { label: 'SHADOW SIDE',  value: selectedTypeData.shadow },
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/60">
                          <p className="font-mono text-zinc-500 text-xs mb-2 tracking-widest">{item.label}</p>
                          <p className="font-display font-bold text-sm uppercase leading-snug">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Personal note */}
                    {selectedTypeData.note && (
                      <div className="border-l-2 border-blue-500 pl-6 py-2">
                        <p className="font-mono text-blue-400 text-xs tracking-widest mb-3">PERSONAL NOTE</p>
                        <p className="text-zinc-300 leading-relaxed font-light">{selectedTypeData.note}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.section>
        )}

      </AnimatePresence>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-zinc-900 py-16 bg-[#050505]">
        <div className="container mx-auto px-6 lg:px-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="font-display font-black text-3xl mb-2">SANTINO CHAUD</h2>
            <p className="text-zinc-500 flex items-center justify-center md:justify-start gap-2">
              <MapPin size={16} /> Buenos Aires, Argentina
            </p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
