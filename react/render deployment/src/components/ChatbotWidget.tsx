import React, { useState, useEffect, useRef } from 'react';
import { useCursor } from '../context/CursorContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isStreaming?: boolean;
}

const BOT_FAQ_ANSWERS: Record<string, string> = {
  'hours': 'RenderSkin Clinic is open Monday to Friday from 08:00 AM to 06:00 PM, and Saturdays from 09:00 AM to 02:00 PM. We are closed on Sundays.',
  'acne': 'Acne fluctuates based on skin hydration, diet, and hormones. We offer personalized salicylic acid peels and prescription tretinoin formulas. I recommend booking Dr. Sarah Jenkins for a skin diagnosis.',
  'book': 'To book an appointment, navigate to the "Booking" page in the navigation bar, choose your preferred doctor, and pick an available time slot!',
  'treatments': 'We specialize in Laser Skin Resurfacing, Acne Clarifying Peels, Hyperpigmentation correction, and Botox/Microneedling therapies. You can see our pricing catalog under Overview.',
};

export const ChatbotWidget: React.FC = () => {
  const { setCursorType, setCursorLabel } = useCursor();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your RenderSkin AI advisor. Ask me about skin treatments, opening hours, or booking details.' },
  ]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chats
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Analyze text and match answer
    const query = textToSend.toLowerCase();
    let reply = "I'm sorry, I'm still learning about specific clinical diagnoses. For immediate support, please try selecting 'What treatments do you offer?' or call our desk directly.";
    
    if (query.includes('hour') || query.includes('open') || query.includes('time')) {
      reply = BOT_FAQ_ANSWERS.hours;
    } else if (query.includes('acne') || query.includes('pimple') || query.includes('skin')) {
      reply = BOT_FAQ_ANSWERS.acne;
    } else if (query.includes('book') || query.includes('appointment') || query.includes('schedule')) {
      reply = BOT_FAQ_ANSWERS.book;
    } else if (query.includes('treatment') || query.includes('peel') || query.includes('laser')) {
      reply = BOT_FAQ_ANSWERS.treatments;
    }

    // Simulate streaming typewriter response
    setTimeout(() => {
      setTyping(false);
      
      const aiMsgId = Math.random().toString();
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: '',
        isStreaming: true,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Stream character by character
      let index = 0;
      const chars = reply.split('');
      let currentText = '';

      const timer = setInterval(() => {
        if (index < chars.length) {
          currentText += chars[index];
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, text: currentText } : msg
            )
          );
          index++;
        } else {
          clearInterval(timer);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg
            )
          );
        }
      }, 15);
    }, 1200);
  };

  const handleMouseEnter = (label: string) => {
    setCursorType('hover');
    setCursorLabel(label);
  };

  const handleMouseLeave = () => {
    setCursorType('default');
    setCursorLabel(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen ? (
          /* Floating Bubble Button */
          <motion.button
            key="bubble"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => handleMouseEnter('Ask AI')}
            onMouseLeave={handleMouseLeave}
            className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-xl border border-emerald-500/20 transition-all cursor-none"
          >
            <MessageSquare size={24} />
          </motion.button>
        ) : (
          /* Glassmorphic Chat Panel */
          <motion.div
            key="chat"
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-80 sm:w-96 h-[460px] glass-panel rounded-3xl shadow-2xl border border-white/30 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <div>
                  <h4 className="text-xs font-bold">Skin AI Specialist</h4>
                  <span className="text-[9px] text-emerald-100 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                onMouseEnter={() => handleMouseEnter('Close Chat')}
                onMouseLeave={handleMouseLeave}
                className="p-1 hover:bg-emerald-700 rounded-lg transition-colors cursor-none"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chats Container */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-200"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                      msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-50 border border-emerald-100 text-emerald-600'
                    }`}
                  >
                    {msg.sender === 'user' ? <User size={10} /> : <Bot size={10} />}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white/70 border border-slate-100 text-slate-700 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">
                    <Bot size={10} />
                  </div>
                  <div className="bg-white/70 border border-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1 h-8">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            {messages.length === 1 && !typing && (
              <div className="px-4 py-2 border-t border-slate-100/60 bg-slate-50/30 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Suggested Queries</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <button
                    onClick={() => handleSendMessage('What are your opening hours?')}
                    onMouseEnter={() => handleMouseEnter('Select Suggestion')}
                    onMouseLeave={handleMouseLeave}
                    className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-all cursor-none"
                  >
                    Clinic Hours
                  </button>
                  <button
                    onClick={() => handleSendMessage('How does acne clear up?')}
                    onMouseEnter={() => handleMouseEnter('Select Suggestion')}
                    onMouseLeave={handleMouseLeave}
                    className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-all cursor-none"
                  >
                    Acne Treatments
                  </button>
                  <button
                    onClick={() => handleSendMessage('How do I schedule an appointment?')}
                    onMouseEnter={() => handleMouseEnter('Select Suggestion')}
                    onMouseLeave={handleMouseLeave}
                    className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-all cursor-none"
                  >
                    Appointment Info
                  </button>
                </div>
              </div>
            )}

            {/* Input Footer */}
            <div className="p-3 border-t border-slate-100/80 bg-white/40 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
                onFocus={() => handleMouseEnter('Type skin concern')}
                onBlur={handleMouseLeave}
                placeholder="Ask skin advisor..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-150 bg-white/50 text-xs focus:outline-none focus:border-emerald-500 transition-colors cursor-none"
              />
              <button
                onClick={() => handleSendMessage(input)}
                onMouseEnter={() => handleMouseEnter('Send Query')}
                onMouseLeave={handleMouseLeave}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all cursor-none"
              >
                <Send size={13} />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
