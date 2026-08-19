import { useState, useEffect } from "react";
import { Menu, X, Phone, MessageSquare, Calendar, ChevronDown, MapPin, Clock, Mail, Facebook, Twitter, Linkedin, Instagram, Star, CheckCircle2, Scale, Shield, Users, AlertCircle, TrendingUp, FileText, Award, Gavel } from "lucide-react";
import logoImg from "@/imports/Main_logo_transparent.png";
import headshot1 from "@/imports/headshot_1.jpeg";
import headshot2 from "@/imports/headshot_2.jpeg";

// Helper to determine route from pathname or hash for static hosting
const getInitialRoute = () => {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (hash === "about" || hash === "attorney") return "about";
  if (hash === "lemon-law" || hash === "practice-areas/lemon-law") return "lemon-law";
  if (hash === "personal-injury" || hash === "practice-areas/personal-injury") return "personal-injury";
  if (hash === "employment-law" || hash === "practice-areas/employment-law") return "employment-law";
  if (hash === "testimonials") return "testimonials";
  if (hash === "contact") return "contact";

  const path = window.location.pathname;
  if (path.endsWith("/about") || path.endsWith("/about/") || path.endsWith("/attorney")) return "about";
  if (path.includes("lemon-law")) return "lemon-law";
  if (path.includes("personal-injury")) return "personal-injury";
  if (path.includes("employment-law")) return "employment-law";
  if (path.endsWith("/testimonials") || path.endsWith("/testimonials/")) return "testimonials";
  if (path.endsWith("/contact") || path.endsWith("/contact/")) return "contact";
  return "home";
};

// Main App Component with Router
export default function App() {
  // Initialize state based on current URL path or hash
  const [currentPageState, setCurrentPageState] = useState(getInitialRoute);

  // Wrapper function to ensure scrolling to top on every navigation click
  const setCurrentPage = (page: string) => {
    setCurrentPageState(page);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // Handle browser back/forward buttons and hash navigation
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPageState(getInitialRoute());
    };
    
    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  // Sync state changes back to URL for a real multi-page feel
  useEffect(() => {
    let path = "./";
    if (currentPageState === "about") path = "attorney";
    if (currentPageState === "lemon-law") path = "practice-areas/lemon-law";
    if (currentPageState === "personal-injury") path = "practice-areas/personal-injury";
    if (currentPageState === "employment-law") path = "practice-areas/employment-law";
    if (currentPageState === "testimonials") path = "testimonials";
    if (currentPageState === "contact") path = "contact";
    
    if (currentPageState !== "home") {
      window.history.pushState(null, "", `#/${path}`);
    } else {
      window.history.pushState(null, "", window.location.pathname);
    }
  }, [currentPageState]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// Helper function to calculate SHA-256 hash of a string
async function sha256Hex(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("socal_auth_granted") === "true";
  });
  const [passcodeAttempt, setPasscodeAttempt] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Cryptographic SHA-256 Hash of the passcode (Original raw string is completely removed from source code)
  const EXPECTED_HASH = import.meta.env.VITE_SITE_PASSCODE_HASH || "67a8bb5cd1a9a8d9aa2a89405861733a577d30d5aac54c8068d4e3417279e84f";

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hash = await sha256Hex(passcodeAttempt.trim());
    if (hash === EXPECTED_HASH) {
      localStorage.setItem("socal_auth_granted", "true");
      setIsAuthenticated(true);
      setPasscodeError("");
    } else {
      setPasscodeError("Incorrect passcode. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 bg-pattern flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-white relative overflow-hidden">
          {/* Subtle Accent Light */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <img 
              src={logoImg} 
              alt="So Cal Legal Group, Inc." 
              className="h-20 w-auto object-contain mx-auto mb-6 brightness-0 invert" 
            />
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4 text-xs font-semibold text-amber-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Private Client Preview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
              So Cal Legal Group, Inc.
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto">
              Welcome to our website preview. Please enter your passcode below to unlock and explore the site.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handlePasscodeSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Enter Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter Passcode"
                  value={passcodeAttempt}
                  onChange={(e) => setPasscodeAttempt(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base"
                  autoFocus
                />
              </div>
              
              {passcodeError && (
                <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passcodeError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer text-base"
            >
              Access Website
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Arpi Sislyan, Esq. &bull; Partner</p>
            <p>Direct Phone: <a href="tel:8182322760" className="text-amber-400 hover:underline">(818) 232-2760</a></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern">
      <Header 
        currentPage={currentPageState} 
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      {currentPageState === "home" && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPageState === "about" && <AboutPage setCurrentPage={setCurrentPage} />}
      {currentPageState === "lemon-law" && <LemonLawPage setCurrentPage={setCurrentPage} />}
      {currentPageState === "personal-injury" && <PersonalInjuryPage setCurrentPage={setCurrentPage} />}
      {currentPageState === "employment-law" && <EmploymentLawPage setCurrentPage={setCurrentPage} />}
      {currentPageState === "testimonials" && <TestimonialsPage setCurrentPage={setCurrentPage} />}
      {currentPageState === "contact" && <ContactPage />}
      
      <Footer setCurrentPage={setCurrentPage} />
      <MobileBottomBar setCurrentPage={setCurrentPage} />
    </div>
  );
}

// Header Component
function Header({ currentPage, setCurrentPage, mobileMenuOpen, setMobileMenuOpen }: any) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "Attorney" },
    { 
      id: "practice-areas", 
      label: "Practice Areas",
      submenu: [
        { id: "employment-law", label: "Employment Law" },
        { id: "personal-injury", label: "Personal Injury" },
        { id: "lemon-law", label: "Lemon Law" }
      ]
    },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/98 backdrop-blur-md py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center min-h-[90px] sm:min-h-[110px] lg:min-h-[120px]">
            {/* Crisp High-Res Logo */}
            <button
              onClick={() => setCurrentPage("home")}
              className="flex items-center group cursor-pointer py-1"
            >
              <img
                src={logoImg}
                alt="So Cal Legal Group, Inc."
                className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto object-contain max-w-[260px] sm:max-w-[340px] md:max-w-[420px] transition-all duration-300"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                item.submenu ? (
                  <div key={item.id} className="relative group">
                    <button className="flex items-center space-x-1 py-2 text-foreground hover:text-primary font-semibold transition-colors cursor-pointer">
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    </button>
                    <div className="absolute top-full left-0 w-56 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                      {item.submenu.map((subitem) => (
                        <button
                          key={subitem.id}
                          onClick={() => setCurrentPage(subitem.id)}
                          className="block w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                        >
                          {subitem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`font-semibold transition-colors cursor-pointer ${currentPage === item.id ? 'text-primary' : 'text-foreground hover:text-primary'}`}
                  >
                    {item.label}
                  </button>
                )
              ))}
              
              <a
                href="tel:8182322760"
                className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <Phone className="w-4 h-4" />
                (818) 232-2760
              </a>

              <button 
                onClick={() => setCurrentPage("contact")}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer">
                Free Consultation
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden space-x-4">
              <a
                href="tel:8182322760"
                className="p-2 text-primary hover:bg-primary/10 rounded-full"
              >
                <Phone className="w-6 h-6" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-foreground hover:text-primary hover:bg-muted focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-white pt-28">
          <nav className="flex flex-col p-6 space-y-4">
            {navItems.map((item) => (
              item.submenu ? (
                <div key={item.id} className="space-y-2">
                  <div className="text-foreground font-semibold text-lg">{item.label}</div>
                  {item.submenu.map((subitem) => (
                    <button
                      key={subitem.id}
                      onClick={() => {
                        setCurrentPage(subitem.id);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left pl-4 py-2 text-foreground hover:text-primary transition-colors"
                    >
                      {subitem.label}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-lg font-semibold ${currentPage === item.id ? 'text-primary' : 'text-foreground'}`}
                >
                  {item.label}
                </button>
              )
            ))}
            <a
              href="tel:8182322760"
              className="flex items-center justify-center gap-2 bg-muted text-foreground py-3 rounded-md font-semibold text-lg border border-border"
            >
              <Phone className="w-5 h-5 text-primary" />
              (818) 232-2760
            </a>
            <button 
              onClick={() => {
                setCurrentPage("contact");
                setMobileMenuOpen(false);
              }}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold mt-2">
              Get a Free Consultation
            </button>
          </nav>
        </div>
      )}
    </>
  );
}

// Mobile Bottom Bar
function MobileBottomBar({ setCurrentPage }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground shadow-2xl lg:hidden z-40 border-t border-primary/20">
      <div className="grid grid-cols-3 divide-x divide-primary-foreground/20">
        <a 
          href="tel:8182322760"
          className="flex flex-col items-center justify-center py-3 hover:bg-primary/90 active:bg-primary/80 transition-colors"
        >
          <Phone className="w-5 h-5 mb-1" />
          <span className="text-xs font-semibold">CALL FIRM</span>
        </a>
        <button 
          onClick={() => setCurrentPage("contact")}
          className="flex flex-col items-center justify-center py-3 hover:bg-primary/90 active:bg-primary/80 transition-colors"
        >
          <MessageSquare className="w-5 h-5 mb-1" />
          <span className="text-xs font-semibold">MESSAGE US</span>
        </button>
        <button 
          onClick={() => setCurrentPage("contact")}
          className="flex flex-col items-center justify-center py-3 hover:bg-primary/90 active:bg-primary/80 transition-colors"
        >
          <Calendar className="w-5 h-5 mb-1" />
          <span className="text-xs font-semibold text-center">CONSULTATION</span>
        </button>
      </div>
    </div>
  );
}

// Home Page
function HomePage({ setCurrentPage }: any) {
  return (
    <main className="pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-0">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-pattern"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                Welcome to <br /><span className="text-gold-400">So Cal Legal Group</span>
              </h1>
              
              <p className="text-lg lg:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
                At So Cal Legal Group, we believe every client deserves honesty, respect, and unwavering advocacy. We built our firm on integrity, trust, and a commitment to standing up for individuals when they need it most. Whether you are facing workplace injustice, recovering from a serious injury, or dealing with a defective vehicle, our mission is simple: protect your rights, guide you through the legal process, and fight relentlessly for the outcome you deserve. At So Cal Legal Group, we take pride in providing personalized representation with the dedication, compassion, and results-driven approach every client deserves.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => setCurrentPage("contact")}
                  className="bg-gold-500 text-navy-950 px-8 py-4 rounded-md text-lg font-bold hover:bg-gold-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer">
                  Schedule Free Consultation
                </button>
                <a 
                  href="tel:8182322760"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-4 rounded-md text-lg font-semibold transition-all duration-200 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gold-400" />
                  (818) 232-2760
                </a>
              </div>
            </div>

            {/* Featured Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-2 bg-gold-500/30 rounded-2xl blur-lg"></div>
                <div className="relative bg-navy-900 border-2 border-gold-500/40 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={headshot2} 
                    alt="Arpi Sislyan, Esq. - Partner"
                    className="w-full h-auto object-cover" 
                  />
                  <div className="p-6 bg-navy-900 text-white border-t border-navy-800">
                    <h3 className="text-xl font-bold font-serif">Arpi Sislyan, Esq.</h3>
                    <p className="text-gold-400 text-sm font-semibold">Partner &bull; So Cal Legal Group, Inc.</p>
                    <p className="text-navy-300 text-xs mt-1 font-mono">Direct: (818) 232-2760 | arpi@sclglawyers.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Area Cards */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full mb-3">
              <span className="text-sm font-bold text-primary">PRACTICE AREAS</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
              Dedicated Legal Representation
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PracticeAreaCard
              icon={<Users className="w-10 h-10" />}
              title="Employment Law"
              description="Employees deserve to be treated fairly, lawfully, and with dignity. At So Cal Legal Group, we represent individuals facing wrongful termination, workplace harassment, discrimination, retaliation, wage and hour violations, and other employment disputes. We understand the emotional and financial toll these situations can create, and we are committed to protecting your rights while aggressively pursuing the justice and compensation you deserve."
              onClick={() => setCurrentPage("employment-law")}
            />
            <PracticeAreaCard
              icon={<Shield className="w-10 h-10" />}
              title="Personal Injury"
              description="A serious injury can disrupt every aspect of your life — physically, emotionally, and financially. Whether you were injured in a motor vehicle accident, slip and fall, or another act of negligence, So Cal Legal Group is prepared to fight for the maximum compensation available for your injuries, lost wages, pain and suffering, and future damages. Our goal is not only to help you recover financially, but to help you move forward with confidence."
              onClick={() => setCurrentPage("personal-injury")}
            />
            <PracticeAreaCard
              icon={<Scale className="w-10 h-10" />}
              title="Lemon Law"
              description="Purchasing or leasing a defective vehicle can be frustrating, stressful, and costly. California law protects consumers from being stuck with vehicles that repeatedly fail to meet quality and safety standards. At So Cal Legal Group, we help clients hold manufacturers accountable and pursue buybacks, replacements, and financial compensation under California Lemon Law."
              onClick={() => setCurrentPage("lemon-law")}
            />
          </div>
        </div>
      </section>

      {/* Main Page Sections Provided in Info Text */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Representation Built on Trust, Integrity & Results */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
                Representation Built on Trust, Integrity & Results
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                At So Cal Legal Group, we understand that hiring an attorney is a major decision. That is why we prioritize honesty, communication, and personalized attention from the very beginning. We believe every client deserves to feel informed, supported, and confident throughout the legal process. Our firm takes the time to understand your goals, answer your questions, and develop a strategy tailored to your specific situation.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                We are committed to building lasting relationships with our clients through transparency, accessibility, and relentless advocacy. When you work with So Cal Legal Group, you can trust that your case will receive the attention, preparation, and dedication it deserves.
              </p>
            </div>

            {/* Relentless Advocacy for Meaningful Results */}
            <div className="bg-background p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-2xl font-bold mb-4 font-serif text-foreground">
                Relentless Advocacy for Meaningful Results
              </h3>
              <p className="text-foreground/80 leading-relaxed mb-4">
                At So Cal Legal Group, we are committed to delivering results that make a real difference in our clients’ lives. We approach every case with strategic preparation, aggressive advocacy, and a willingness to take matters as far as necessary to protect our clients’ interests. Whether negotiating a favorable settlement or litigating in court, we fight tirelessly to maximize the compensation and outcome our clients deserve.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                We do not believe in quick resolutions that undervalue a client’s case. Our firm prepares every matter with diligence and determination because we understand what is at stake for the individuals and families we represent.
              </p>
            </div>
          </div>

          {/* No Recovery, No Fee */}
          <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20">
            <h3 className="text-2xl font-bold mb-4 font-serif text-primary">
              No Recovery, No Fee
            </h3>
            <p className="text-lg text-foreground/80 leading-relaxed">
              We believe quality legal representation should be accessible to those who need it most. That is why So Cal Legal Group handles cases on a contingency fee basis — meaning you pay nothing unless we successfully recover compensation on your behalf. We also offer free consultations so you can speak directly with an attorney, understand your rights, and explore your legal options without financial pressure or obligation.
            </p>
          </div>
        </div>
      </section>

      {/* Attorney Spotlight Component */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-border">
              <img 
                src={headshot1} 
                alt="Arpi Sislyan, Esq."
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
                <span className="text-sm font-bold text-primary">FOUNDING PARTNER</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
                Meet Arpi Sislyan
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                Arpi Sislyan is the Founding Partner of So Cal Legal Group and a results-driven attorney dedicated to helping clients navigate complex legal matters with strategy, precision, and purpose. With a thoughtful and comprehensive approach, Ms. Sislyan utilizes both pre-litigation and litigation strategies to pursue the most effective resolution possible.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed mb-8">
                Ms. Sislyan earned her Juris Doctor from the University of West Los Angeles, where she received the prestigious Witkin Award in Business Associations for academic excellence.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => setCurrentPage("about")}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  Attorney Page
                </button>
                <a 
                  href="tel:8182322760" 
                  className="text-primary font-bold hover:underline flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" /> (818) 232-2760
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
            Let So Cal Legal Group Stand Up For You
          </h2>
          <p className="text-xl mb-10 text-primary-foreground/90 leading-relaxed">
            If you have been wronged, injured, or taken advantage of, you do not have to face it alone. So Cal Legal Group is ready to protect your rights, guide you through the legal process, and fight for the justice and compensation you deserve. Contact us today to schedule your free consultation and learn how we can help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setCurrentPage("contact")}
              className="bg-gold-500 text-navy-950 px-8 py-4 rounded-md text-lg font-bold hover:bg-gold-400 transition-all cursor-pointer">
              Schedule Free Consultation Today
            </button>
            <a 
              href="tel:8182322760" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-md text-lg font-semibold flex items-center gap-2">
              <Phone className="w-5 h-5 text-gold-400" />
              Call (818) 232-2760
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

// Practice Area Card Component
function PracticeAreaCard({ icon, title, description, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="group bg-card border border-border rounded-xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-primary/30 hover:-translate-y-1"
    >
      <div className="text-primary mb-6 transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>
        {title}
      </h3>
      <p className="text-foreground/70 leading-relaxed mb-6 text-sm sm:text-base">
        {description}
      </p>
      <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
        <span>Learn More</span>
        <ChevronDown className="w-4 h-4 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

// About / Attorney Page
function AboutPage({ setCurrentPage }: any) {
  return (
    <main className="pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-0">
      {/* Hero Profile Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left: Portrait & Contact Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-card rounded-2xl overflow-hidden shadow-2xl border border-border">
                <img 
                  src={headshot2} 
                  alt="Arpi Sislyan, Esq." 
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Direct Attorney Contact Card */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-md">
                <h3 className="font-serif font-bold text-xl text-foreground mb-4">Contact Details</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-foreground/80">
                    <Users className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-bold block">Arpi Sislyan, Esq.</span>
                      <span className="text-muted-foreground text-xs">Partner &bull; So Cal Legal Group, Inc.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <span className="text-xs text-muted-foreground block">Phone:</span>
                      <a href="tel:8182322760" className="font-bold hover:text-primary transition-colors">(818) 232-2760</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <span className="text-xs text-muted-foreground block">Email:</span>
                      <a href="mailto:arpi@sclglawyers.com" className="font-bold hover:text-primary transition-colors">arpi@sclglawyers.com</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <span className="text-xs text-muted-foreground block">Office Address:</span>
                      <span className="font-mono text-xs text-muted-foreground">[empty]</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentPage("contact")}
                  className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  Schedule Consultation
                </button>
              </div>
            </div>

            {/* Right: Full Official Biography */}
            <div className="lg:col-span-7">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2 text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
                Meet Arpi Sislyan:
              </h1>
              <p className="text-lg text-primary font-semibold mb-8">Founding Partner &bull; So Cal Legal Group</p>

              <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
                <p>
                  Arpi Sislyan is the Founding Partner of So Cal Legal Group and a results-driven attorney dedicated to helping clients navigate complex legal matters with strategy, precision, and purpose. With a thoughtful and comprehensive approach, Ms. Sislyan utilizes both pre-litigation and litigation strategies to pursue the most effective resolution possible.
                </p>
                
                <p>
                  Whether negotiating favorable outcomes or advocating aggressively in court, Ms. Sislyan is committed to protecting her clients’ interests at every stage of the legal process. She is known for her meticulous attention to detail, hands-on representation, and unwavering commitment to client advocacy.
                </p>
                
                <p>
                  Clients value Ms. Sislyan not only for her legal skill and professionalism, but also for the transparency and support she provides throughout their cases. Her client-centered approach has consistently led to strong results and lasting relationships built on trust and communication.
                </p>
                
                <p>
                  Ms. Sislyan earned her Juris Doctor from the University of West Los Angeles, where she received the prestigious Witkin Award in Business Associations for academic excellence.
                </p>
                
                <p>
                  At So Cal Legal Group, Ms. Sislyan and her team are committed to delivering strategic legal solutions while ensuring every client receives the attention, respect, and personalized representation they deserve.
                </p>
              </div>

              {/* Academic Honors */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-2xl font-bold mb-6 text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
                  Education & Academic Recognition
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card p-6 rounded-xl border border-border">
                    <Award className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-bold text-foreground mb-1">University of West Los Angeles</h4>
                    <p className="text-sm font-semibold text-primary mb-2">Juris Doctor (J.D.)</p>
                    <p className="text-xs text-foreground/70">Received the prestigious Witkin Award in Business Associations for academic excellence.</p>
                  </div>
                  <div className="bg-card p-6 rounded-xl border border-border">
                    <Shield className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-bold text-foreground mb-1">Bar Admissions & Certifications</h4>
                    <p className="text-xs text-foreground/70 font-mono mt-2">[empty]</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Employment Law Page
function EmploymentLawPage({ setCurrentPage }: any) {
  return (
    <main className="pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-0">
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Employment Law
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm space-y-6">
            <p className="text-lg text-foreground/80 leading-relaxed">
              Employees deserve to be treated fairly, lawfully, and with dignity. At So Cal Legal Group, we represent individuals facing wrongful termination, workplace harassment, discrimination, retaliation, wage and hour violations, and other employment disputes. We understand the emotional and financial toll these situations can create, and we are committed to protecting your rights while aggressively pursuing the justice and compensation you deserve.
            </p>
          </div>

          <div className="text-center pt-8">
            <button 
              onClick={() => setCurrentPage("contact")}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-md text-lg font-bold hover:bg-primary/90 transition-colors"
            >
              Contact Us Today
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Personal Injury Page
function PersonalInjuryPage({ setCurrentPage }: any) {
  return (
    <main className="pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-0">
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Personal Injury
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm space-y-6">
            <p className="text-lg text-foreground/80 leading-relaxed">
              A serious injury can disrupt every aspect of your life — physically, emotionally, and financially. Whether you were injured in a motor vehicle accident, slip and fall, or another act of negligence, So Cal Legal Group is prepared to fight for the maximum compensation available for your injuries, lost wages, pain and suffering, and future damages. Our goal is not only to help you recover financially, but to help you move forward with confidence.
            </p>
          </div>

          <div className="text-center pt-8">
            <button 
              onClick={() => setCurrentPage("contact")}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-md text-lg font-bold hover:bg-primary/90 transition-colors"
            >
              Contact Us Today
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Lemon Law Page
function LemonLawPage({ setCurrentPage }: any) {
  return (
    <main className="pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-0">
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Lemon Law
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm space-y-6">
            <p className="text-lg text-foreground/80 leading-relaxed">
              Purchasing or leasing a defective vehicle can be frustrating, stressful, and costly. California law protects consumers from being stuck with vehicles that repeatedly fail to meet quality and safety standards. At So Cal Legal Group, we help clients hold manufacturers accountable and pursue buybacks, replacements, and financial compensation under California Lemon Law.
            </p>
          </div>

          <div className="text-center pt-8">
            <button 
              onClick={() => setCurrentPage("contact")}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-md text-lg font-bold hover:bg-primary/90 transition-colors"
            >
              Contact Us Today
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Testimonials Page
function TestimonialsPage({ setCurrentPage }: any) {
  return (
    <main className="pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-0">
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Testimonials
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="bg-card border border-border rounded-xl p-12 shadow-sm">
            <div className="text-muted-foreground font-mono text-lg">[empty]</div>
          </div>

          <div className="pt-8">
            <button 
              onClick={() => setCurrentPage("contact")}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-md text-lg font-bold hover:bg-primary/90 transition-colors"
            >
              Contact Us Today
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Contact Page
function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: (formData.get("firstName") as string) || "",
      lastName: (formData.get("lastName") as string) || "",
      phone: (formData.get("phone") as string) || "",
      email: (formData.get("email") as string) || "",
      practiceArea: (formData.get("practiceArea") as string) || "",
      message: (formData.get("message") as string) || ""
    };

    const googleSheetsUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL || "";

    try {
      if (googleSheetsUrl) {
        await fetch(googleSheetsUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(data)
        });
      } else {
        console.log("Contact form submission (local static mode):", data);
      }
      
      setSubmitMessage("Thank you! Your message has been received.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitMessage("Thank you! Your message has been received.");
      (e.target as HTMLFormElement).reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-0">
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Contact So Cal Legal Group
          </h1>
          <p className="text-xl text-primary-foreground/90">
            Schedule your free consultation today.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Contact Details */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
                Firm Contact Information
              </h2>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Attorney</h3>
                    <p className="text-foreground/80 font-semibold">Arpi Sislyan, Esq.</p>
                    <p className="text-xs text-muted-foreground">Partner &bull; So Cal Legal Group, Inc.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Telephone</h3>
                    <a href="tel:8182322760" className="text-lg font-bold text-primary hover:underline">
                      (818) 232-2760
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Email</h3>
                    <a href="mailto:arpi@sclglawyers.com" className="text-lg font-bold text-primary hover:underline">
                      arpi@sclglawyers.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Office Location</h3>
                    <p className="font-mono text-sm text-muted-foreground">[empty]</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Office Hours</h3>
                    <p className="font-mono text-sm text-muted-foreground">[empty]</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Intake Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
                Contact Us
              </h2>

              <form className="space-y-6" onSubmit={handleFormSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">First Name *</label>
                    <input 
                      type="text" 
                      name="firstName"
                      required
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Last Name *</label>
                    <input 
                      type="text" 
                      name="lastName"
                      required
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Phone *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Practice Area *</label>
                  <select name="practiceArea" className="w-full px-4 py-3 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Employment Law</option>
                    <option>Personal Injury</option>
                    <option>Lemon Law</option>
                    <option>Other Legal Matter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Message *</label>
                  <textarea 
                    rows={4}
                    name="message"
                    required
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-md text-lg font-bold hover:bg-primary/90 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 cursor-pointer">
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
                
                {submitMessage && (
                  <div className={`p-4 rounded-md text-center font-bold ${submitMessage.includes("error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Footer Component
function Footer({ setCurrentPage }: any) {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-primary-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Info */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <img
                src={logoImg}
                alt="So Cal Legal Group, Inc."
                className="h-20 w-auto object-contain brightness-0 invert"
              />
            </div>
            <div className="text-sm space-y-1 text-primary-foreground/90 font-medium">
              <p><span className="font-bold">Attorney:</span> Arpi Sislyan, Esq. (Partner)</p>
              <p><span className="font-bold">Phone:</span> (818) 232-2760</p>
              <p><span className="font-bold">Email:</span> arpi@sclglawyers.com</p>
              <p><span className="font-bold">Office Address:</span> <span className="font-mono text-xs opacity-70">[empty]</span></p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Navigation</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentPage("home")} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("about")} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">
                  Attorney
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("testimonials")} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">
                  Testimonials
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("contact")} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Practice Areas</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentPage("employment-law")} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">
                  Employment Law
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("personal-injury")} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">
                  Personal Injury
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("lemon-law")} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">
                  Lemon Law
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} So Cal Legal Group, Inc. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
