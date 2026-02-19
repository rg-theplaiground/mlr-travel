
import * as React from 'react';
import { UserData, Match } from '@/types';
import { SearchCommand } from '@/components/SearchCommand';
import { ArrowRight, MapPin, ShieldCheck, Ticket, Check, Star, Globe2 } from 'lucide-react';

interface DashboardProps {
  userData: UserData;
  onNavigateToProfile: () => void;
  onNavigateToBooking: (initialData?: { destination: string; date?: Date }) => void;
  onMatchSelect?: (match: Match) => void;
}

const FEATURED_MATCHES: Match[] = [
  {
    id: 'm1',
    homeTeam: 'San Diego Legion',
    awayTeam: 'Utah Warriors',
    city: 'San Diego',
    date: 'May 04',
    venue: 'Snapdragon Stadium',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800',
    priceStart: 189
  },
  {
    id: 'm2',
    homeTeam: 'NE Free Jacks',
    awayTeam: 'NOLA Gold',
    city: 'Boston',
    date: 'May 11',
    venue: 'Veterans Memorial',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800',
    priceStart: 145
  },
  {
    id: 'm3',
    homeTeam: 'Seattle Seawolves',
    awayTeam: 'Houston Sabercats',
    city: 'Seattle',
    date: 'May 18',
    venue: 'Starfire Stadium',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=800',
    priceStart: 210
  },
  {
    id: 'm4',
    homeTeam: 'Chicago Hounds',
    awayTeam: 'Rugby ATL',
    city: 'Chicago',
    date: 'May 25',
    venue: 'SeatGeek Stadium',
    image: 'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=800',
    priceStart: 165
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ userData: _userData, onNavigateToProfile: _onNavigateToProfile, onNavigateToBooking, onMatchSelect }) => {
  const matchesRef = React.useRef<HTMLDivElement>(null);

  const handleSearch = (data: { destination: string; date?: Date; type: 'business' | 'personal' }) => {
    onNavigateToBooking(data);
  };

  const scrollToMatches = () => {
    matchesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-mlr-red/20 selection:text-mlr-red">

      <main>
        {/* Curved Hero Section (UNCHANGED) */}
        <section className="relative w-full h-[85vh] overflow-hidden rounded-b-[4rem] shadow-2xl bg-black">
          {/* High Quality Rugby Action Image - Faded */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2600&auto=format&fit=crop"
              alt="Rugby Match Action"
              className="w-full h-full object-cover opacity-60 grayscale"
            />
            {/* Heavy gradients to ensure the 'black but faded' look */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pb-24">

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 shadow-lg mb-8 animate-fade-in hover:bg-white/20 transition-colors cursor-default">
              <ShieldCheck size={14} className="text-white" />
              <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Official Hotel Partner</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8 animate-slide-up drop-shadow-xl">
              THE MATCH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">STARTS HERE</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Exclusive hotel rates for fans, teams, and staff.
              Experience the championship from the best locations.
            </p>
          </div>
        </section>

        {/* Floating Search Widget (UNCHANGED) */}
        <div className="relative z-20 -mt-24 max-w-5xl mx-auto px-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="shadow-float rounded-[2.5rem]">
            <SearchCommand onSearch={handleSearch} />
          </div>
        </div>

        {/* MAIN BODY CONTENT */}
        <div className="max-w-7xl mx-auto px-6 py-32 space-y-40">

          {/* SECTION 1: THE EXPERIENCE */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 text-mlr-red font-bold text-xs uppercase tracking-[0.2em] bg-red-50 px-3 py-1.5 rounded-full">
                <Star size={12} /> The Experience
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-stone-900 tracking-tighter leading-[1.1] uppercase">
                The MLR Match<br />Weekend <span className="text-stone-400">Experience</span>
              </h2>

              <div className="space-y-6 text-lg text-stone-600 leading-relaxed max-w-xl">
                <h3 className="text-2xl font-bold text-stone-900 italic">Follow your team. Be there when it matters.</h3>
                <p>
                  Major League Rugby away matches aren’t just games — they’re full weekends built around rivalries, road trips, and shared moments with other supporters.
                </p>
                <p>
                  The MLR Fan Travel Portal is your way in. We bring together hand-picked hotel options near the stadium and fan hubs, so you can plan your match weekend with confidence and focus on what you came for: the rugby, the atmosphere, and the experience of following your club on the road.
                </p>
                <p className="font-medium text-stone-900">
                  This is about more than a place to sleep. It’s about arriving together, staying close to the action, and knowing your weekend is set before kickoff.
                </p>
                <div className="bg-stone-100 p-4 rounded-xl border-l-4 border-mlr-red text-sm font-medium text-stone-700">
                  Availability is limited per match weekend. Book early to secure your spot.
                </div>
              </div>

              <button
                onClick={scrollToMatches}
                className="h-14 px-8 bg-stone-900 text-white font-bold uppercase tracking-widest rounded-full hover:bg-black transition-all hover:scale-105 shadow-xl flex items-center gap-3"
              >
                View Match Packages <ArrowRight size={18} />
              </button>
            </div>

            <div className="flex-1 w-full animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="https://724fta3143.ufs.sh/f/MTE58BV23upXMRwbdhV23upXPQTw9BVZzAbf0k7GtlU5Jvhj"
                  alt="Fan Atmosphere"
                  className="w-full h-full object-cover grayscale-[20%]"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 text-white">
                  <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-90">Match Day</div>
                  <div className="text-4xl font-black italic uppercase leading-none">Electric Atmosphere</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: FEATURED MATCHES (Travel Cards) */}
          <div ref={matchesRef} className="bg-stone-900 text-white rounded-[4rem] p-8 md:p-16 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-mlr-red rounded-full mix-blend-multiply filter blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <span className="text-mlr-red font-bold text-xs uppercase tracking-widest mb-3 block">2026 Season</span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">Championship<br />Series</h2>
                </div>
                <button
                  onClick={scrollToMatches}
                  className="bg-white text-stone-900 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full hover:bg-stone-200 transition-all flex items-center gap-2 group self-start md:self-auto"
                >
                  Full Schedule <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {FEATURED_MATCHES.map((match, index) => (
                  <div key={match.id} className="animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                    <MatchCard
                      match={match}
                      onBook={() => onMatchSelect?.(match)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: BUILT FOR FANS (Checklist Style) */}
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 w-full animate-slide-up">
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://724fta3143.ufs.sh/f/MTE58BV23upXVOR0SSwGTGkxQIv7Wqn5yiESPp4mMD2Z6ro1"
                  alt="Supporters"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-mlr-red" />
                    <span className="font-black text-stone-900 uppercase tracking-wide text-xs">Official Partner</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center gap-2 text-stone-500 font-bold text-xs uppercase tracking-[0.2em]">
                <Globe2 size={12} /> Logistics & Support
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter leading-[1.1] uppercase">
                Built for Fans<br />Traveling <span className="text-mlr-red">To The Game</span>
              </h2>

              <h3 className="text-xl font-bold text-stone-900 italic">
                One weekend. One destination. One place to book it all.
              </h3>

              <p className="text-lg text-stone-600 leading-relaxed">
                When your team hits the road, travel should be the easy part.
              </p>
              <p className="text-lg text-stone-600 leading-relaxed">
                Through the MLR Fan Travel Portal, supporters can book trusted hotel options selected specifically for match weekends — close to the stadium, easy to access, and designed to keep fans in the heart of the action.
              </p>

              {/* Features List - "On Location" Style */}
              <div className="space-y-4 pt-4 border-t border-stone-100 mt-4">
                {[
                  "Hand-picked hotels close to the stadium",
                  "Easy access to fan hubs & events",
                  "Dedicated concierge support powered by CTMS",
                  "Group booking options for supporter clubs",
                  "Peace of mind if plans change"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-stone-900 flex items-center justify-center text-white shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="font-medium text-stone-800">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <button
                  onClick={scrollToMatches}
                  className="h-14 px-8 border-2 border-stone-200 text-stone-900 font-bold uppercase tracking-widest rounded-full hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-all flex items-center gap-3"
                >
                  Explore Match Options <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 4: MORE THAN A GAME */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-10 animate-slide-up border-t border-stone-200 pt-24">
            <div className="w-20 h-20 rounded-3xl bg-white border border-stone-100 shadow-xl flex items-center justify-center rotate-3">
              <Ticket size={32} className="text-mlr-red" />
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-stone-900 tracking-tighter uppercase italic leading-none">
                More Than A Game<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-400 to-stone-200">It’s A Reason To Travel</span>
              </h2>

              <div className="max-w-2xl mx-auto space-y-6 text-lg text-stone-600 leading-relaxed">
                <p>
                  Some fixtures are circled on the calendar the moment the schedule drops.
                </p>
                <p>
                  This portal is the foundation for how Major League Rugby fans travel to those moments — from rivalry matches to must-win weekends. As the program evolves, this platform will support enhanced match-weekend experiences that bring fans closer to the game, the city, and each other.
                </p>
                <p className="font-medium text-stone-900">
                  This pilot is the first step in building a consistent, scalable fan travel experience across the league — one that makes it easier to follow your team wherever the season takes them.
                </p>
              </div>
            </div>

            <button
              onClick={scrollToMatches}
              className="h-16 px-10 bg-mlr-red text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 hover:scale-105 flex items-center gap-3"
            >
              Travel With Your Team <ArrowRight size={20} />
            </button>
          </div>

          {/* Footer */}
          <footer className="pt-20 pb-8 text-center border-t border-stone-200">
            <img
              src="https://724fta3143.ufs.sh/f/MTE58BV23upXgV6A1ejrws4cYgLUiunyW13XKFv5fNSPZlJD"
              alt="MLR"
              className="h-8 w-auto mx-auto mb-6 grayscale opacity-50 hover:opacity-100 transition-opacity"
            />
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
              Powered by CTMS Travel Group
            </p>
            <div className="flex justify-center gap-6 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              <a href="#" className="hover:text-stone-900">Privacy Policy</a>
              <a href="#" className="hover:text-stone-900">Terms of Service</a>
              <a href="#" className="hover:text-stone-900">Support</a>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
};

const MatchCard: React.FC<{ match: Match; onBook: () => void }> = ({ match, onBook }) => (
  <div
    onClick={onBook}
    className="group bg-stone-800 rounded-[2rem] p-3 border border-stone-700 shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(206,14,45,0.3)] hover:-translate-y-2 hover:bg-stone-750 transition-all duration-300 cursor-pointer h-full flex flex-col"
  >
    <div className="relative h-64 overflow-hidden rounded-[1.5rem] mb-4">
      <img src={match.image} alt={match.homeTeam} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 saturate-[0.8] group-hover:saturate-100" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black text-stone-900 uppercase tracking-wide shadow-sm group-hover:bg-white transition-colors">
        {match.date}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
      <div className="absolute bottom-6 left-6 text-white transform group-hover:translate-x-1 transition-transform duration-300">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-90">{match.city}</div>
        <h4 className="text-2xl font-black italic uppercase leading-none tracking-wide">{match.homeTeam}</h4>
      </div>
    </div>

    <div className="px-3 pb-3 flex-1 flex flex-col justify-between">
      <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wide mb-6 group-hover:text-stone-300 transition-colors">
        <MapPin size={14} className="text-mlr-red" />
        {match.venue}
      </div>
      <button className="w-full py-4 rounded-xl bg-stone-900 border border-stone-700 text-white font-bold text-xs uppercase tracking-widest group-hover:bg-mlr-red group-hover:border-mlr-red transition-all flex items-center justify-center gap-2">
        Book Stay
      </button>
    </div>
  </div>
);
