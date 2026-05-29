'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User as UserIcon,
  Trash2
} from 'lucide-react';
import { mockColleges } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import { useStore } from '@/store/useStore';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export function ChatbotWidget() {
  const isAuroraMode = useStore((state) => state.isAuroraMode);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      sender: 'bot',
      text: 'Hello! I am **UniBot**, your UniScope admissions assistant. Ask me anything about Indian colleges, courses, placements, or fee structures!',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const responseText = generateBotResponse(textToSend);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'init-msg',
        sender: 'bot',
        text: 'Hello! I am **UniBot**, your UniScope admissions assistant. Ask me anything about Indian colleges, courses, placements, or fee structures!',
        timestamp: new Date(),
      }
    ]);
  };

  const generateBotResponse = (query: string): string => {
    const cleanQuery = query.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");

    // 1. Identify matched college
    const matchedCollege = mockColleges.find((col) => {
      const nameLower = col.name.toLowerCase();
      const slugLower = col.slug.toLowerCase();
      
      const slugParts = col.slug.split('-');
      const acronym = slugParts.map(w => w[0]).join('').toLowerCase(); 
      const nameAcronym = col.name.split(' ').map(w => w[0]).join('').toLowerCase();
      const shortName = slugParts.slice(1).join(' ').toLowerCase();

      return (
        cleanQuery.includes(nameLower) ||
        cleanQuery.includes(slugLower) ||
        (shortName.length > 3 && cleanQuery.includes(shortName)) ||
        (acronym.length > 2 && cleanQuery.includes(acronym)) ||
        (nameAcronym.length > 2 && cleanQuery.includes(nameAcronym)) ||
        (col.name.includes("BITS") && cleanQuery.includes("bits")) ||
        (col.name.includes("IIM") && cleanQuery.includes("iim")) ||
        (col.name.includes("NLSIU") && cleanQuery.includes("nlsiu")) ||
        (col.name.includes("PGIMER") && cleanQuery.includes("pgimer"))
      );
    });

    // 2. Identify topics inside cleanQuery
    const hasPlacement = cleanQuery.includes("placement") || cleanQuery.includes("package") || cleanQuery.includes("salary") || cleanQuery.includes("recruit") || cleanQuery.includes("lpa") || cleanQuery.includes("job") || cleanQuery.includes("highest") || cleanQuery.includes("average");
    const hasFees = cleanQuery.includes("fee") || cleanQuery.includes("cost") || cleanQuery.includes("price") || cleanQuery.includes("expensive") || cleanQuery.includes("cheap") || cleanQuery.includes("charge");
    const hasLocation = cleanQuery.includes("location") || cleanQuery.includes("where") || cleanQuery.includes("address") || cleanQuery.includes("city") || cleanQuery.includes("state") || cleanQuery.includes("situated");
    const hasRank = cleanQuery.includes("rank") || cleanQuery.includes("nirf") || cleanQuery.includes("accreditation") || cleanQuery.includes("grade") || cleanQuery.includes("naac");
    const hasCourses = cleanQuery.includes("course") || cleanQuery.includes("degree") || cleanQuery.includes("branch") || cleanQuery.includes("offered") || cleanQuery.includes("study");
    const hasEligibility = cleanQuery.includes("eligibility") || cleanQuery.includes("criteria") || cleanQuery.includes("admission") || cleanQuery.includes("apply") || cleanQuery.includes("marks") || cleanQuery.includes("cutoff");
    const hasReviews = cleanQuery.includes("review") || cleanQuery.includes("pros") || cleanQuery.includes("cons") || cleanQuery.includes("student opinion") || cleanQuery.includes("comment");

    if (matchedCollege) {
      if (hasPlacement) {
        return `**${matchedCollege.name}** has excellent placement stats:
- **Average Package:** ${matchedCollege.placementStats.averagePackage.toFixed(1)} LPA
- **Highest Package:** ${(matchedCollege.placementStats.highestPackage || 0).toFixed(1)} LPA
- **Placement Rate:** ${matchedCollege.placementStats.placementPercentage}%
- **Top Recruiters:** ${matchedCollege.placementStats.recruiters.slice(0, 5).join(', ')}

[View Details](/college/${matchedCollege.slug})`;
      }

      if (hasFees) {
        const topCourses = matchedCollege.courses?.slice(0, 2) || [];
        return `The average annual fees at **${matchedCollege.name}** is **${formatINR(matchedCollege.fees)}/year**.
Here is the structure for popular courses:
${topCourses.map(c => `- **${c.name}**: ${formatINR(c.fees)}/year`).join('\n')}

[View Details](/college/${matchedCollege.slug})`;
      }

      if (hasLocation) {
        return `**${matchedCollege.name}** is located in **${matchedCollege.location}**. It is a **${matchedCollege.ownershipType}** institution. [View Details](/college/${matchedCollege.slug})`;
      }

      if (hasRank) {
        return `**${matchedCollege.name}** holds the following credentials:
- **Rankings:** ${matchedCollege.ranking || 'Top Rated'}
- **Accreditation:** ${matchedCollege.accreditation || 'N/A'}
- **Overall Rating:** ${matchedCollege.rating.toFixed(1)} / 5.0★

[View Details](/college/${matchedCollege.slug})`;
      }

      if (hasCourses || hasEligibility) {
        const coursesList = matchedCollege.courses || [];
        return `Here are the popular courses and eligibility criteria at **${matchedCollege.name}**:
${coursesList.slice(0, 3).map(c => `- **${c.name}** (${c.duration}): ${c.eligibility} (Fees: ${formatINR(c.fees)}/yr)`).join('\n')}

[View Details](/college/${matchedCollege.slug})`;
      }

      if (hasReviews) {
        const reviews = matchedCollege.reviews || [];
        if (reviews.length > 0) {
          return `Here is what students say about **${matchedCollege.name}**:
${reviews.slice(0, 1).map(r => `* "${r.comment}" (Rated ${r.rating}★ by ${r.userName})
* *Pros:* ${r.pros || 'Excellent placements & infrastructure'}
* *Cons:* ${r.cons || 'Heavy academic curriculum'}`).join('\n')}

[View Details](/college/${matchedCollege.slug})`;
        }
      }

      // Default college info response
      return `**${matchedCollege.name}** is a premier **${matchedCollege.ownershipType}** university in **${matchedCollege.location}**:
- **NIRF Rank:** ${matchedCollege.ranking || 'Top Rated'}
- **Average Fees:** ${formatINR(matchedCollege.fees)}/year
- **Average Package:** ${matchedCollege.placementStats.averagePackage.toFixed(1)} LPA
- **Rating:** ${matchedCollege.rating.toFixed(1)} / 5.0★

Ask me specifically about its *placements*, *fees*, *courses*, *eligibility*, or *reviews*! [View Details](/college/${matchedCollege.slug})`;
    }

    // 3. Search queries when no specific college is mentioned
    // City search
    const cities = ["delhi", "mumbai", "bangalore", "chennai", "kolkata", "pune", "hyderabad", "kanpur", "kharagpur", "guwahati", "chandigarh", "vellore", "lucknow", "ahmedabad", "kozhikode", "jamshedpur", "pondicherry", "roorkee"];
    const matchedCity = cities.find(city => cleanQuery.includes(city));
    if (matchedCity) {
      const cityColleges = mockColleges.filter(col => col.location.toLowerCase().includes(matchedCity));
      if (cityColleges.length > 0) {
        return `I found these ${cityColleges.length} colleges in **${matchedCity.toUpperCase()}**:
${cityColleges.slice(0, 4).map(c => `- **${c.name}** (NIRF: ${c.ranking?.split(' ')[2] || 'Top'}, Fees: ${formatINR(c.fees)}/yr) [Details](/college/${c.slug})`).join('\n')}`;
      }
    }

    // Top Placement search
    if (hasPlacement) {
      const topPlacements = [...mockColleges]
        .sort((a, b) => b.placementStats.averagePackage - a.placementStats.averagePackage)
        .slice(0, 3);
      return `Here are the top 3 colleges in placements on UniScope:
1. **${topPlacements[0].name}**: Average **${topPlacements[0].placementStats.averagePackage.toFixed(1)} LPA** (Highest: ${topPlacements[0].placementStats.highestPackage.toFixed(1)} LPA) [Details](/college/${topPlacements[0].slug})
2. **${topPlacements[1].name}**: Average **${topPlacements[1].placementStats.averagePackage.toFixed(1)} LPA** [Details](/college/${topPlacements[1].slug})
3. **${topPlacements[2].name}**: Average **${topPlacements[2].placementStats.averagePackage.toFixed(1)} LPA** [Details](/college/${topPlacements[2].slug})`;
    }

    // Cheap fees search
    if (hasFees) {
      const lowestFees = [...mockColleges]
        .sort((a, b) => a.fees - b.fees)
        .slice(0, 3);
      return `Here are the 3 lowest-fee colleges registered on UniScope:
1. **${lowestFees[0].name}**: **${formatINR(lowestFees[0].fees)}/year** [Details](/college/${lowestFees[0].slug})
2. **${lowestFees[1].name}**: **${formatINR(lowestFees[1].fees)}/year** [Details](/college/${lowestFees[1].slug})
3. **${lowestFees[2].name}**: **${formatINR(lowestFees[2].fees)}/year** [Details](/college/${lowestFees[2].slug})`;
    }

    // Greetings
    if (cleanQuery.includes("hi") || cleanQuery.includes("hello") || cleanQuery.includes("hey") || cleanQuery.includes("greetings") || cleanQuery.includes("unibot")) {
      return `Hello! I'm **UniBot**, your UniScope assistant. 🎓
I can help you search and compare Indian colleges! Try asking:
- *"What is the placement package at IIT Madras?"*
- *"Show me colleges in Delhi"*
- *"List the courses at IIM Ahmedabad"*
- *"Which college has the lowest fees?"*`;
    }

    if (cleanQuery.includes("help")) {
      return `I can answer queries about any college listed on UniScope!
**Common topics you can ask:**
- **Placements:** *"average package at IIT Bombay"* or *"highest placement"*
- **Fees:** *"fees for IIM Bangalore"* or *"cheap management colleges"*
- **Location:** *"which colleges are in Chennai?"*
- **Rankings:** *"NIRF ranks for engineering"* or *"ranking of VIT"*
- **Courses:** *"B.Tech courses at BITS"* or *"eligibility for PGIMER"*`;
    }

    return `I couldn't find a specific answer for your query. 
Try typing a question containing a college name (e.g. **IIT Delhi**, **BITS Pilani**, **AIIMS**, **IIM Calcutta**) along with terms like *placements*, *fees*, *courses*, or *reviews*.
You can also type **"help"** for examples!`;
  };

  const formatMessage = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      let cleanLine = line;
      if (isBullet) {
        cleanLine = line.trim().substring(2);
      }

      // 1. Match bold **text**
      const parts = cleanLine.split(/\*\*([^*]+)\*\*/g);
      const content = parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="font-extrabold text-foreground">{part}</strong>;
        }

        // 2. Match links [text](url)
        const linkParts = part.split(/\[([^\]]+)\]\(([^)]+)\)/g);
        if (linkParts.length > 1) {
          return linkParts.map((lPart, lIndex) => {
            if (lIndex % 3 === 1) {
              const url = linkParts[lIndex + 1];
              return (
                <Link key={lIndex} href={url} onClick={() => setIsOpen(false)} className="text-primary hover:underline font-bold inline-flex items-center gap-[3px]">
                  {lPart}
                </Link>
              );
            }
            if (lIndex % 3 === 2) return null;
            return lPart;
          });
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={idx} className="ml-[20px] sm:ml-[24px] list-disc pl-[4px] text-[14px] sm:text-[16px] leading-[1.5] mb-[4px] sm:mb-[6px]">
            {content}
          </li>
        );
      }

      return (
        <p key={idx} className="text-[14px] sm:text-[16px] leading-[1.5] mb-[8px] sm:mb-[10px] min-h-[14px]">
          {content}
        </p>
      );
    });
  };

  const suggestions = [
    "Highest package at IIT Bombay?",
    "Show cheap colleges",
    "Placements at BITS Pilani?",
    "Colleges in Delhi",
    "Help me"
  ];

  return (
    <div className="fixed bottom-[24px] right-[24px] z-[50] flex flex-col items-end">
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-[60px] w-[60px] sm:h-[68px] sm:w-[68px] rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer border border-white/10"
        aria-label="Toggle chat widget"
      >
        {isOpen ? <X className="h-[26px] w-[26px] sm:h-[30px] sm:w-[30px]" /> : <MessageSquare className="h-[26px] w-[26px] sm:h-[30px] sm:w-[30px]" />}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute bottom-[76px] sm:bottom-[84px] right-0 w-[calc(100vw-48px)] sm:w-[460px] h-[580px] sm:h-[660px] max-h-[80vh] flex flex-col rounded-[24px] sm:rounded-[28px] border shadow-2xl overflow-hidden ${
              isAuroraMode 
                ? 'bg-slate-950/85 border-white/10 text-white backdrop-blur-xl shadow-black/60' 
                : 'bg-card border-border/80 text-foreground shadow-black/15'
            }`}
          >
            {/* Header */}
            <div className={`p-[18px] sm:p-[22px] flex items-center justify-between border-b shrink-0 ${
              isAuroraMode ? 'border-white/5 bg-white/5' : 'border-border/60 bg-muted/30'
            }`}>
              <div className="flex items-center gap-[12px] sm:gap-[16px]">
                <div className="h-[44px] w-[44px] sm:h-[50px] sm:w-[50px] rounded-[10px] sm:rounded-[12px] bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
                  <Bot className="h-[26px] w-[26px] sm:h-[30px] sm:w-[30px]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[16px] sm:text-[18px] flex items-center gap-[6px] sm:gap-[8px] leading-none text-foreground">
                    <span>UniBot Assistant</span>
                    <span className="flex h-[8px] w-[8px] sm:h-[10px] sm:w-[10px] rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <span className="text-[12px] sm:text-[13px] text-muted-foreground font-semibold">Admissions & Campus Queries</span>
                </div>
              </div>
              <div className="flex items-center gap-[8px] sm:gap-[10px]">
                <button
                  onClick={handleClearChat}
                  title="Clear chat history"
                  className="flex items-center gap-[4px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-[10px] py-[6px] rounded-[10px] border border-border/60 hover:border-destructive/20 cursor-pointer shrink-0 transition-all text-[12px] sm:text-[13px] font-extrabold"
                >
                  <Trash2 className="h-[15px] w-[15px] sm:h-[16px] sm:w-[16px]" />
                  <span>Delete Chats</span>
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-[6px] sm:p-[8px] rounded-[10px] border border-transparent hover:bg-muted cursor-pointer shrink-0"
                >
                  <X className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-grow overflow-y-auto p-[18px] sm:p-[22px] flex flex-col gap-[18px] sm:gap-[22px]">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-[85%] gap-[12px] sm:gap-[16px] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar Icon */}
                    <div className={`h-[36px] w-[36px] sm:h-[40px] sm:w-[40px] rounded-[10px] sm:rounded-[12px] shrink-0 flex items-center justify-center border ${
                      msg.sender === 'bot'
                        ? isAuroraMode 
                          ? 'bg-white/5 border-white/5 text-indigo-300' 
                          : 'bg-primary/10 border-primary/10 text-primary'
                        : isAuroraMode 
                          ? 'bg-primary/20 border-white/5 text-white' 
                          : 'bg-primary border-primary text-white'
                    }`}>
                      {msg.sender === 'bot' ? <Bot className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]" /> : <UserIcon className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]" />}
                    </div>

                    {/* Bubble Content */}
                    <div className={`rounded-[18px] px-[14px] py-[10px] sm:px-[18px] sm:py-[12px] text-[14px] sm:text-[16px] ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground font-semibold rounded-tr-none'
                        : isAuroraMode
                          ? 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
                          : 'bg-muted text-foreground border border-border/40 rounded-tl-none'
                    }`}>
                      {formatMessage(msg.text)}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-[12px] sm:gap-[16px]">
                    <div className={`h-[36px] w-[36px] sm:h-[40px] sm:w-[40px] rounded-[10px] sm:rounded-[12px] shrink-0 flex items-center justify-center border ${
                      isAuroraMode ? 'bg-white/5 border-white/5 text-indigo-300' : 'bg-primary/10 border-primary/10 text-primary'
                    }`}>
                      <Bot className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]" />
                    </div>
                    <div className={`rounded-[18px] px-[18px] py-[12px] bg-muted border border-border/40 rounded-tl-none flex gap-[6px] items-center`}>
                      <span className="h-[8px] w-[8px] rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-[8px] w-[8px] rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-[8px] w-[8px] rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <div className={`p-[14px] sm:p-[18px] shrink-0 flex flex-wrap gap-[8px] sm:gap-[10px] border-t ${isAuroraMode ? 'border-white/5 bg-slate-950/20' : 'border-border/40 bg-muted/10'}`}>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className={`text-[12px] sm:text-[13px] font-bold px-[12px] py-[8px] rounded-[10px] border transition-all cursor-pointer flex items-center gap-[4px] ${
                    isAuroraMode
                      ? 'border-white/5 hover:border-primary/50 bg-white/5 text-slate-300 hover:text-white'
                      : 'border-border/60 hover:border-primary/60 bg-card hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Sparkles className="h-[14px] w-[14px] sm:h-[16px] sm:w-[16px] text-primary shrink-0 animate-pulse" />
                  <span>{s}</span>
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className={`p-[14px] sm:p-[18px] border-t shrink-0 flex gap-[10px] items-center ${
                isAuroraMode ? 'border-white/5 bg-white/5' : 'border-border/60 bg-card'
              }`}
            >
              <input
                type="text"
                placeholder="Ask about placements, fees, courses..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`flex-grow px-[16px] py-[10px] sm:px-[18px] sm:py-[12px] border rounded-[18px] text-[14px] sm:text-[15px] focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                  isAuroraMode 
                    ? 'border-white/10 bg-slate-950/40 text-white focus:border-primary/50' 
                    : 'border-border bg-background focus:border-primary/50'
                }`}
              />
              <button 
                type="submit"
                className="h-[42px] w-[42px] sm:h-[48px] sm:w-[48px] bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center rounded-[12px] transition-all cursor-pointer border border-white/10 shrink-0"
              >
                <Send className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
