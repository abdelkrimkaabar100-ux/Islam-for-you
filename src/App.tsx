/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { 
  Compass, 
  Wind, 
  Leaf, 
  Sun, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  Bird,
  Volume2,
  Globe
} from 'lucide-react';

import './lib/i18n';
import { Scene } from './components/3d/MainScene';
import { AIGuide } from './components/ui/AIGuide';
import { cn } from './lib/utils';

const JOURNEY_STEPS = [
  { id: 'chaos', color: 'from-slate-950 to-slate-900', img: '/src/assets/images/jahiliyyah_chaos_1779201770991.png' },
  { id: 'mercy', color: 'from-emerald-950 to-emerald-900', img: '/src/assets/images/medina_masjid_serene_1779187648478.png' },
  { id: 'revelation', color: 'from-blue-950 to-indigo-950', img: '/src/assets/images/hira_light_1779201787322.png' },
  { id: 'liberation', color: 'from-sky-950 to-emerald-950', img: '/src/assets/images/liberation_dawn_1779201804632.png' },
  { id: 'destiny', color: 'from-emerald-950 to-amber-950', img: '/src/assets/images/kaaba_holy_glow_1779187631912.png' },
];

export default function App() {
  const { t, i18n } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [reflectionAnswer, setReflectionAnswer] = useState('');

  const toggleLanguage = () => {
    const langs = ['en', 'ar', 'es'];
    const current = i18n.language.split('-')[0];
    const nextIndex = (langs.indexOf(current) + 1) % langs.length;
    i18n.changeLanguage(langs[nextIndex]);
  };

  const getLanguageName = () => {
    const current = i18n.language.split('-')[0];
    if (current === 'ar') return 'English';
    if (current === 'en') return 'Español';
    return 'العربية';
  };

  const nextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, JOURNEY_STEPS.length - 1));
    setShowInsight(false);
    setReflectionAnswer('');
  };
  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
    setShowInsight(false);
  };

  return (
    <div className={cn(
      "min-h-screen font-sans transition-colors duration-1000 selection:bg-emerald-500 selection:text-white bg-slate-950",
      JOURNEY_STEPS[activeStep].color
    )} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Cinematic Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-8 flex justify-between items-center mix-blend-difference">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => setIsJourneyStarted(false)}
        >
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-xl group-hover:border-white transition-all">
            <Bird className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-serif font-light tracking-[0.2em] text-white uppercase italic">
            Islam For You
          </span>
        </motion.div>
        
        <div className="flex items-center gap-8">
          <button 
            onClick={toggleLanguage}
            className="px-6 py-2 border border-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
          >
            {getLanguageName()}
          </button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {!isJourneyStarted ? (
          <motion.main 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="relative h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
          >
            {/* Dark Ambient Background */}
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
               <motion.img 
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.4 }}
                  transition={{ duration: 3 }}
                  src="/src/assets/images/kaaba_holy_glow_1779187631912.png" 
                  className="w-full h-full object-cover grayscale opacity-20"
               />
            </div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="relative z-10 space-y-12"
            >
              <h1 className="text-8xl md:text-[12rem] font-serif font-light text-white leading-none tracking-tighter opacity-90">
                {t('hero.title')}
              </h1>
              <p className="text-xl md:text-3xl text-emerald-100/40 max-w-3xl mx-auto font-light leading-relaxed italic">
                {t('hero.subtitle')}
              </p>
              
              <div className="pt-12">
                <button
                  onClick={() => setIsJourneyStarted(true)}
                  className="group relative px-20 py-8 bg-white text-black rounded-full font-serif text-2xl overflow-hidden transition-all hover:scale-105"
                >
                  <div className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center gap-6">
                    {t('hero.cta')}
                    <ChevronRight className={cn("w-8 h-8 transition-transform group-hover:translate-x-3", i18n.language === 'ar' && "rotate-180 group-hover:-translate-x-3")} />
                  </span>
                </button>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30"
            >
               <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-white">Descend into Deep Reflection</span>
               <div className="w-px h-24 bg-gradient-to-b from-white to-transparent" />
            </motion.div>
          </motion.main>
        ) : (
          <motion.div 
            key="journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-screen overflow-hidden"
          >
            {/* 3D Scene Background */}
            <div className="absolute inset-0 z-0">
               <Canvas dpr={[1, 2]}>
                 <PerspectiveCamera makeDefault position={[0, 0, 7]} />
                 <Suspense fallback={null}>
                   <Scene activeStep={activeStep} />
                   <Environment preset="night" />
                 </Suspense>
                 <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.5} />
               </Canvas>
            </div>

            {/* Layered Image Planes for Depth */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 z-[1] pointer-events-none"
              >
                <img src={JOURNEY_STEPS[activeStep].img} className="w-full h-full object-cover mix-blend-overlay" />
              </motion.div>
            </AnimatePresence>

            {/* Exhibition UI Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-12 lg:p-24 pointer-events-none text-white">
               <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-[0.8em] font-bold opacity-40">Chapter</span>
                    <span className="text-6xl font-serif italic">0{activeStep + 1}</span>
                  </div>
                  
                  <div className="flex gap-4">
                     {JOURNEY_STEPS.map((_, idx) => (
                       <div key={idx} className={cn(
                         "w-1 h-12 transition-all duration-700",
                         idx === activeStep ? "bg-emerald-400 scale-y-125 shadow-[0_0_20px_rgba(52,211,153,0.8)]" : "bg-white/10"
                       )} />
                     ))}
                  </div>
               </div>

               <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl bg-black/40 backdrop-blur-3xl p-12 lg:p-16 rounded-[4rem] border border-white/5 pointer-events-auto"
                  >
                    <h2 className="text-5xl md:text-7xl font-serif font-light mb-8 leading-none">
                      {t(`journey.scenes.${JOURNEY_STEPS[activeStep].id}`)}
                    </h2>
                    <p className="text-white/50 text-xl leading-relaxed font-light mb-12 italic border-l-2 border-emerald-400 pl-8">
                      {t(`journey.descriptions.${JOURNEY_STEPS[activeStep].id}`)}
                    </p>
                    
                    <button 
                      onClick={() => setShowInsight(true)}
                      className="group flex items-center gap-6 px-10 py-5 bg-white text-black rounded-full hover:bg-emerald-400 transition-all font-serif text-lg"
                    >
                      <Sun className="w-6 h-6 animate-spin-slow" />
                      <span>{t('journey.questions.' + JOURNEY_STEPS[activeStep].id)}</span>
                    </button>
                  </motion.div>

                  <div className="flex gap-6 pointer-events-auto">
                    <button 
                      onClick={prevStep}
                      disabled={activeStep === 0}
                      className="p-10 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all disabled:opacity-5 group"
                    >
                      <ChevronLeft className="w-8 h-8 group-hover:-translate-x-2 transition-transform" />
                    </button>
                    <button 
                      onClick={nextStep}
                      disabled={activeStep === JOURNEY_STEPS.length - 1}
                      className="p-10 rounded-full bg-emerald-400 text-emerald-950 hover:bg-white transition-all disabled:opacity-5 group"
                    >
                      <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
               </div>
            </div>

            {/* Psychological Engine: The Insight Portal */}
            <AnimatePresence>
              {showInsight && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 bg-black/90 backdrop-blur-2xl">
                  <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    className="w-full max-w-6xl bg-zinc-900 rounded-[5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 flex flex-col md:flex-row h-full max-h-[85vh]"
                  >
                    {/* Visual Perspective Side */}
                    <div className="md:w-1/2 relative overflow-hidden hidden md:flex items-center justify-center p-20">
                       <img 
                        src={JOURNEY_STEPS[activeStep].img} 
                        className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-zinc-900" />
                       <div className="relative z-10 space-y-8">
                          <Wind className="w-16 h-16 text-emerald-400 opacity-50" />
                          <h3 className="text-5xl font-serif text-white tracking-tight leading-tight italic">
                            Reflect on your existence.
                          </h3>
                       </div>
                    </div>
                    
                    {/* Content & Interaction Side */}
                    <div className="md:w-1/2 p-12 md:p-24 overflow-y-auto bg-zinc-900 flex flex-col justify-between border-l border-white/5">
                       <div className="space-y-12">
                          <div className="space-y-4">
                            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-400 font-bold">Deep Inquiry</span>
                            <h4 className="text-3xl font-serif text-white leading-snug">
                                {t('journey.questions.' + JOURNEY_STEPS[activeStep].id)}
                            </h4>
                          </div>

                          <div className="prose prose-invert prose-emerald max-w-none">
                             <p className="text-xl text-zinc-400 leading-relaxed font-light first-letter:text-5xl first-letter:font-serif first-letter:text-emerald-400 first-letter:mr-3 first-letter:float-left">
                               {activeStep === 0 && "The Jahiliyyah was not just a historical period; it is the state of any heart that lives without a moral compass. By looking at the chaos of the past, we realize that human 'laws' are brittle. True justice requires an unshakeable Anchor."}
                               {activeStep === 1 && "The character of Prophet Muhammad (pbuh) was so profound that even his enemies couldn't call him a liar. They called him a magician instead—because his words had an 'unnatural' power to unify hearts. This beauty is the greatest proof of his truth."}
                               {activeStep === 2 && "Revelation (Wahi) is the bridge between the Finite and the Infinite. In that cave, the burden of the entire world's suffering was met with a single, liberating command: Read in the name of your Lord."}
                               {activeStep === 3 && "True liberation is the transition from 'Slavery to Creation' to 'Slavery to the Creator'. When you serve the One, you become truly independent of everything else. This is the radical equality of Islam."}
                               {activeStep === 4 && "Submission (Islam) is the final port of home. It is not about rules; it is about the resonance of your heart with the rhythm of the universe."}
                             </p>
                          </div>

                          <div className="space-y-4">
                             <p className="text-xs uppercase tracking-widest text-white/30 truncate">Share your reflection with Nur</p>
                             <textarea 
                                value={reflectionAnswer}
                                onChange={(e) => setReflectionAnswer(e.target.value)}
                                placeholder="What stirs in your heart?"
                                className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-white focus:outline-none focus:border-emerald-500 transition-all resize-none h-32"
                             />
                          </div>
                       </div>
                       
                       <div className="flex gap-4 mt-12">
                          <button 
                            onClick={() => setShowInsight(false)}
                            className="flex-grow py-6 px-12 bg-white text-black rounded-full font-serif text-xl hover:bg-emerald-400 transition-all"
                          >
                            Proceed with Insight
                          </button>
                          <button 
                            onClick={() => setShowInsight(false)}
                            className="p-6 rounded-full border border-white/20 text-white"
                          >
                            <X className="w-6 h-6" />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AIGuide isDiscoveryMode={isJourneyStarted} />

      <footer className="fixed bottom-12 left-12 z-50 text-[10px] font-bold text-white/10 uppercase tracking-[1em] vertical-text">
        Truth • Liberation • Peace
      </footer>
    </div>
  );
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}


