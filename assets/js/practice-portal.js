const {
  useState,
  useEffect
} = React;
function App() {
  const [activeModule, setActiveModule] = useState("portal");

  // Exceptions States
  const [tab, setTab] = useState("mcq");
  const [levelFilter, setLevelFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All Topics");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [answered, setAnswered] = useState({});
  const [showHints, setShowHints] = useState({});
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const PER_PAGE = 10;

  // OOP States
  const [oopTab, setOopTab] = useState("All");
  const [oopDiff, setOopDiff] = useState("All");
  const [oopSearch, setOopSearch] = useState("");
  const [oopPage, setOopPage] = useState(1);
  const [oopOpen, setOopOpen] = useState({});
  const [oopToast, setOopToast] = useState("");
  const OOP_PER_PAGE = 15;

  // Exceptions Logic
  const filtered = allQuestions.mcq.filter(q => {
    if (levelFilter !== "All" && q.level !== levelFilter) return false;
    if (topicFilter !== "All Topics" && q.topic !== topicFilter) return false;
    if (search && !q.q.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const quizQuestions = allQuestions.mcq.filter(q => levelFilter !== "All" ? q.level === levelFilter : true);
  const currentQuiz = quizQuestions[quizIdx];
  const stats = {
    total: allQuestions.mcq.length,
    answered: Object.keys(answered).length,
    correct: Object.values(answered).filter(a => a.correct).length
  };
  const progressPct = stats.total > 0 ? Math.round(stats.answered / stats.total * 100) : 0;
  function handleAnswer(qId, optIdx, correctIdx) {
    if (answered[qId]) return;
    setAnswered(p => ({
      ...p,
      [qId]: {
        chosen: optIdx,
        correct: optIdx === correctIdx
      }
    }));
  }
  function handleQuizAnswer(optIdx) {
    if (quizAnswered !== null) return;
    const correct = optIdx === currentQuiz.ans;
    setQuizAnswered(optIdx);
    setQuizTotal(t => t + 1);
    if (correct) setQuizScore(s => s + 1);
  }
  function nextQuiz() {
    setQuizAnswered(null);
    setQuizIdx(i => (i + 1) % quizQuestions.length);
  }
  useEffect(() => {
    setPage(1);
  }, [levelFilter, topicFilter, search]);

  // OOP Logic
  const oopFiltered = allOopQuestions.filter(item => {
    if (oopTab !== "All" && item.t !== oopTab) return false;
    if (oopDiff !== "All" && item.d !== oopDiff) return false;
    if (oopSearch && !item.q.toLowerCase().includes(oopSearch.toLowerCase())) return false;
    return true;
  });
  const oopTotalPages = Math.max(1, Math.ceil(oopFiltered.length / OOP_PER_PAGE));
  const oopPaginated = oopFiltered.slice((oopPage - 1) * OOP_PER_PAGE, oopPage * OOP_PER_PAGE);
  function toggleOopAns(idx) {
    setOopOpen(p => ({
      ...p,
      [idx]: !p[idx]
    }));
  }
  function copyOopPrompt(qText) {
    const promptText = `Please explain this Java OOP interview question in detail:\n\n"${qText}"\n\nProvide the core concepts, detailed proofs or reasoning, real-world examples, and clean Java code snippets where appropriate.`;
    navigator.clipboard.writeText(promptText).then(() => {
      setOopToast("Prompt copied! Paste it in Claude.");
      setTimeout(() => {
        setOopToast("");
      }, 3000);
    }).catch(err => {
      setOopToast("Failed to copy clipboard");
      setTimeout(() => {
        setOopToast("");
      }, 3000);
    });
  }
  useEffect(() => {
    setOopPage(1);
  }, [oopTab, oopDiff, oopSearch]);

  // PORTAL ROUTING VIEW
  if (activeModule === "portal") {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        background: "#0a0e1a",
        minHeight: "80vh",
        color: "#e2e8f0",
        borderRadius: 12,
        padding: "40px 20px"
      }
    }, /*#__PURE__*/React.createElement("style", null, `
              @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
              .portal-card {
                background: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 16px;
                padding: 28px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              .portal-card:hover {
                transform: translateY(-4px);
                border-color: rgba(139, 92, 246, 0.5);
                box-shadow: 0 10px 30px -10px rgba(139, 92, 246, 0.3);
              }
              .portal-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; height: 3px;
                background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
                opacity: 0;
                transition: opacity 0.3s;
              }
              .portal-card:hover::before {
                opacity: 1;
              }
              .portal-card-icon {
                font-size: 32px;
                margin-bottom: 16px;
                width: 56px;
                height: 56px;
                border-radius: 12px;
                background: rgba(99, 102, 241, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
              }
              .portal-card:hover .portal-card-icon {
                background: rgba(139, 92, 246, 0.2);
                transform: scale(1.05);
              }
              .responsive-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
              }
              @media(max-width: 768px) {
                .responsive-grid {
                  grid-template-columns: 1fr;
                }
              }
            `), /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1100,
        margin: "0 auto",
        textAlign: "center",
        marginBottom: 40
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 26,
        fontWeight: 700,
        background: "linear-gradient(135deg,#a5b4fc,#e879f9)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: 12,
        fontFamily: "'Space Grotesk', sans-serif"
      }
    }, "Interactive Practice Portal"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#94a3b8",
        fontSize: 13,
        maxWidth: 600,
        margin: "0 auto",
        lineHeight: 1.6
      }
    }, "Select an interactive question bank below to test your engineering expertise, review FAANG-level scenarios, and master Java core concepts.")), /*#__PURE__*/React.createElement("div", {
      className: "responsive-grid",
      style: {
        maxWidth: 1100,
        margin: "0 auto",
        paddingBottom: 40
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "portal-card",
      onClick: () => setActiveModule("exceptions")
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "portal-card-icon"
    }, "\u2615"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 18,
        fontWeight: 700,
        color: "#e2e8f0",
        marginBottom: 8,
        fontFamily: "'Space Grotesk', sans-serif"
      }
    }, "Java Exception Mastery"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#94a3b8",
        fontSize: 12,
        lineHeight: 1.6,
        marginBottom: 20
      }
    }, "Dive deep into checked & unchecked exceptions, custom hierarchies, try-catch mechanics, and advanced JVM runtime behaviors."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        padding: "4px 10px",
        borderRadius: 8,
        background: "rgba(16, 185, 129, 0.15)",
        color: "#6ee7b7",
        border: "1px solid rgba(16, 185, 129, 0.3)"
      }
    }, "230 MCQs"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        padding: "4px 10px",
        borderRadius: 8,
        background: "rgba(59, 130, 246, 0.15)",
        color: "#93c5fd",
        border: "1px solid rgba(59, 130, 246, 0.3)"
      }
    }, "20 Scenarios"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        padding: "4px 10px",
        borderRadius: 8,
        background: "rgba(168, 85, 247, 0.15)",
        color: "#d8b4fe",
        border: "1px solid rgba(168, 85, 247, 0.3)"
      }
    }, "Quiz Mode"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "#64748b"
      }
    }, "Progress: ", progressPct, "% done"), /*#__PURE__*/React.createElement("button", {
      style: {
        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
        border: "none",
        borderRadius: 8,
        padding: "8px 16px",
        color: "white",
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit"
      }
    }, "Practice Now \u2192"))), /*#__PURE__*/React.createElement("div", {
      className: "portal-card",
      onClick: () => setActiveModule("oop")
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "portal-card-icon"
    }, "\uD83C\uDFD7\uFE0F"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 18,
        fontWeight: 700,
        color: "#e2e8f0",
        marginBottom: 8,
        fontFamily: "'Space Grotesk', sans-serif"
      }
    }, "Java OOP Question Bank"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#94a3b8",
        fontSize: 12,
        lineHeight: 1.6,
        marginBottom: 20
      }
    }, "Master core object-oriented principles, design patterns, encapsulation, polymorphism, inheritance, and proof-type interview questions."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        padding: "4px 10px",
        borderRadius: 8,
        background: "rgba(249, 115, 22, 0.15)",
        color: "#fdbb74",
        border: "1px solid rgba(249, 115, 22, 0.3)"
      }
    }, "208 Questions"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        padding: "4px 10px",
        borderRadius: 8,
        background: "rgba(236, 72, 153, 0.15)",
        color: "#f9a8d4",
        border: "1px solid rgba(236, 72, 153, 0.3)"
      }
    }, "16 Proofs"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        padding: "4px 10px",
        borderRadius: 8,
        background: "rgba(99, 102, 241, 0.15)",
        color: "#c7d2fe",
        border: "1px solid rgba(99, 102, 241, 0.3)"
      }
    }, "47 Scenarios"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "#64748b"
      }
    }, "12 Core Topics"), /*#__PURE__*/React.createElement("button", {
      style: {
        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
        border: "none",
        borderRadius: 8,
        padding: "8px 16px",
        color: "white",
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit"
      }
    }, "Start Learning \u2192")))));
  }

  // OOP VIEW
  if (activeModule === "oop") {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        background: "#0a0e1a",
        minHeight: "100vh",
        color: "#e2e8f0",
        borderRadius: 12,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("style", null, `
              .oop-header { margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
              .oop-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 12px; margin-bottom: 1.5rem; }
              .oop-stat { background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 8px; padding: 10px 12px; text-align: center; }
              .oop-stat-num { font-size: 20px; font-weight: 700; color: #a5b4fc; }
              .oop-stat-label { font-size: 9px; color: #64748b; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
              
              .oop-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1.25rem; border-bottom: 1px solid rgba(99, 102, 241, 0.15); padding-bottom: 16px; }
              .oop-tab { padding: 6px 14px; border-radius: 20px; border: 0.5px solid rgba(99,102,241,0.3); font-size: 11px; cursor: pointer; background: rgba(99,102,241,0.06); color: #94a3b8; transition: all 0.2s; font-family: inherit; }
              .oop-tab:hover { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.5); }
              .oop-tab.active { background: linear-gradient(135deg,#6366f1,#8b5cf6); border-color: transparent; color: white; font-weight: 600; box-shadow: 0 0 10px rgba(99,102,241,0.3); }
              
              .oop-search-row { display: flex; gap: 8px; margin-bottom: 1rem; }
              .oop-search-row input { flex: 1; padding: 10px 14px; border-radius: 8px; border: 0.5px solid rgba(99,102,241,0.3); background: rgba(15,23,42,0.8); color: #e2e8f0; font-size: 13px; outline: none; font-family: inherit; }
              .oop-search-row input:focus { border-color: rgba(139, 92, 246, 0.6); box-shadow: 0 0 10px rgba(139, 92, 246, 0.2); }
              
              .oop-filter-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 1rem; }
              .oop-filter-btn { padding: 4px 12px; border-radius: 16px; border: 0.5px solid rgba(99,102,241,0.15); font-size: 11px; cursor: pointer; background: rgba(99,102,241,0.04); color: #64748b; transition: all 0.2s; font-family: inherit; }
              .oop-filter-btn:hover { border-color: rgba(99,102,241,0.3); color: #cbd5e1; }
              .oop-filter-btn.sel { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border-color: rgba(99, 102, 241, 0.5); }
              
              .oop-q-list { display: flex; flex-direction: column; gap: 8px; max-height: 580px; overflow-y: auto; padding-right: 4px; }
              .oop-q-card { background: rgba(15,23,42,0.7); border: 1px solid rgba(99,102,241,0.2); border-radius: 10px; padding: 14px 16px; cursor: pointer; transition: all 0.2s; }
              .oop-q-card:hover { border-color: rgba(139, 92, 246, 0.4); background: rgba(15,23,42,0.8); box-shadow: 0 4px 20px rgba(99,102,241,0.1); }
              
              .oop-q-top { display: flex; align-items: flex-start; gap: 10px; }
              .oop-q-num { font-size: 10px; color: #a5b4fc; min-width: 30px; font-weight: 700; background: rgba(99,102,241,0.15); border-radius: 4px; padding: 2px 4px; text-align: center; }
              .oop-q-text { font-size: 13px; color: #e2e8f0; line-height: 1.6; flex: 1; white-space: pre-line; }
              
              .oop-q-meta { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
              .oop-badge { font-size: 9px; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
              .oop-badge-topic { background: rgba(100,116,139,0.15); color: #94a3b8; border: 1px solid rgba(100,116,139,0.25); }
              
              .oop-badge-hard { background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); }
              .oop-badge-med { background: rgba(245, 158, 11, 0.15); color: #fde68a; border: 1px solid rgba(245, 158, 11, 0.3); }
              .oop-badge-easy { background: rgba(16, 185, 129, 0.15); color: #86efac; border: 1px solid rgba(16, 185, 129, 0.3); }
              
              .oop-badge-proof { background: rgba(99, 102, 241, 0.15); color: #c7d2fe; border: 1px solid rgba(99, 102, 241, 0.3); }
              .oop-badge-scenario { background: rgba(236, 72, 153, 0.15); color: #f9a8d4; border: 1px solid rgba(236, 72, 153, 0.3); }
              
              .oop-q-answer { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(99,102,241,0.15); font-size: 12px; color: #cbd5e1; line-height: 1.6; }
              .oop-q-answer code { background: rgba(99,102,241,0.1); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #a5b4fc; border: 1px solid rgba(99,102,241,0.15); }
              .oop-q-answer pre { background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; overflow-x: auto; margin: 8px 0; color: #e2e8f0; line-height: 1.5; border-left: 3px solid rgba(99,102,241,0.5); white-space: pre-wrap; }
              
              .oop-pagination { display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 1.5rem; padding-bottom: 2rem; }
              .oop-pg-btn { padding: 6px 14px; border-radius: 6px; border: 1px solid rgba(99,102,241,0.3); font-size: 12px; cursor: pointer; background: rgba(99,102,241,0.1); color: #a5b4fc; transition: all 0.2s; font-family: inherit; }
              .oop-pg-btn:hover:not(:disabled) { background: rgba(99,102,241,0.2); }
              .oop-pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
              .oop-pg-info { font-size: 12px; color: #64748b; }
              
              .oop-ask-btn { font-size: 11px; padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(234,179,8,0.3); background: rgba(234,179,8,0.08); color: #fbbf24; cursor: pointer; margin-top: 8px; transition: all 0.2s; font-family: inherit; font-weight: 600; }
              .oop-ask-btn:hover { background: rgba(234,179,8,0.15); border-color: rgba(234,179,8,0.5); }
              
              .toast-banner {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: rgba(16, 185, 129, 0.95);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);
                font-size: 12px;
                font-weight: 600;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              @keyframes slideIn {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1))",
        borderBottom: "1px solid rgba(99,102,241,.3)",
        padding: "24px 20px",
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1100,
        margin: "0 auto"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "oop-header",
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => setActiveModule("portal"),
      style: {
        background: "transparent",
        border: "none",
        color: "#a5b4fc",
        cursor: "pointer",
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontFamily: "inherit",
        padding: 0,
        marginBottom: 8
      }
    }, "\u2190 Back to Portal"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 22,
        fontWeight: 700,
        background: "linear-gradient(135deg,#a5b4fc,#e879f9)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        margin: 0,
        fontFamily: "'Space Grotesk', sans-serif"
      }
    }, "Java OOP Interview Question Bank"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#64748b",
        fontSize: 12,
        margin: "4px 0 0"
      }
    }, "550 questions \xB7 Click any card to reveal answer \xB7 FAANG-level"))), /*#__PURE__*/React.createElement("div", {
      className: "oop-stats"
    }, /*#__PURE__*/React.createElement("div", {
      className: "oop-stat"
    }, /*#__PURE__*/React.createElement("div", {
      className: "oop-stat-num"
    }, "500"), /*#__PURE__*/React.createElement("div", {
      className: "oop-stat-label"
    }, "Core OOP")), /*#__PURE__*/React.createElement("div", {
      className: "oop-stat"
    }, /*#__PURE__*/React.createElement("div", {
      className: "oop-stat-num"
    }, "50"), /*#__PURE__*/React.createElement("div", {
      className: "oop-stat-label"
    }, "Scenario")), /*#__PURE__*/React.createElement("div", {
      className: "oop-stat"
    }, /*#__PURE__*/React.createElement("div", {
      className: "oop-stat-num"
    }, "30"), /*#__PURE__*/React.createElement("div", {
      className: "oop-stat-label"
    }, "Proof-type")), /*#__PURE__*/React.createElement("div", {
      className: "oop-stat"
    }, /*#__PURE__*/React.createElement("div", {
      className: "oop-stat-num"
    }, "8"), /*#__PURE__*/React.createElement("div", {
      className: "oop-stat-label"
    }, "Topics"))))), /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "oop-search-row"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: oopSearch,
      onChange: e => {
        setOopSearch(e.target.value);
        setOopPage(1);
      },
      placeholder: "\uD83D\uDD0D Search OOP questions..."
    })), /*#__PURE__*/React.createElement("div", {
      className: "oop-filter-row"
    }, ["All", "easy", "med", "hard"].map(d => {
      const labels = {
        All: "All Levels",
        easy: "Easy",
        med: "Medium",
        hard: "Hard"
      };
      return /*#__PURE__*/React.createElement("button", {
        key: d,
        onClick: () => {
          setOopDiff(d);
          setOopPage(1);
        },
        className: `oop-filter-btn ${oopDiff === d ? "sel" : ""}`
      }, labels[d]);
    })), /*#__PURE__*/React.createElement("div", {
      className: "oop-tabs"
    }, OOP_TOPICS.map(t => /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: () => {
        setOopTab(t);
        setOopPage(1);
      },
      className: `oop-tab ${oopTab === t ? "active" : ""}`
    }, t))), /*#__PURE__*/React.createElement("div", {
      className: "oop-q-list"
    }, oopPaginated.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "40px",
        color: "#64748b",
        fontSize: "14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 24
      }
    }, "\uD83D\uDD0D"), "No questions found matching your search and filters.") : oopPaginated.map((item, index) => {
      const globalIdx = (oopPage - 1) * OOP_PER_PAGE + index;
      const isExpanded = !!oopOpen[globalIdx];
      const isProof = item.t === "Proof-Type";
      const isScenario = item.t === "Scenario";
      return /*#__PURE__*/React.createElement("div", {
        key: globalIdx,
        className: "oop-q-card",
        onClick: () => toggleOopAns(globalIdx)
      }, /*#__PURE__*/React.createElement("div", {
        className: "oop-q-top"
      }, /*#__PURE__*/React.createElement("span", {
        className: "oop-q-num"
      }, globalIdx + 1), /*#__PURE__*/React.createElement("span", {
        className: "oop-q-text",
        dangerouslySetInnerHTML: {
          __html: item.q.replace(/`([^`]+)`/g, "<code>$1</code>")
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: "oop-q-meta"
      }, /*#__PURE__*/React.createElement("span", {
        className: "oop-badge oop-badge-topic"
      }, item.t), /*#__PURE__*/React.createElement("span", {
        className: `oop-badge oop-badge-${item.d === "easy" ? "easy" : item.d === "med" ? "med" : "hard"}`
      }, item.d === "easy" ? "Easy" : item.d === "med" ? "Medium" : "Hard"), isProof && /*#__PURE__*/React.createElement("span", {
        className: "oop-badge oop-badge-proof"
      }, "Proof"), isScenario && /*#__PURE__*/React.createElement("span", {
        className: "oop-badge oop-badge-scenario"
      }, "Scenario"), !item.a && /*#__PURE__*/React.createElement("span", {
        className: "oop-badge",
        style: {
          background: "rgba(15,23,42,0.6)",
          color: "#64748b"
        }
      }, "tap for hint \u2197")), isExpanded && /*#__PURE__*/React.createElement("div", {
        className: "oop-q-answer",
        onClick: e => e.stopPropagation()
      }, item.a ? /*#__PURE__*/React.createElement("pre", {
        dangerouslySetInnerHTML: {
          __html: item.a.replace(/`([^`]+)`/g, "<code>$1</code>")
        }
      }) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        style: {
          margin: 0,
          color: "#94a3b8"
        }
      }, "No embedded answer. Ask our AI agent for an exhaustive, structured proof-level explanation!"), /*#__PURE__*/React.createElement("button", {
        className: "oop-ask-btn",
        onClick: () => copyOopPrompt(item.q)
      }, "Ask Claude for detailed answer \u2197"))));
    })), oopTotalPages > 1 && /*#__PURE__*/React.createElement("div", {
      className: "oop-pagination"
    }, /*#__PURE__*/React.createElement("button", {
      className: "oop-pg-btn",
      onClick: () => setOopPage(p => Math.max(1, p - 1)),
      disabled: oopPage === 1
    }, "\u2190 Prev"), /*#__PURE__*/React.createElement("span", {
      className: "oop-pg-info"
    }, "Page ", oopPage, " / ", oopTotalPages, " (", oopFiltered.length, " questions)"), /*#__PURE__*/React.createElement("button", {
      className: "oop-pg-btn",
      onClick: () => setOopPage(p => Math.min(oopTotalPages, p + 1)),
      disabled: oopPage === oopTotalPages
    }, "Next \u2192"))), oopToast && /*#__PURE__*/React.createElement("div", {
      className: "toast-banner"
    }, /*#__PURE__*/React.createElement("span", null, "\u2705"), /*#__PURE__*/React.createElement("span", null, oopToast)));
  }

  // EXCEPTIONS VIEW
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      background: "#0a0e1a",
      minHeight: "100vh",
      color: "#e2e8f0",
      borderRadius: 12,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("style", null, `
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
            ::-webkit-scrollbar{width:6px;height:6px}
            ::-webkit-scrollbar-track{background:#0a0e1a}
            ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
            .glow{box-shadow:0 0 20px rgba(99,102,241,.3)}
            .card-hover{transition:all .2s ease}
            .card-hover:hover{transform:translateY(-1px);box-shadow:0 4px 24px rgba(99,102,241,.2)}
            .option-btn{transition:all .15s ease}
            .option-btn:hover:not(:disabled){background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.6)}
            .tab-active{background:linear-gradient(135deg,#6366f1,#8b5cf6);box-shadow:0 0 16px rgba(99,102,241,.5)}
            .progress-bar{background:linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899);transition:width .5s ease}
            .badge{display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:.5px}
            .scenario-card{border:1px solid rgba(99,102,241,.25);background:rgba(99,102,241,.05);border-radius:12px;padding:20px;margin-bottom:16px;transition:all .2s}
            .scenario-card:hover{border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.08)}
            .correct-opt{background:rgba(34,197,94,.15)!important;border-color:rgba(34,197,94,.6)!important}
            .wrong-opt{background:rgba(239,68,68,.15)!important;border-color:rgba(239,68,68,.6)!important}
            .reveal-opt{background:rgba(34,197,94,.1)!important;border-color:rgba(34,197,94,.4)!important}
            
            /* Custom Tailwind Colors mapping */
            .bg-emerald-500\/20 { background-color: rgba(16, 185, 129, 0.2); }
            .text-emerald-300 { color: rgb(110, 231, 183); }
            .border-emerald-500\/40 { border-color: rgba(16, 185, 129, 0.4); }

            .bg-blue-500\/20 { background-color: rgba(59, 130, 246, 0.2); }
            .text-blue-300 { color: rgb(147, 197, 253); }
            .border-blue-500\/40 { border-color: rgba(59, 130, 246, 0.4); }

            .bg-purple-500\/20 { background-color: rgba(168, 85, 247, 0.2); }
            .text-purple-300 { color: rgb(216, 180, 254); }
            .border-purple-500\/40 { border-color: rgba(168, 85, 247, 0.4); }

            .bg-orange-500\/20 { background-color: rgba(249, 115, 22, 0.2); }
            .text-orange-300 { color: rgb(253, 186, 116); }
            .border-orange-500\/40 { border-color: rgba(249, 115, 22, 0.4); }

            .bg-red-500\/20 { background-color: rgba(239, 68, 68, 0.2); }
            .text-red-300 { color: rgb(252, 165, 165); }
            .border-red-500\/40 { border-color: rgba(239, 68, 68, 0.4); }
          `), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1))",
      borderBottom: "1px solid rgba(99,102,241,.3)",
      padding: "24px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveModule("portal"),
    style: {
      background: "transparent",
      border: "none",
      color: "#a5b4fc",
      cursor: "pointer",
      fontSize: 13,
      display: "flex",
      alignItems: "center",
      gap: 4,
      fontFamily: "inherit",
      padding: 0,
      marginBottom: 12
    }
  }, "\u2190 Back to Portal"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28
    }
  }, "\u2615"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      background: "linear-gradient(135deg,#a5b4fc,#e879f9)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      margin: 0
    }
  }, "Java Exception Mastery"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#64748b",
      fontSize: 12,
      margin: 0
    }
  }, "230 MCQs + 20 Coding Scenarios \xB7 Basics \u2192 FAANG Level"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
      marginTop: 16
    }
  }, [{
    label: "Total MCQs",
    val: stats.total,
    icon: "📋"
  }, {
    label: "Attempted",
    val: stats.answered,
    icon: "✍️"
  }, {
    label: "Correct",
    val: stats.correct,
    icon: "✅"
  }, {
    label: "Accuracy",
    val: stats.answered ? Math.round(stats.correct / stats.answered * 100) + "%" : "–",
    icon: "🎯"
  }, {
    label: "Scenarios",
    val: 20,
    icon: "💻"
  }].map(s => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    style: {
      background: "rgba(15,23,42,.6)",
      border: "1px solid rgba(99,102,241,.2)",
      borderRadius: 8,
      padding: "8px 16px",
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", null, s.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: "#a5b4fc"
    }
  }, s.val), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#64748b"
    }
  }, s.label))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#64748b"
    }
  }, "MCQ Progress"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#a5b4fc"
    }
  }, progressPct, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      background: "rgba(99,102,241,.15)",
      borderRadius: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-bar",
    style: {
      height: "100%",
      width: progressPct + "%",
      borderRadius: 2
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: "0 auto",
      padding: "0 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      padding: "16px 0 0",
      borderBottom: "1px solid rgba(99,102,241,.15)",
      marginBottom: 20
    }
  }, [{
    id: "mcq",
    label: "📋 MCQ Bank (230)",
    desc: "Multiple Choice"
  }, {
    id: "quiz",
    label: "⚡ Quiz Mode",
    desc: "Test Yourself"
  }, {
    id: "scenarios",
    label: "💻 Coding Scenarios (20)",
    desc: "FAANG Practice"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: {
      padding: "8px 18px",
      borderRadius: "8px 8px 0 0",
      border: "none",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 600,
      fontFamily: "inherit",
      background: tab === t.id ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,.08)",
      color: tab === t.id ? "white" : "#64748b",
      transition: "all .2s"
    }
  }, t.label))), tab === "mcq" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 16,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: "\uD83D\uDD0D Search questions...",
    style: {
      flex: 1,
      minWidth: 200,
      background: "rgba(15,23,42,.8)",
      border: "1px solid rgba(99,102,241,.3)",
      borderRadius: 8,
      padding: "8px 12px",
      color: "#e2e8f0",
      fontSize: 13,
      fontFamily: "inherit",
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement("select", {
    value: levelFilter,
    onChange: e => setLevelFilter(e.target.value),
    style: {
      background: "rgba(15,23,42,.8)",
      border: "1px solid rgba(99,102,241,.3)",
      borderRadius: 8,
      padding: "8px 12px",
      color: "#e2e8f0",
      fontSize: 12,
      fontFamily: "inherit",
      cursor: "pointer"
    }
  }, LEVELS.map(l => /*#__PURE__*/React.createElement("option", {
    key: l,
    value: l
  }, l))), /*#__PURE__*/React.createElement("select", {
    value: topicFilter,
    onChange: e => setTopicFilter(e.target.value),
    style: {
      background: "rgba(15,23,42,.8)",
      border: "1px solid rgba(99,102,241,.3)",
      borderRadius: 8,
      padding: "8px 12px",
      color: "#e2e8f0",
      fontSize: 12,
      fontFamily: "inherit",
      cursor: "pointer"
    }
  }, TOPICS.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t))), /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: "center",
      fontSize: 12,
      color: "#64748b"
    }
  }, filtered.length, " questions")), paginated.map((q, qi) => {
    const ans = answered[q.id];
    const lc = levelColors[q.level] || levelColors.Basics;
    return /*#__PURE__*/React.createElement("div", {
      key: q.id,
      className: "card-hover",
      style: {
        background: "rgba(15,23,42,.7)",
        border: `1px solid rgba(99,102,241,.2)`,
        borderRadius: 12,
        padding: "18px 20px",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 32,
        height: 32,
        borderRadius: 8,
        background: "rgba(99,102,241,.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        color: "#a5b4fc"
      }
    }, "#", q.id), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 8,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: `badge ${lc.bg} ${lc.text}`,
      style: {
        border: `1px solid`,
        borderColor: lc.border.replace("border-", "")
      }
    }, q.level), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "#64748b",
        padding: "2px 8px",
        background: "rgba(100,116,139,.1)",
        borderRadius: 999
      }
    }, q.topic)), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 14,
        lineHeight: 1.6,
        whiteSpace: "pre-line"
      }
    }, q.q))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, q.options.map((opt, i) => {
      let extra = "";
      if (ans) {
        if (i === q.ans) extra = "reveal-opt";
        if (ans.chosen === i && ans.chosen !== q.ans) extra = "wrong-opt";
        if (ans.chosen === i && ans.correct) extra = "correct-opt";
      }
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        onClick: () => handleAnswer(q.id, i, q.ans),
        disabled: !!ans,
        className: `option-btn ${extra}`,
        style: {
          background: "rgba(99,102,241,.06)",
          border: "1px solid rgba(99,102,241,.2)",
          borderRadius: 8,
          padding: "8px 12px",
          color: "#cbd5e1",
          fontSize: 12,
          fontFamily: "inherit",
          cursor: ans ? "default" : "pointer",
          textAlign: "left",
          display: "flex",
          gap: 8,
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: "#6366f1",
          fontWeight: 700,
          minWidth: 16
        }
      }, String.fromCharCode(65 + i), "."), opt, ans && i === q.ans && /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: "auto",
          color: "#22c55e"
        }
      }, "\u2713"), ans && ans.chosen === i && i !== q.ans && /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: "auto",
          color: "#ef4444"
        }
      }, "\u2717"));
    })), ans && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        padding: "8px 12px",
        borderRadius: 8,
        background: ans.correct ? "rgba(34,197,94,.08)" : "rgba(239,68,68,.08)",
        border: `1px solid ${ans.correct ? "rgba(34,197,94,.3)" : "rgba(239,68,68,.3)"}`,
        fontSize: 12,
        color: ans.correct ? "#86efac" : "#fca5a5"
      }
    }, ans.correct ? "✅ Correct!" : `❌ Incorrect. Correct answer: ${q.options[q.ans]}`));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      justifyContent: "center",
      padding: "20px 0 32px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage(p => Math.max(1, p - 1)),
    disabled: page === 1,
    style: {
      padding: "6px 14px",
      borderRadius: 6,
      border: "1px solid rgba(99,102,241,.3)",
      background: "rgba(99,102,241,.1)",
      color: "#a5b4fc",
      cursor: page === 1 ? "not-allowed" : "pointer",
      opacity: page === 1 ? 0.4 : 1,
      fontSize: 12,
      fontFamily: "inherit"
    }
  }, "\u2190 Prev"), Array.from({
    length: Math.min(7, totalPages)
  }, (_, i) => {
    const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
    return /*#__PURE__*/React.createElement("button", {
      key: p,
      onClick: () => setPage(p),
      style: {
        padding: "6px 12px",
        borderRadius: 6,
        border: "1px solid rgba(99,102,241,.3)",
        background: page === p ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,.1)",
        color: page === p ? "white" : "#a5b4fc",
        cursor: "pointer",
        fontSize: 12,
        fontFamily: "inherit"
      }
    }, p);
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage(p => Math.min(totalPages, p + 1)),
    disabled: page === totalPages,
    style: {
      padding: "6px 14px",
      borderRadius: 6,
      border: "1px solid rgba(99,102,241,.3)",
      background: "rgba(99,102,241,.1)",
      color: "#a5b4fc",
      cursor: page === totalPages ? "not-allowed" : "pointer",
      opacity: page === totalPages ? 0.4 : 1,
      fontSize: 12,
      fontFamily: "inherit"
    }
  }, "Next \u2192"))), tab === "quiz" && currentQuiz && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 700,
      margin: "0 auto",
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      marginBottom: 20,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: levelFilter,
    onChange: e => {
      setLevelFilter(e.target.value);
      setQuizIdx(0);
      setQuizAnswered(null);
    },
    style: {
      background: "rgba(15,23,42,.8)",
      border: "1px solid rgba(99,102,241,.3)",
      borderRadius: 8,
      padding: "8px 12px",
      color: "#e2e8f0",
      fontSize: 12,
      fontFamily: "inherit"
    }
  }, LEVELS.map(l => /*#__PURE__*/React.createElement("option", {
    key: l,
    value: l
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: "right",
      fontSize: 13,
      color: "#64748b",
      alignSelf: "center"
    }
  }, "Score: ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#22c55e",
      fontWeight: 700
    }
  }, quizScore), " / ", quizTotal, quizTotal > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#a5b4fc",
      marginLeft: 8
    }
  }, "(", Math.round(quizScore / quizTotal * 100), "%)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 4,
      fontSize: 11,
      color: "#64748b"
    }
  }, "Question ", quizIdx + 1, " of ", quizQuestions.length), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 3,
      background: "rgba(99,102,241,.15)",
      borderRadius: 2,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: (quizIdx + 1) / quizQuestions.length * 100 + "%",
      background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
      borderRadius: 2,
      transition: "width .3s"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(15,23,42,.8)",
      border: "1px solid rgba(99,102,241,.3)",
      borderRadius: 16,
      padding: 28,
      glow: true
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `badge ${(levelColors[currentQuiz.level] || levelColors.Basics).bg} ${(levelColors[currentQuiz.level] || levelColors.Basics).text}`
  }, currentQuiz.level), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#64748b",
      padding: "2px 8px",
      background: "rgba(100,116,139,.1)",
      borderRadius: 999
    }
  }, currentQuiz.topic)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      marginBottom: 20,
      whiteSpace: "pre-line"
    }
  }, currentQuiz.q), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, currentQuiz.options.map((opt, i) => {
    let extra = "";
    if (quizAnswered !== null) {
      if (i === currentQuiz.ans) extra = "reveal-opt";
      if (quizAnswered === i && i !== currentQuiz.ans) extra = "wrong-opt";
      if (quizAnswered === i && i === currentQuiz.ans) extra = "correct-opt";
    }
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => handleQuizAnswer(i),
      disabled: quizAnswered !== null,
      className: `option-btn ${extra}`,
      style: {
        background: "rgba(99,102,241,.06)",
        border: "1px solid rgba(99,102,241,.2)",
        borderRadius: 10,
        padding: "12px 16px",
        color: "#cbd5e1",
        fontSize: 13,
        fontFamily: "inherit",
        cursor: quizAnswered !== null ? "default" : "pointer",
        textAlign: "left",
        display: "flex",
        gap: 12,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 24,
        height: 24,
        borderRadius: 6,
        background: "rgba(99,102,241,.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
        color: "#a5b4fc",
        flexShrink: 0
      }
    }, String.fromCharCode(65 + i)), opt, quizAnswered !== null && i === currentQuiz.ans && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "auto",
        color: "#22c55e",
        fontSize: 16
      }
    }, "\u2713"), quizAnswered !== null && quizAnswered === i && i !== currentQuiz.ans && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "auto",
        color: "#ef4444",
        fontSize: 16
      }
    }, "\u2717"));
  })), quizAnswered !== null && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      borderRadius: 8,
      background: quizAnswered === currentQuiz.ans ? "rgba(34,197,94,.08)" : "rgba(239,68,68,.08)",
      border: `1px solid ${quizAnswered === currentQuiz.ans ? "rgba(34,197,94,.3)" : "rgba(239,68,68,.3)"}`,
      fontSize: 13,
      color: quizAnswered === currentQuiz.ans ? "#86efac" : "#fca5a5",
      marginBottom: 12
    }
  }, quizAnswered === currentQuiz.ans ? "🎉 Correct!" : `💡 Correct: ${currentQuiz.options[currentQuiz.ans]}`), /*#__PURE__*/React.createElement("button", {
    onClick: nextQuiz,
    style: {
      width: "100%",
      padding: "12px",
      borderRadius: 10,
      border: "none",
      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
      color: "white",
      fontSize: 14,
      fontWeight: 600,
      fontFamily: "inherit",
      cursor: "pointer"
    }
  }, "Next Question \u2192")))), tab === "scenarios" && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(99,102,241,.08)",
      border: "1px solid rgba(99,102,241,.2)",
      borderRadius: 12,
      padding: "14px 18px",
      marginBottom: 20,
      fontSize: 13,
      color: "#94a3b8"
    }
  }, "\uD83D\uDCA1 ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "#a5b4fc"
    }
  }, "20 Real-World Coding Scenarios"), " \u2014 ranging from beginner file handling to FAANG-level distributed system design. Code each on your machine before revealing hints."), allQuestions.scenarios.map(s => {
    const lc = levelColors[s.level] || levelColors.Basics;
    const hint = showHints[s.id];
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      className: "scenario-card"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 40,
        height: 40,
        borderRadius: 10,
        background: "rgba(99,102,241,.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        color: "#a5b4fc"
      }
    }, s.id), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        fontSize: 15,
        fontWeight: 700,
        color: "#e2e8f0"
      }
    }, s.title), /*#__PURE__*/React.createElement("span", {
      className: `badge ${lc.bg} ${lc.text}`
    }, s.level)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        flexWrap: "wrap"
      }
    }, s.tags.map(tag => /*#__PURE__*/React.createElement("span", {
      key: tag,
      style: {
        fontSize: 10,
        padding: "2px 8px",
        borderRadius: 999,
        background: "rgba(99,102,241,.1)",
        border: "1px solid rgba(99,102,241,.2)",
        color: "#818cf8"
      }
    }, tag))))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(0,0,0,.3)",
        borderRadius: 8,
        padding: "14px 16px",
        marginBottom: 12,
        fontSize: 13,
        lineHeight: 1.7,
        color: "#cbd5e1",
        borderLeft: "3px solid rgba(99,102,241,.5)"
      }
    }, s.desc), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowHints(p => ({
        ...p,
        [s.id]: !p[s.id]
      })),
      style: {
        padding: "7px 16px",
        borderRadius: 8,
        border: "1px solid rgba(234,179,8,.3)",
        background: "rgba(234,179,8,.08)",
        color: "#fbbf24",
        fontSize: 12,
        fontFamily: "inherit",
        cursor: "pointer",
        fontWeight: 600
      }
    }, hint ? "🙈 Hide Hint" : "💡 Show Hint")), hint && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        background: "rgba(234,179,8,.05)",
        border: "1px solid rgba(234,179,8,.2)",
        borderRadius: 8,
        padding: "12px 16px",
        fontSize: 12,
        color: "#fde68a",
        lineHeight: 1.7
      }
    }, /*#__PURE__*/React.createElement("strong", null, "\uD83D\uDCA1 Hint:"), " ", s.hint));
  }))));
}
const root = ReactDOM.createRoot(document.getElementById('praction-root'));
root.render(/*#__PURE__*/React.createElement(App, null));
