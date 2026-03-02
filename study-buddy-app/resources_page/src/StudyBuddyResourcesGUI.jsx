import React, { useState, useEffect } from 'react';
import { 
  Brain, LayoutDashboard, Lightbulb, GraduationCap, 
  Menu, Zap, PenTool, Save, Trash2, RefreshCw, Loader2, 
  ChevronRight, PlayCircle, FileText, CheckCircle2,
  Video, Clock, ExternalLink, LogOut, AlertCircle
} from 'lucide-react';

const MOCK_DATA = [
  { 
    title: "Laws of Thermodynamics", type: "Video", source: "Khan Academy", 
    desc: "Comprehensive breakdown of the 3 laws.", link: "https://www.khanacademy.org"
  }
];

const StudyBuddyResourcesGUI = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isStudyMode, setIsStudyMode] = useState(false);
  
  // Data State
  const [notes, setNotes] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // User Context
  const user = { name: "Krish", weakAreas: ["Thermodynamics", "Entropy"] };

  // --- HANDLERS ---
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleStudyMode = () => {
    setIsStudyMode(!isStudyMode);
    if (!isStudyMode) setIsSidebarOpen(false);
  };

  // --- API CALL TO LOCAL PYTHON BACKEND ---
  const fetchRecommendations = async () => {
    setErrorMsg(null);
    setLoading(true);
    
    try {
      // Calling our new FastAPI backend instead of Google directly
      const response = await fetch('http://localhost:8000/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weakAreas: user.weakAreas })
      });

      if (!response.ok) {
        // If the backend threw an HTTPException (like our 429 rate limit error)
        const errorData = await response.json();
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setRecommendations(data);
      
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to connect to Python backend.");
      setRecommendations(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  };

  // Notes Persistence
  useEffect(() => {
    const saved = localStorage.getItem('sb_notes');
    if (saved) setNotes(saved);
  }, []);

  useEffect(() => localStorage.setItem('sb_notes', notes), [notes]);

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-navy-950 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">Current Focus</span>
                <h2 className="text-3xl font-bold mt-2">Physics: Thermodynamics</h2>
                <p className="text-slate-300 mt-2 max-w-lg">
                  You've mastered 45% of this unit. AI recommends focusing on <strong>Entropy</strong>.
                </p>
                <button 
                  onClick={() => setActiveTab('ai')}
                  className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-flex items-center shadow-lg shadow-emerald-500/20"
                >
                  Get AI Resources <ChevronRight size={18} className="ml-2"/>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-6 rounded-xl border ${isStudyMode ? 'bg-navy-950 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'}`}>
                <h3 className="font-bold flex items-center mb-4"><Clock className="text-emerald-500 mr-2" size={20} /> Recent Activity</h3>
                <ul className="space-y-3 text-sm opacity-80">
                  <li className="flex items-center"><CheckCircle2 size={16} className="mr-2 text-emerald-500"/> Unit Test 2 (B+)</li>
                  <li className="flex items-center"><PlayCircle size={16} className="mr-2 text-blue-500"/> Watched "Heat Engines"</li>
                </ul>
              </div>
              <div className={`p-6 rounded-xl border ${isStudyMode ? 'bg-navy-950 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'}`}>
                <h3 className="font-bold mb-2">Study Streak</h3>
                <div className="text-4xl font-bold text-emerald-500">12 Days</div>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className={`text-2xl font-bold ${isStudyMode ? 'text-white' : 'text-slate-800'}`}>AI Recommendations</h2>
                <p className={`text-sm ${isStudyMode ? 'text-slate-400' : 'text-slate-500'}`}>Powered by Python Backend</p>
              </div>
              <button onClick={fetchRecommendations} disabled={loading} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center disabled:opacity-50">
                <RefreshCw size={18} className={`mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
              </button>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-bold">Backend Error:</p>
                  <p>{errorMsg}</p>
                  <p className="text-xs mt-1 opacity-75">Make sure your Python server is running on port 8000!</p>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {loading && <div className="text-center p-8 text-slate-400"><Loader2 className="animate-spin mx-auto mb-2 text-emerald-500"/>Backend is generating with auto-retries...</div>}
              
              {!loading && recommendations.map((rec, idx) => (
                  <a key={idx} href={rec.link} target="_blank" rel="noopener noreferrer" className={`block p-4 rounded-xl border hover:border-emerald-500 transition-all cursor-pointer group ${isStudyMode ? 'bg-navy-950 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-start">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 ${rec.type === 'Video' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                        {rec.type === 'Video' ? <Video size={20}/> : <FileText size={20}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className={`font-bold text-lg truncate pr-2 ${isStudyMode ? 'text-white' : 'text-slate-800'}`}>{rec.title}</h4>
                          <ExternalLink size={16} className="text-slate-400 group-hover:text-emerald-500" />
                        </div>
                        <p className={`text-sm mt-1 line-clamp-2 ${isStudyMode ? 'text-slate-400' : 'text-slate-500'}`}>{rec.desc}</p>
                        <span className="text-xs font-semibold text-emerald-500 mt-2 block uppercase tracking-wide">{rec.source}</span>
                      </div>
                    </div>
                  </a>
              ))}
              
              {!loading && recommendations.length === 0 && !errorMsg && (
                <div className="text-center text-slate-400 py-10 border-2 border-dashed border-slate-200 rounded-xl">
                    <p>No resources loaded.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="h-full flex flex-col animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${isStudyMode ? 'text-white' : 'text-slate-800'}`}>Quick Notes</h2>
            </div>
            <div className={`flex-1 rounded-xl border p-6 relative overflow-hidden shadow-inner ${isStudyMode ? 'bg-navy-950 border-slate-700' : 'bg-[#fffdf0] border-yellow-200'}`}>
               <textarea className={`w-full h-full bg-transparent border-none resize-none focus:ring-0 leading-8 text-lg font-medium ${isStudyMode ? 'text-slate-200' : 'text-slate-800'}`} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className={`flex h-screen font-sans transition-colors duration-500 ${isStudyMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <aside className={`bg-navy-950 text-white flex flex-col transition-all duration-300 z-20 overflow-hidden border-r border-slate-800 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="h-24 flex items-center justify-center border-b border-slate-800 bg-[#0B1120]">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20"><Brain className="text-white" size={24} /></div>
            {isSidebarOpen && <span className="ml-3 text-2xl font-bold tracking-tight text-white">Study<span className="text-emerald-400">Buddy</span></span>}
        </div>
        <nav className="flex-1 px-4 mt-8 space-y-2">
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={22}/>, label: 'Dashboard' },
            { id: 'ai', icon: <Lightbulb size={22}/>, label: 'AI Recommendations' },
            { id: 'notes', icon: <PenTool size={22}/>, label: 'Quick Notes' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center px-4 py-4 rounded-xl transition-all duration-200 ${activeTab === item.id ? 'bg-emerald-500 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'}`}>
              {item.icon}{isSidebarOpen && <span className="ml-3 text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className={`h-20 flex items-center justify-between px-8 border-b ${isStudyMode ? 'bg-navy-950 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="p-2 text-slate-500"><Menu size={24} /></button>
            <h1 className={`ml-6 text-xl font-bold capitalize ${isStudyMode ? "text-slate-100" : "text-slate-800"}`}>{activeTab}</h1>
          </div>
          <button onClick={toggleStudyMode} className={`flex items-center px-5 py-2.5 rounded-full font-bold text-sm border ${isStudyMode ? 'bg-navy-950 text-emerald-400 border-emerald-500/30' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'}`}>
            <Zap size={16} className={`mr-2 ${isStudyMode ? 'fill-emerald-400' : 'text-slate-400'}`} /> {isStudyMode ? "Focus Mode: ON" : "Focus Mode: OFF"}
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full">{renderContent()}</div>
      </main>
    </div>
  );
};

export default StudyBuddyResourcesGUI;