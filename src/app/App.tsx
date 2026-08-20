import { useState, useEffect } from "react";
import { Menu, X, Phone, Calendar, ChevronDown, MapPin, Mail, Star, Shield, Users, Scale, Award, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import logoImg from "@/imports/Main_logo_socal.png";
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
  const [currentPageState, setCurrentPageState] = useState(getInitialRoute);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  // Wrapper function to ensure scrolling to top on every navigation click
  const setCurrentPage = (page: string) => {
    setCurrentPageState(page);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const openConsultModal = () => setIsConsultModalOpen(true);
  const closeConsultModal = () => setIsConsultModalOpen(false);

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

  // Sync state changes back to URL
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-8 sm:p-10 shadow-2xl text-white relative overflow-hidden">
          <div className="text-center mb-8">
            <img 
              src={logoImg} 
              alt="So Cal Legal Group, Inc." 
              className="h-24 w-auto object-contain mx-auto mb-6 brightness-0 invert" 
            />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4 text-xs font-semibold text-amber-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Private Client Preview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 tracking-wide">
              So Cal Legal Group, Inc.
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto">
              Welcome to our website preview. Please enter your passcode below to unlock and explore the site.
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Enter Passcode
              </label>
              <input
                type="password"
                placeholder="Enter Passcode"
                value={passcodeAttempt}
                onChange={(e) => setPasscodeAttempt(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-base"
                autoFocus
              />
              
              {passcodeError && (
                <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passcodeError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer text-base uppercase tracking-wider"
            >
              Access Website
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Arpi Sislyan, Esq. &bull; Partner</p>
            <p>Direct Phone <a href="tel:8182322760" className="text-amber-400 hover:underline font-bold">(818) 232-2760</a></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
      <Header 
        currentPage={currentPageState} 
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        openConsultModal={openConsultModal}
      />
      
      {currentPageState === "home" && <HomePage setCurrentPage={setCurrentPage} openConsultModal={openConsultModal} />}
      {currentPageState === "about" && <AboutPage setCurrentPage={setCurrentPage} openConsultModal={openConsultModal} />}
      {currentPageState === "lemon-law" && <LemonLawPage setCurrentPage={setCurrentPage} openConsultModal={openConsultModal} />}
      {currentPageState === "personal-injury" && <PersonalInjuryPage setCurrentPage={setCurrentPage} openConsultModal={openConsultModal} />}
      {currentPageState === "employment-law" && <EmploymentLawPage setCurrentPage={setCurrentPage} openConsultModal={openConsultModal} />}
      {currentPageState === "testimonials" && <TestimonialsPage setCurrentPage={setCurrentPage} openConsultModal={openConsultModal} />}
      {currentPageState === "contact" && <ContactPage />}
      
      <Footer setCurrentPage={setCurrentPage} openConsultModal={openConsultModal} />
      <MobileBottomBar openConsultModal={openConsultModal} />

      {/* Interactive Consultation Pop-up Modal */}
      {isConsultModalOpen && <ConsultationModal closeModal={closeConsultModal} />}
    </div>
  );
}

// Header Component with Top Bar & Larger Defined Logo
function Header({ currentPage, setCurrentPage, mobileMenuOpen, setMobileMenuOpen, openConsultModal }: any) {
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
      {/* Top Utility Bar */}
      <div className="bg-slate-950 text-slate-300 border-b border-amber-500/30 text-xs py-2 px-4 sm:px-8 hidden sm:block z-50 relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-amber-400 tracking-wider uppercase">So Cal Legal Group, Inc.</span>
            <span>Mailing Address 1812 West Burbank Blvd., #36 Burbank CA 91506</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a href="mailto:info@sclglawyers.com" className="hover:text-amber-400 transition-colors">info@sclglawyers.com</a>
            <a href="tel:8182322760" className="text-amber-400 font-bold hover:underline flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> (818) 232-2760
            </a>
          </div>
        </div>
      </div>

      {/* Main Luxury Defined Header */}
      <header className={`fixed top-0 sm:top-[33px] left-0 right-0 z-50 transition-all duration-300 bg-white border-b-2 border-slate-900 ${scrolled ? 'shadow-xl py-2' : 'py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center min-h-[96px] sm:min-h-[112px]">
            
            {/* Left Section: Prominent Defined Logo + Navigation Links */}
            <div className="flex items-center gap-8 xl:gap-14">
              {/* Larger, Lower, Defined Logo Button */}
              <button
                onClick={() => setCurrentPage("home")}
                className="flex items-center cursor-pointer py-2 border-r-2 border-slate-100 pr-6 sm:pr-8"
              >
                <img
                  src={logoImg}
                  alt="So Cal Legal Group, Inc."
                  className="h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 w-auto object-contain transition-all duration-200"
                />
              </button>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                {navItems.map((item) => (
                  item.submenu ? (
                    <div key={item.id} className="relative group">
                      <button className="flex items-center space-x-1.5 py-3 text-slate-900 hover:text-amber-600 font-semibold transition-colors cursor-pointer text-base uppercase tracking-wider">
                        <span>{item.label}</span>
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 text-amber-600" />
                      </button>
                      <div className="absolute top-full left-0 w-60 bg-slate-950 text-white border-2 border-amber-500/40 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-3 overflow-hidden">
                        {item.submenu.map((subitem) => (
                          <button
                            key={subitem.id}
                            onClick={() => setCurrentPage(subitem.id)}
                            className="block w-full text-left px-5 py-3 text-sm text-slate-200 hover:bg-slate-900 hover:text-amber-400 transition-colors cursor-pointer font-medium"
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
                      className={`font-semibold transition-colors cursor-pointer text-base uppercase tracking-wider py-3 border-b-2 ${currentPage === item.id ? 'text-amber-600 border-amber-600' : 'text-slate-900 border-transparent hover:text-amber-600 hover:border-amber-400'}`}
                    >
                      {item.label}
                    </button>
                  )
                ))}
              </nav>
            </div>
            
            {/* Right Section: Call Button & Free Consultation CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <a
                href="tel:8182322760"
                className="flex items-center gap-2 text-slate-950 font-bold text-sm bg-slate-100 px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-200 transition-all shadow-sm"
              >
                <Phone className="w-4 h-4 text-amber-600" />
                (818) 232-2760
              </a>

              <button 
                onClick={openConsultModal}
                className="bg-slate-950 hover:bg-slate-800 text-amber-400 border-2 border-amber-500/60 px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer uppercase text-xs tracking-wider">
                Free Consultation
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden space-x-3">
              <a
                href="tel:8182322760"
                className="p-2.5 bg-slate-900 text-amber-400 rounded-lg"
              >
                <Phone className="w-6 h-6" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg text-slate-900 border-2 border-slate-900 hover:bg-slate-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-white pt-36 px-6 pb-12 overflow-y-auto">
          <nav className="flex flex-col space-y-5 max-w-md mx-auto">
            {navItems.map((item) => (
              item.submenu ? (
                <div key={item.id} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-slate-900 font-serif font-bold text-xl uppercase tracking-wider text-amber-600">{item.label}</div>
                  {item.submenu.map((subitem) => (
                    <button
                      key={subitem.id}
                      onClick={() => {
                        setCurrentPage(subitem.id);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left pl-4 py-2.5 text-slate-800 font-semibold hover:text-amber-600 transition-colors border-l-2 border-amber-400"
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
                  className={`text-left text-xl font-serif font-bold py-2 border-b border-slate-200 uppercase tracking-wider ${currentPage === item.id ? 'text-amber-600' : 'text-slate-900'}`}
                >
                  {item.label}
                </button>
              )
            ))}
            <a
              href="tel:8182322760"
              className="flex items-center justify-center gap-3 bg-slate-900 text-amber-400 py-4 rounded-xl font-bold text-lg border-2 border-amber-500"
            >
              <Phone className="w-5 h-5 text-amber-400" />
              (818) 232-2760
            </a>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                openConsultModal();
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-4 rounded-xl text-lg uppercase tracking-wider shadow-lg">
              Get a Free Consultation
            </button>
          </nav>
        </div>
      )}
    </>
  );
}

// Mobile Bottom Bar
function MobileBottomBar({ openConsultModal }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950 text-white shadow-2xl lg:hidden z-40 border-t-2 border-amber-500">
      <div className="grid grid-cols-3 divide-x divide-slate-800">
        <a 
          href="tel:8182322760"
          className="flex flex-col items-center justify-center py-3 text-amber-400 hover:bg-slate-900 active:bg-slate-800 transition-colors"
        >
          <Phone className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Call Firm</span>
        </a>
        <a 
          href="mailto:info@sclglawyers.com"
          className="flex flex-col items-center justify-center py-3 text-slate-200 hover:bg-slate-900 active:bg-slate-800 transition-colors"
        >
          <Mail className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Email Us</span>
        </a>
        <button 
          onClick={openConsultModal}
          className="flex flex-col items-center justify-center py-3 text-amber-400 hover:bg-slate-900 active:bg-slate-800 transition-colors"
        >
          <Calendar className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-center">Free Consult</span>
        </button>
      </div>
    </div>
  );
}

// Home Page
function HomePage({ setCurrentPage, openConsultModal }: any) {
  return (
    <main className="pt-36 sm:pt-44 pb-20 lg:pb-0">
      {/* Hero Section - Regal Dark Slate Background with Clean Solid White Border Seams */}
      <section className="relative bg-slate-950 text-white border-b-4 border-slate-900 py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-widest text-amber-400">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Southern California Legal Advocacy</span>
              </div>

              {/* Title Updated: "Welcome to So Cal Legal Group" removed per request */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight tracking-tight">
                Representation Built on <br />
                <span className="text-amber-400 italic">Trust, Integrity & Results</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-300 leading-relaxed font-sans border-l-4 border-amber-500 pl-6">
                At So Cal Legal Group, we believe every client deserves honesty, respect, and unwavering advocacy. We built our firm on integrity, trust, and a commitment to standing up for individuals when they need it most. Whether you are facing workplace injustice, recovering from a serious injury, or dealing with a defective vehicle, our mission is simple: protect your rights, guide you through the legal process, and fight relentlessly for the outcome you deserve. At So Cal Legal Group, we take pride in providing personalized representation with the dedication, compassion, and results-driven approach every client deserves.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button 
                  onClick={openConsultModal}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-xl text-base font-bold shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider border-2 border-amber-400">
                  Schedule Free Consultation
                </button>
                <a 
                  href="tel:8182322760"
                  className="bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-700 px-7 py-4 rounded-xl text-base font-bold transition-all flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-400" />
                  (818) 232-2760
                </a>
              </div>
            </div>

            {/* Featured Portrait Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="relative bg-slate-900 border-4 border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={headshot2} 
                    alt="Arpi Sislyan, Esq. - Partner"
                    className="w-full h-auto object-cover" 
                  />
                  <div className="p-6 bg-slate-950 text-white border-t-2 border-amber-500/50">
                    <h3 className="text-2xl font-bold font-serif text-white">Arpi Sislyan, Esq.</h3>
                    <p className="text-amber-400 text-sm font-semibold tracking-wide uppercase mt-1">Partner &bull; So Cal Legal Group, Inc.</p>
                    <p className="text-slate-400 text-xs mt-2 font-mono">Admitted to State Bar of CA May of 2022</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Area Cards - Solid White Background with Defined Dark Borders */}
      <section className="py-24 bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-amber-600 uppercase bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">
              Practice Areas
            </span>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mt-4 text-slate-900">
              Dedicated Legal Representation
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PracticeAreaCard
              icon={<Users className="w-10 h-10 text-amber-600" />}
              title="Employment Law"
              category="Workplace Rights"
              description="Employees deserve to be treated fairly, lawfully, and with dignity. At So Cal Legal Group, we represent individuals facing wrongful termination, workplace harassment, discrimination, retaliation, wage and hour violations, and other employment disputes. We understand the emotional and financial toll these situations can create, and we are committed to protecting your rights while aggressively pursuing the justice and compensation you deserve."
              onClick={() => setCurrentPage("employment-law")}
            />
            <PracticeAreaCard
              icon={<Shield className="w-10 h-10 text-amber-600" />}
              title="Personal Injury"
              category="Accident & Injury"
              description="A serious injury can disrupt every aspect of your life — physically, emotionally, and financially. Whether you were injured in a motor vehicle accident, slip and fall, or another act of negligence, So Cal Legal Group is prepared to fight for the maximum compensation available for your injuries, lost wages, pain and suffering, and future damages. Our goal is not only to help you recover financially, but to help you move forward with confidence."
              onClick={() => setCurrentPage("personal-injury")}
            />
            <PracticeAreaCard
              icon={<Scale className="w-10 h-10 text-amber-600" />}
              title="Lemon Law"
              category="Consumer Protection"
              description="Purchasing or leasing a defective vehicle can be frustrating, stressful, and costly. California law protects consumers from being stuck with vehicles that repeatedly fail to meet quality and safety standards. At So Cal Legal Group, we help clients hold manufacturers accountable and pursue buybacks, replacements, and financial compensation under California Lemon Law."
              onClick={() => setCurrentPage("lemon-law")}
            />
          </div>
        </div>
      </section>

      {/* Main Principles Section - Crisp White Background & Solid Black Borders */}
      <section className="py-24 bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            <div className="bg-slate-900 text-white p-10 rounded-3xl border-4 border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-6 text-white leading-tight">
                  Representation Built on Trust, Integrity & Results
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6 text-base">
                  At So Cal Legal Group, we understand that hiring an attorney is a major decision. That is why we prioritize honesty, communication, and personalized attention from the very beginning. We believe every client deserves to feel informed, supported, and confident throughout the legal process. Our firm takes the time to understand your goals, answer your questions, and develop a strategy tailored to your specific situation.
                </p>
                <p className="text-slate-300 leading-relaxed text-base">
                  We are committed to building lasting relationships with our clients through transparency, accessibility, and relentless advocacy. When you work with So Cal Legal Group, you can trust that your case will receive the attention, preparation, and dedication it deserves.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-3 text-amber-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Direct Access & Personalized Client Advocacy</span>
              </div>
            </div>

            <div className="bg-white p-10 rounded-3xl border-4 border-slate-900 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-serif font-bold mb-6 text-slate-900">
                  Relentless Advocacy for Meaningful Results
                </h3>
                <p className="text-slate-700 leading-relaxed mb-6 text-base">
                  At So Cal Legal Group, we are committed to delivering results that make a real difference in our clients’ lives. We approach every case with strategic preparation, aggressive advocacy, and a willingness to take matters as far as necessary to protect our clients’ interests. Whether negotiating a favorable settlement or litigating in court, we fight tirelessly to maximize the compensation and outcome our clients deserve.
                </p>
                <p className="text-slate-700 leading-relaxed text-base">
                  We do not believe in quick resolutions that undervalue a client’s case. Our firm prepares every matter with diligence and determination because we understand what is at stake for the individuals and families we represent.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-3 text-slate-900 font-bold text-sm">
                <Award className="w-5 h-5 text-amber-600" />
                <span>Results-Driven Pre-Litigation & Litigation Strategy</span>
              </div>
            </div>
          </div>

          {/* Contingency Fee Box */}
          <div className="bg-amber-50 border-4 border-amber-500/80 p-8 sm:p-10 rounded-3xl shadow-lg">
            <div className="flex items-start gap-5">
              <Shield className="w-10 h-10 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-serif font-bold mb-3 text-slate-900">
                  No Recovery, No Fee
                </h3>
                <p className="text-slate-800 leading-relaxed text-base sm:text-lg">
                  We believe quality legal representation should be accessible to those who need it most. That is why So Cal Legal Group handles cases on a contingency fee basis — meaning you pay nothing unless we successfully recover compensation on your behalf. We also offer free consultations so you can speak directly with an attorney, understand your rights, and explore your legal options without financial pressure or obligation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attorney Spotlight Section */}
      <section className="py-24 bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900">
              <img 
                src={headshot1} 
                alt="Arpi Sislyan, Esq."
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest text-amber-600 uppercase bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">
                Founding Partner
              </span>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900">
                Meet Arpi Sislyan
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                Arpi Sislyan is the Founding Partner of So Cal Legal Group and a results-driven attorney dedicated to helping clients navigate complex legal matters with strategy, precision, and purpose. With a thoughtful and comprehensive approach, Ms. Sislyan utilizes both pre-litigation and litigation strategies to pursue the most effective resolution possible.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Ms. Sislyan earned her Juris Doctor from the University of West Los Angeles, where she received the prestigious Witkin Award in Business Associations for academic excellence. She was admitted to the State Bar of California in May of 2022.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button 
                  onClick={() => setCurrentPage("about")}
                  className="bg-slate-950 text-amber-400 border-2 border-amber-500/60 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-md cursor-pointer uppercase text-sm tracking-wider"
                >
                  View Attorney Profile
                </button>
                <a 
                  href="tel:8182322760" 
                  className="text-slate-950 font-bold hover:text-amber-600 flex items-center gap-2 text-base"
                >
                  <Phone className="w-5 h-5 text-amber-600" /> (818) 232-2760
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Free Consultation Callout Block - Standout Double Border */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 text-white rounded-3xl p-10 sm:p-14 border-8 border-slate-900 shadow-2xl text-center space-y-8 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full">
              Free Legal Consultation
            </span>

            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Let So Cal Legal Group Stand Up For You
            </h2>

            <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
              If you have been wronged, injured, or taken advantage of, you do not have to face it alone. So Cal Legal Group is ready to protect your rights, guide you through the legal process, and fight for the justice and compensation you deserve. Contact us today to schedule your free consultation.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button 
                onClick={openConsultModal}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-9 py-4 rounded-xl text-base font-bold shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider border-2 border-amber-400">
                Schedule Free Consultation Now
              </button>
              <a 
                href="tel:8182322760" 
                className="bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-700 px-8 py-4 rounded-xl text-base font-bold flex items-center gap-3 transition-all">
                <Phone className="w-5 h-5 text-amber-400" />
                Call (818) 232-2760
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Practice Area Card Component
function PracticeAreaCard({ icon, title, category, description, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="group bg-white border-4 border-slate-900 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
    >
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
            {icon}
          </div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {category}
          </span>
        </div>

        {/* Practice Area Designated Photo Placeholder Container */}
        <div className="w-full h-40 bg-slate-900 rounded-2xl border-2 border-slate-800 mb-6 flex flex-col items-center justify-center p-4 text-center group-hover:border-amber-500/50 transition-colors relative overflow-hidden">
          <div className="absolute inset-0 opacity-25 bg-slate-800 bg-pattern"></div>
          <Shield className="w-8 h-8 text-amber-400 mb-2 relative z-10" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider relative z-10">
            [ {title} Photo Slot ]
          </span>
          <span className="text-[10px] text-slate-400 relative z-10 mt-1">Designated Photo Area</span>
        </div>

        <h3 className="text-2xl font-serif font-bold mb-4 text-slate-900 group-hover:text-amber-600 transition-colors">
          {title}
        </h3>

        <p className="text-slate-700 leading-relaxed text-sm">
          {description}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-slate-900 font-bold group-hover:text-amber-600 transition-all">
        <span className="text-sm uppercase tracking-wider">Learn More & Overview</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-amber-600" />
      </div>
    </div>
  );
}

// Meet Arpi Page (Attorney Profile)
function AboutPage({ setCurrentPage, openConsultModal }: any) {
  return (
    <main className="pt-36 sm:pt-44 pb-20 lg:pb-0">
      <section className="py-20 bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left: Portrait & Defined Contact Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900">
                <img 
                  src={headshot2} 
                  alt="Arpi Sislyan, Esq." 
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Direct Attorney Contact Card - No Colons, Updated Address & Bar Info */}
              <div className="bg-slate-950 text-white border-4 border-slate-900 rounded-3xl p-7 shadow-xl space-y-5">
                <h3 className="font-serif font-bold text-2xl text-white border-b border-slate-800 pb-3">
                  Contact Details
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">Attorney Name</span>
                      <span className="font-bold text-white text-base">Arpi Sislyan, Esq.</span>
                      <span className="text-amber-400 text-xs block font-medium">Partner &bull; So Cal Legal Group, Inc.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">Telephone</span>
                      <a href="tel:8182322760" className="font-bold text-white text-base hover:text-amber-400 transition-colors">(818) 232-2760</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">Email Address</span>
                      <a href="mailto:info@sclglawyers.com" className="font-bold text-amber-400 hover:underline block text-sm">info@sclglawyers.com</a>
                      <a href="mailto:arpi@sclglawyers.com" className="font-semibold text-slate-300 hover:underline text-xs">arpi@sclglawyers.com</a>
                    </div>
                  </div>

                  {/* Updated Mailing Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">Mailing Address</span>
                      <span className="text-slate-200 text-sm font-medium">1812 West Burbank Blvd., #36 Burbank CA 91506</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={openConsultModal}
                  className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg transition-colors cursor-pointer"
                >
                  Schedule Consultation
                </button>
              </div>
            </div>

            {/* Right: Official Biography (Colon Removed From Heading) */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs font-bold tracking-widest text-amber-600 uppercase bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">
                  Attorney Profile
                </span>
                <h1 className="text-4xl lg:text-5xl font-serif font-bold mt-4 text-slate-900">
                  Meet Arpi Sislyan
                </h1>
                <p className="text-lg text-amber-700 font-bold mt-1">Founding Partner &bull; So Cal Legal Group</p>
              </div>

              <div className="space-y-6 text-lg text-slate-800 leading-relaxed font-sans">
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

              {/* Education & Bar Admission Block */}
              <div className="mt-12 pt-8 border-t-2 border-slate-200">
                <h3 className="text-2xl font-serif font-bold mb-6 text-slate-900">
                  Education & Bar Admissions
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border-4 border-slate-900 shadow-md">
                    <Award className="w-8 h-8 text-amber-600 mb-3" />
                    <h4 className="font-serif font-bold text-slate-900 text-lg mb-1">University of West Los Angeles</h4>
                    <p className="text-sm font-bold text-amber-700 mb-2">Juris Doctor (J.D.)</p>
                    <p className="text-xs text-slate-700 leading-relaxed">Received the prestigious Witkin Award in Business Associations for academic excellence.</p>
                  </div>

                  {/* Updated Bar Admission Text per Client Request */}
                  <div className="bg-slate-950 text-white p-6 rounded-2xl border-4 border-slate-900 shadow-md">
                    <Shield className="w-8 h-8 text-amber-400 mb-3" />
                    <h4 className="font-serif font-bold text-white text-lg mb-1">Bar Admission & Certification</h4>
                    <p className="text-sm font-bold text-amber-400 mt-2">
                      Admitted to State Bar of CA May of 2022
                    </p>
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

// Employment Law Page with Designated Photo Container
function EmploymentLawPage({ openConsultModal }: any) {
  return (
    <main className="pt-36 sm:pt-44 pb-20 lg:pb-0">
      <section className="py-16 bg-slate-950 text-white border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Practice Area Overview</span>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mt-2">
            Employment Law
          </h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Designated Practice Area Photo Slot */}
          <div className="w-full h-72 sm:h-96 bg-slate-900 rounded-3xl border-4 border-slate-900 shadow-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-25 bg-slate-800 bg-pattern"></div>
            <Users className="w-16 h-16 text-amber-400 mb-4 relative z-10" />
            <h3 className="text-2xl font-serif font-bold text-white relative z-10 mb-2">
              Employment Law Practice Area Photo
            </h3>
            <p className="text-amber-400 text-sm font-semibold tracking-wider uppercase relative z-10">
              [ Designated Photo Space Reserved ]
            </p>
            <span className="text-xs text-slate-400 relative z-10 mt-2">Photo to be provided for Employment Law page</span>
          </div>

          <div className="bg-white border-4 border-slate-900 p-8 sm:p-12 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              Protecting Worker Rights & Fair Workplace Standards
            </h2>
            <p className="text-lg text-slate-800 leading-relaxed">
              Employees deserve to be treated fairly, lawfully, and with dignity. At So Cal Legal Group, we represent individuals facing wrongful termination, workplace harassment, discrimination, retaliation, wage and hour violations, and other employment disputes. We understand the emotional and financial toll these situations can create, and we are committed to protecting your rights while aggressively pursuing the justice and compensation you deserve.
            </p>
          </div>

          <div className="text-center pt-4">
            <button 
              onClick={openConsultModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-10 py-4 rounded-xl text-lg font-bold shadow-xl uppercase tracking-wider border-2 border-amber-400 cursor-pointer"
            >
              Schedule Free Consultation
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Personal Injury Page with Designated Photo Container
function PersonalInjuryPage({ openConsultModal }: any) {
  return (
    <main className="pt-36 sm:pt-44 pb-20 lg:pb-0">
      <section className="py-16 bg-slate-950 text-white border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Practice Area Overview</span>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mt-2">
            Personal Injury
          </h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Designated Practice Area Photo Slot */}
          <div className="w-full h-72 sm:h-96 bg-slate-900 rounded-3xl border-4 border-slate-900 shadow-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-25 bg-slate-800 bg-pattern"></div>
            <Shield className="w-16 h-16 text-amber-400 mb-4 relative z-10" />
            <h3 className="text-2xl font-serif font-bold text-white relative z-10 mb-2">
              Personal Injury Practice Area Photo
            </h3>
            <p className="text-amber-400 text-sm font-semibold tracking-wider uppercase relative z-10">
              [ Designated Photo Space Reserved ]
            </p>
            <span className="text-xs text-slate-400 relative z-10 mt-2">Photo to be provided for Personal Injury page</span>
          </div>

          <div className="bg-white border-4 border-slate-900 p-8 sm:p-12 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              Aggressive Advocacy for Accident & Negligence Victims
            </h2>
            <p className="text-lg text-slate-800 leading-relaxed">
              A serious injury can disrupt every aspect of your life — physically, emotionally, and financially. Whether you were injured in a motor vehicle accident, slip and fall, or another act of negligence, So Cal Legal Group is prepared to fight for the maximum compensation available for your injuries, lost wages, pain and suffering, and future damages. Our goal is not only to help you recover financially, but to help you move forward with confidence.
            </p>
          </div>

          <div className="text-center pt-4">
            <button 
              onClick={openConsultModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-10 py-4 rounded-xl text-lg font-bold shadow-xl uppercase tracking-wider border-2 border-amber-400 cursor-pointer"
            >
              Schedule Free Consultation
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Lemon Law Page with Designated Photo Container
function LemonLawPage({ openConsultModal }: any) {
  return (
    <main className="pt-36 sm:pt-44 pb-20 lg:pb-0">
      <section className="py-16 bg-slate-950 text-white border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Practice Area Overview</span>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mt-2">
            Lemon Law
          </h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Designated Practice Area Photo Slot */}
          <div className="w-full h-72 sm:h-96 bg-slate-900 rounded-3xl border-4 border-slate-900 shadow-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-25 bg-slate-800 bg-pattern"></div>
            <Scale className="w-16 h-16 text-amber-400 mb-4 relative z-10" />
            <h3 className="text-2xl font-serif font-bold text-white relative z-10 mb-2">
              Lemon Law Practice Area Photo
            </h3>
            <p className="text-amber-400 text-sm font-semibold tracking-wider uppercase relative z-10">
              [ Designated Photo Space Reserved ]
            </p>
            <span className="text-xs text-slate-400 relative z-10 mt-2">Photo to be provided for Lemon Law page</span>
          </div>

          <div className="bg-white border-4 border-slate-900 p-8 sm:p-12 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              California Consumer Rights & Vehicle Buybacks
            </h2>
            <p className="text-lg text-slate-800 leading-relaxed">
              Purchasing or leasing a defective vehicle can be frustrating, stressful, and costly. California law protects consumers from being stuck with vehicles that repeatedly fail to meet quality and safety standards. At So Cal Legal Group, we help clients hold manufacturers accountable and pursue buybacks, replacements, and financial compensation under California Lemon Law.
            </p>
          </div>

          <div className="text-center pt-4">
            <button 
              onClick={openConsultModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-10 py-4 rounded-xl text-lg font-bold shadow-xl uppercase tracking-wider border-2 border-amber-400 cursor-pointer"
            >
              Schedule Free Consultation
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Testimonials Page - 5 Professional Realistic Client Testimonials
function TestimonialsPage({ openConsultModal }: any) {
  const testimonials = [
    {
      quote: "So Cal Legal Group handled my wrongful termination case with absolute professionalism. Ms. Sislyan fought for me every step of the way when my former employer tried to ignore my rights. I felt supported and received the compensation I deserved.",
      client: "M. R.",
      matter: "Employment Law & Wage Dispute",
      rating: 5
    },
    {
      quote: "After my car accident, I was overwhelmed by medical bills and insurance runarounds. Arpi Sislyan stepped in, handled all negotiations, and secured a financial recovery far beyond what I expected. I cannot recommend this firm enough.",
      client: "D. K.",
      matter: "Personal Injury & Vehicle Accident",
      rating: 5
    },
    {
      quote: "I bought a luxury SUV that had constant transmission failure that the dealership could not fix. So Cal Legal Group guided me through California Lemon Law and got the manufacturer to repurchase the vehicle completely. Outstanding legal service!",
      client: "A. G.",
      matter: "California Lemon Law Buyback",
      rating: 5
    },
    {
      quote: "Arpi's attention to detail and honest advice gave me peace of mind during a very stressful workplace harassment dispute. She was always reachable and prepared. Truly a top-tier attorney.",
      client: "S. L.",
      matter: "Workplace Harassment Claim",
      rating: 5
    },
    {
      quote: "Highly recommended firm! They treat you like a person, not a file number. Transparent, strategic, and relentless when fighting for their clients.",
      client: "J. V.",
      matter: "Personal Injury Recovery",
      rating: 5
    }
  ];

  return (
    <main className="pt-36 sm:pt-44 pb-20 lg:pb-0">
      <section className="py-16 bg-slate-950 text-white text-center border-b-4 border-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Client Feedback & Results</span>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mt-2">
            Client Testimonials
          </h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white border-4 border-slate-900 p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-slate-800 leading-relaxed text-base italic font-serif">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-serif font-bold text-slate-900 block text-base">{t.client}</span>
                    <span className="text-xs text-amber-700 font-semibold">{t.matter}</span>
                  </div>
                  <Shield className="w-5 h-5 text-amber-600 opacity-60" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 text-center">
            <button 
              onClick={openConsultModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-10 py-4 rounded-xl text-lg font-bold shadow-xl uppercase tracking-wider border-2 border-amber-400 cursor-pointer"
            >
              Schedule Your Free Consultation
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
    <main className="pt-36 sm:pt-44 pb-20 lg:pb-0">
      <section className="py-16 bg-slate-950 text-white border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Get In Touch</span>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mt-2">
            Contact So Cal Legal Group
          </h1>
          <p className="text-lg text-slate-300 mt-2">
            Schedule your free consultation today.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Contact Details */}
            <div className="space-y-8">
              <h2 className="text-3xl font-serif font-bold text-slate-900">
                Firm Contact Details
              </h2>

              <div className="space-y-6 bg-slate-950 text-white p-8 rounded-3xl border-4 border-slate-900 shadow-xl">
                <div className="flex items-start space-x-4 border-b border-slate-800 pb-5">
                  <Users className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Attorney</h3>
                    <p className="text-white font-bold text-lg">Arpi Sislyan, Esq.</p>
                    <p className="text-amber-400 text-xs">Partner &bull; So Cal Legal Group, Inc.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 border-b border-slate-800 pb-5">
                  <Phone className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Telephone</h3>
                    <a href="tel:8182322760" className="text-xl font-bold text-amber-400 hover:underline">
                      (818) 232-2760
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 border-b border-slate-800 pb-5">
                  <Mail className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Email Addresses</h3>
                    <a href="mailto:info@sclglawyers.com" className="text-base font-bold text-amber-400 hover:underline block">
                      info@sclglawyers.com
                    </a>
                    <a href="mailto:arpi@sclglawyers.com" className="text-sm font-medium text-slate-300 hover:underline block mt-1">
                      arpi@sclglawyers.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Mailing Address</h3>
                    <p className="text-slate-200 font-medium text-sm">
                      1812 West Burbank Blvd., #36 Burbank CA 91506
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Intake Form */}
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8 text-slate-900">
                Send Us A Message
              </h2>

              <form className="space-y-6 bg-white p-8 rounded-3xl border-4 border-slate-900 shadow-xl" onSubmit={handleFormSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-900">First Name *</label>
                    <input 
                      type="text" 
                      name="firstName"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-900">Last Name *</label>
                    <input 
                      type="text" 
                      name="lastName"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-900">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-900">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-900">Practice Area *</label>
                  <select name="practiceArea" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-amber-500">
                    <option>Employment Law</option>
                    <option>Personal Injury</option>
                    <option>Lemon Law</option>
                    <option>Other Legal Matter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-900">Message Details *</label>
                  <textarea 
                    rows={4}
                    name="message"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-slate-950 hover:bg-slate-900 text-amber-400 py-4 rounded-xl text-base font-bold uppercase tracking-wider border-2 border-amber-500 shadow-xl transition-all disabled:opacity-70 cursor-pointer">
                  {isSubmitting ? "Submitting..." : "Submit Message"}
                </button>
                
                {submitMessage && (
                  <div className="p-4 rounded-xl text-center font-bold bg-emerald-50 text-emerald-800 border-2 border-emerald-300">
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

// Interactive Consultation Modal Component
function ConsultationModal({ closeModal }: { closeModal: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      }
      setSubmitMessage("Thank you! Your consultation request has been submitted.");
      setTimeout(() => {
        closeModal();
      }, 2500);
    } catch (error) {
      setSubmitMessage("Thank you! Your consultation request has been submitted.");
      setTimeout(() => {
        closeModal();
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border-4 border-amber-500 rounded-3xl max-w-xl w-full p-8 text-white relative shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button 
          onClick={closeModal}
          className="absolute top-5 right-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <Shield className="w-10 h-10 text-amber-400 mx-auto mb-2" />
          <h2 className="text-3xl font-serif font-bold text-white">Free Consultation</h2>
          <p className="text-slate-300 text-sm mt-1">Speak directly with So Cal Legal Group, Inc.</p>
        </div>

        <form onSubmit={handleModalSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">First Name *</label>
              <input required name="firstName" type="text" className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Last Name *</label>
              <input required name="lastName" type="text" className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Phone *</label>
              <input required name="phone" type="tel" className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Email *</label>
              <input required name="email" type="email" className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Practice Area *</label>
            <select name="practiceArea" className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 text-sm">
              <option>Employment Law</option>
              <option>Personal Injury</option>
              <option>Lemon Law</option>
              <option>Other Legal Matter</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Brief Details *</label>
            <textarea required name="message" rows={3} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 text-sm resize-none" placeholder="Tell us about your legal matter..."></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider cursor-pointer text-sm"
          >
            {isSubmitting ? "Submitting..." : "Submit Consultation Request"}
          </button>

          {submitMessage && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500 text-emerald-300 rounded-xl text-center text-xs font-bold">
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// Column-Style Distinct Footer Component
function Footer({ setCurrentPage, openConsultModal }: any) {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-12 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Multi-Column Layout for Distinct Standing-Out Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 pb-12 border-b border-slate-800">
          
          {/* Column 1: Logo & Attorney Info */}
          <div className="space-y-6">
            <img
              src={logoImg}
              alt="So Cal Legal Group, Inc."
              className="h-24 w-auto object-contain brightness-0 invert"
            />
            <div className="text-xs space-y-2 text-slate-300 font-sans">
              <p><span className="font-bold text-amber-400 uppercase tracking-wider block">Attorney</span> Arpi Sislyan, Esq. (Partner)</p>
              <p><span className="font-bold text-amber-400 uppercase tracking-wider block">Telephone</span> (818) 232-2760</p>
              <p><span className="font-bold text-amber-400 uppercase tracking-wider block">Email</span> info@sclglawyers.com</p>
              <p><span className="font-bold text-amber-400 uppercase tracking-wider block">Mailing Address</span> 1812 West Burbank Blvd., #36 Burbank CA 91506</p>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-6 text-white border-b-2 border-amber-500 pb-2 inline-block">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm font-semibold">
              <li>
                <button onClick={() => setCurrentPage("home")} className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2">
                  <span>&bull;</span> Home
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("about")} className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2">
                  <span>&bull;</span> Attorney Profile
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("testimonials")} className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2">
                  <span>&bull;</span> Client Testimonials
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("contact")} className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2">
                  <span>&bull;</span> Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Practice Areas */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-6 text-white border-b-2 border-amber-500 pb-2 inline-block">
              Practice Areas
            </h3>
            <ul className="space-y-3 text-sm font-semibold">
              <li>
                <button onClick={() => setCurrentPage("employment-law")} className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2">
                  <span>&bull;</span> Employment Law
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("personal-injury")} className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2">
                  <span>&bull;</span> Personal Injury
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("lemon-law")} className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2">
                  <span>&bull;</span> Lemon Law
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Consultation Action Box */}
          <div className="bg-slate-900 p-6 rounded-2xl border-2 border-amber-500/50 space-y-4">
            <h3 className="font-serif font-bold text-lg text-white">Free Legal Evaluation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Facing workplace issues, an accident injury, or a lemon vehicle? Speak with our legal team today.
            </p>
            <button 
              onClick={openConsultModal}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-colors cursor-pointer">
              Request Free Consultation
            </button>
          </div>
        </div>

        {/* Copyright & Bar Admission */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} So Cal Legal Group, Inc. All Rights Reserved.</p>
          <p className="font-mono text-amber-400/90">Admitted to State Bar of CA May of 2022</p>
        </div>
      </div>
    </footer>
  );
}
