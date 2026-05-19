import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, X, Loader2, Bird, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AIGuide({ isDiscoveryMode }: { isDiscoveryMode?: boolean }) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          language: i18n.language,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'bot', content: data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', content: 'I am taking a moment to reflect. Please try again soon.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className={`fixed ${isDiscoveryMode ? 'bottom-24 right-8' : 'bottom-8 right-8'} z-[60] bg-emerald-950 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-3 group`}
          >
            <Bird className="w-6 h-6 group-hover:animate-pulse" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-sm font-medium whitespace-nowrap px-0 group-hover:px-2">
              Ask Nur
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className={`fixed ${isDiscoveryMode ? 'bottom-32 right-12 w-80 lg:w-96' : 'bottom-28 right-12 w-96'} z-[100] bg-zinc-900 border border-white/5 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden backdrop-blur-3xl`}
          >
            <div className="p-8 pb-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-400/10 flex items-center justify-center border border-emerald-400/20">
                   <Sun className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg leading-none">Nur</h3>
                  <p className="text-[10px] uppercase tracking-widest text-emerald-400 opacity-60">The Whispering Light</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-3 hover:bg-white/5 rounded-2xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-6 max-h-[400px] custom-scrollbar">
              {messages.length === 0 && (
                <div className="py-8 text-center space-y-4">
                  <Bird className="w-12 h-12 text-white/5 mx-auto" />
                  <p className="text-zinc-500 text-sm italic font-serif max-w-[200px] mx-auto">
                    "I am Nur. Your questions are the sparks that light the path. Speak your heart."
                  </p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-6 rounded-3xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-400 text-emerald-950 rounded-tr-none font-medium'
                      : 'bg-white/5 border border-white/5 text-zinc-300 rounded-tl-none italic font-serif'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/60 font-bold">Reflecting...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-zinc-950/50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask the light..."
                  className="w-full pl-6 pr-16 py-5 bg-white/5 border border-white/5 rounded-2xl focus:border-emerald-400/30 outline-none text-white text-sm transition-all placeholder:text-zinc-600"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-3 top-3 w-10 h-10 bg-emerald-400 text-emerald-950 rounded-xl flex items-center justify-center hover:scale-105 disabled:opacity-20 transition-all shadow-lg shadow-emerald-400/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
