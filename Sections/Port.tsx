import React from 'react';
import Reels from './Reels';

interface PortProps {
  isDarkMode: boolean;
}

const Port: React.FC<PortProps> = ({ isDarkMode }) => {
  return (
    <section className="pt-32 md:pt-40 pb-24 max-w-full overflow-hidden relative bg-zinc-950">
      <div className="max-w-[1400px] mx-auto">
        <Reels isDarkMode={isDarkMode} />

        {/* Case Studies / Project Scope text block for AEO/GEO optimization */}
        <div className="mt-16 border-t border-white/5 pt-16 px-6 max-w-4xl mx-auto text-left">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sora">
              Project Case Studies
            </h2>
            <p className="text-xs font-light text-zinc-500 mt-2">
              Deep dive into the operational mechanics and technology behind our AI films and agent teams.
            </p>
          </div>

          <div className="space-y-12">
            <div className="p-6 md:p-8 bg-zinc-900/10 border border-white/5 rounded-3xl hover:border-blue-500/10 transition-all duration-300">
              <h3 className="text-lg font-bold text-white mb-2">1. AI Storytelling & Generative Film</h3>
              <p className="text-xs font-light text-zinc-400 leading-relaxed mb-4">
                We engineered custom text-to-video and image-to-video rendering pipelines using Midjourney and Runway Gen-3 to produce high-fidelity cinematic scenes. By integrating synthetic voice generation and neural soundtrack syncing, we reduced production overhead by 90% compared to traditional live-action shoots.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[10px] font-semibold bg-blue-600/10 text-blue-400 border border-blue-500/10 px-2.5 py-1 rounded-full">Generative AI Video</span>
                <span className="text-[10px] font-semibold bg-blue-600/10 text-blue-400 border border-blue-500/10 px-2.5 py-1 rounded-full">Runway Gen-3</span>
                <span className="text-[10px] font-semibold bg-blue-600/10 text-blue-400 border border-blue-500/10 px-2.5 py-1 rounded-full">Midjourney v6</span>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-zinc-900/10 border border-white/5 rounded-3xl hover:border-blue-500/10 transition-all duration-300">
              <h3 className="text-lg font-bold text-white mb-2">2. Autonomous WhatsApp Support Agents</h3>
              <p className="text-xs font-light text-zinc-400 leading-relaxed mb-4">
                Built an enterprise-grade multi-agent support team connected to the WhatsApp Business API. The system qualifies incoming leads, answers detailed service queries using semantic vector database search, and logs qualified contacts directly into HubSpot CRM without human touch.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[10px] font-semibold bg-emerald-600/10 text-emerald-400 border border-emerald-500/10 px-2.5 py-1 rounded-full">WhatsApp API</span>
                <span className="text-[10px] font-semibold bg-emerald-600/10 text-emerald-400 border border-emerald-500/10 px-2.5 py-1 rounded-full">Hubspot CRM</span>
                <span className="text-[10px] font-semibold bg-emerald-600/10 text-emerald-400 border border-emerald-500/10 px-2.5 py-1 rounded-full">Vector DB</span>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-zinc-900/10 border border-white/5 rounded-3xl hover:border-blue-500/10 transition-all duration-300">
              <h3 className="text-lg font-bold text-white mb-2">3. Outbound Voice Calling Automation</h3>
              <p className="text-xs font-light text-zinc-400 leading-relaxed mb-4">
                Designed a Retell AI and Twilio integrated system that automatically dials cold or warm leads. The AI engages in natural back-and-forth conversation, handles complex objections, sets up demo calls, and updates the database with call status, achieving a 3.5x boost in appointment setting.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[10px] font-semibold bg-purple-600/10 text-purple-400 border border-purple-500/10 px-2.5 py-1 rounded-full">Retell AI</span>
                <span className="text-[10px] font-semibold bg-purple-600/10 text-purple-400 border border-purple-500/10 px-2.5 py-1 rounded-full">Twilio Voice</span>
                <span className="text-[10px] font-semibold bg-purple-600/10 text-purple-400 border border-purple-500/10 px-2.5 py-1 rounded-full">Objection Handling</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
};

export default Port;

