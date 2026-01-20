import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startSession, submitChoice, mapApiChoicesToNodes } from "../../../../../apis/interactiveStoriesApi";
import { AlertToast } from "../../../../components/myui/AlertToast";
import SceneText from "../../../../components/myui/Users/ReaderPages/interactiveDashboard/sceneText";
import Nodes from "../../../../components/myui/Users/ReaderPages/interactiveDashboard/nodes";
import ImageScenes from "../../../../components/myui/Users/ReaderPages/interactiveDashboard/imageScenes";
import Loaders from "../../../../components/myui/Users/ReaderPages/interactiveDashboard/loaders";
import ImagePreviewModal from "../../../../components/myui/Users/ReaderPages/interactiveDashboard/imagepreviewmodal";
import SceneNavigator from "../../../../components/myui/Users/ReaderPages/interactiveDashboard/sceneNavigator";
import StoryLine from "../../../../components/myui/Users/ReaderPages/interactiveDashboard/storyline";

// ============================================================
// MAIN COMPONENT
// ============================================================
function InteractiveDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const storyId = location.state?.storyId;

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [generatingScene, setGeneratingScene] = useState(false);
  const [currentScene, setCurrentScene] = useState(null);
  const [sceneHistory, setSceneHistory] = useState([]);
  const [error, setError] = useState(null);
  const [storyMetadata, setStoryMetadata] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const requestIdRef = useRef(0);
  const sceneSelectorRef = useRef(null);

  // Scroll active scene into view
  useEffect(() => {
    if (sceneSelectorRef.current) {
      const activeButton = sceneSelectorRef.current.querySelector(
        '[data-active="true"]',
      );
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentScene?.sceneId]);

  const fetchInitialScene = useCallback(async () => {
    if (!storyId) {
      setError("لم يتم تحديد القصة");
      setLoading(false);
      return;
    }

    const reqId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await startSession(storyId);

      if (reqId !== requestIdRef.current) return;

      const data = response?.data;

      if (data) {
        // Use the centralized helper to map A, B, C, D choices to UI nodes
        const nodes = mapApiChoicesToNodes(data);

        const scene = {
          sceneId: `turn_${data.turnIndex}`,
          sceneNumber: data.turnIndex,
          sceneText: data.sceneText,
          sceneImage: data.imageUrl || "", // Keeping imageUrl if provided by API
          nodes: nodes,
        };

        // We need a sessionId for the next /choose call. 
        // If the API returns it in data, use it; otherwise fallback to storyId or check response structure.
        const activeSessionId = data.sessionId || data.id || storyId;
        setSessionId(activeSessionId);
        
        setCurrentScene(scene);
        setSceneHistory([scene]);
        
        // If story metadata is available in the response, set it
        if (data.story) setStoryMetadata(data.story);
      } else {
        throw new Error("Invalid response from session start");
      }
    } catch (err) {
      console.error("API failed:", err);
      if (reqId !== requestIdRef.current) return;
      setError(err.message || "فشل بدء الجلسة. يرجى المحاولة مرة أخرى.");
    } finally {
      if (reqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [storyId]);

  const generateNextScene = useCallback(
    async (chosenNode) => {
      if (!sessionId) {
        console.error("No active sessionId found");
        return;
      }

      const reqId = ++requestIdRef.current;
      setGeneratingScene(true);
      setError(null);

      try {
        const response = await submitChoice(sessionId, chosenNode.nodeId);

        if (reqId !== requestIdRef.current) return;

        const data = response?.data;

        if (data) {
          const nodes = mapApiChoicesToNodes(data);

          const nextScene = {
            sceneId: `turn_${data.turnIndex}`,
            sceneNumber: data.turnIndex,
            sceneText: data.sceneText,
            sceneImage: data.imageUrl || "",
            nodes: nodes,
            chosenNodeId: chosenNode.nodeId,
          };

          setCurrentScene(nextScene);
          setSceneHistory((prev) => [...prev, nextScene]);
        } else {
          throw new Error("Invalid next scene data");
        }
      } catch (err) {
        console.error("API failed:", err);
        if (reqId !== requestIdRef.current) return;
        setError(err.message || "فشل توليد المشهد التالي. يرجى المحاولة مرة أخرى.");
      } finally {
        if (reqId === requestIdRef.current) {
          setGeneratingScene(false);
        }
      }
    },
    [sessionId],
  );

  const handleNodeClick = (node) => {
    if (generatingScene) return;
    generateNextScene(node);
  };

  const handleGoToScene = (sceneIndex) => {
    if (sceneIndex >= 0 && sceneIndex < sceneHistory.length) {
      setCurrentScene(sceneHistory[sceneIndex]);
    }
  };

  const handleRestart = () => {
    setShowRestartConfirm(true);
  };

  const handleConfirmRestart = () => {
    setCurrentScene(sceneHistory[0]);
    setSceneHistory([sceneHistory[0]]);
    setShowRestartConfirm(false);
  };

  const handleCancelRestart = () => {
    setShowRestartConfirm(false);
  };

  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    navigate(-1);
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  useEffect(() => {
    fetchInitialScene();
  }, [fetchInitialScene]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--earth-cream)] via-white to-[var(--earth-paper)] flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center border border-[var(--earth-sand)]">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[var(--earth-brown-dark)] mb-2">
            حدث خطأ
          </h2>
          <p className="text-[var(--earth-brown)] mb-6">{error}</p>
          <button
            onClick={handleConfirmExit}
            className="px-6 py-3 bg-[var(--earth-olive)] hover:bg-[var(--earth-olive-dark)] rounded-xl text-white font-medium transition-all"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen h-[100dvh] relative flex flex-col lg:overflow-hidden transition-colors duration-700 ${isDarkMode ? "bg-[#0c0c0c] text-white/90" : "bg-[#F8F5F2] text-[var(--earth-brown-dark)]"}`}>
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {isDarkMode ? (
          <>
            <div className="absolute inset-0 bg-[#0c0c0c]" />
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#5d4037]/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#2e3a23]/20 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
            <div className="absolute inset-0 opacity-[0.03] blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-[var(--earth-olive)]/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[var(--earth-brown)]/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2" />
            <div className="absolute inset-0 opacity-[0.03] blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? "rgba(255, 255, 255, 0.15)" : "var(--earth-sand)"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--earth-olive);
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .glass-panel {
          background: ${isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.6)"};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.5)"};
          box-shadow: ${isDarkMode ? "0 20px 50px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.05)"};
        }
      `}} />

      {loading ? (
        <Loaders type="initial" />
      ) : (
        <div className="relative z-10 flex flex-col h-full overflow-y-auto lg:overflow-hidden">
          {/* Header - Enhanced Premium AppBar */}
          <div className={`flex items-center px-4 md:px-8 py-3 md:py-4 border-b transition-all duration-500 ${isDarkMode ? "border-white/5 bg-black/20" : "border-[var(--earth-sand)]/20 bg-white/60"} backdrop-blur-xl flex-shrink-0 relative z-50 shadow-xl`}>
            
            {/* Left side: Back & Theme Toggle */}
            <div className="flex-1 flex justify-start items-center gap-3 md:gap-6">
              <button
                onClick={handleExitClick}
                className={`group p-2 md:p-4 transition-all duration-300 rounded-xl md:rounded-2xl border flex items-center justify-center ${
                  isDarkMode 
                    ? "bg-white/5 hover:bg-white/10 text-white/70 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)]" 
                    : "bg-white/80 hover:bg-[var(--earth-olive)] hover:text-white border-[var(--earth-sand)]/50 text-[var(--earth-brown)] shadow-sm"
                }`}
                title="الخروج"
              >
                <svg className="w-5 h-5 md:w-7 md:h-7 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-500 flex items-center justify-center ${
                  isDarkMode 
                    ? "bg-white/5 border-white/10 text-white hover:bg-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)]" 
                    : "bg-white/80 border-[var(--earth-sand)]/50 text-black hover:bg-white shadow-sm"
                }`}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
                ) : (
                  <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                )}
              </button>
            </div>

            {/* Center: Story Title */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none max-w-[40%] sm:max-w-[50%]">
              {storyMetadata && (
                <div className="space-y-0.5 md:space-y-1">
                  <span className="text-[8px] md:text-xs font-bold text-[var(--earth-olive)] uppercase tracking-[0.2em] opacity-80">مغامرة تفاعلية</span>
                  <h1 className={`text-xs md:text-2xl font-extrabold truncate transition-colors duration-500 ${isDarkMode ? "text-white" : "text-[var(--earth-brown-dark)]"}`}>
                    {storyMetadata.title}
                  </h1>
                </div>
              )}
            </div>

            {/* Right side: Restart Button */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleRestart}
                className={`group px-3 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-base font-bold transition-all duration-300 border flex items-center gap-2 md:gap-4 ${
                  isDarkMode 
                    ? "bg-white/5 hover:bg-white/10 text-white/80 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)]" 
                    : "bg-white/80 hover:bg-[var(--earth-cream)] border-[var(--earth-sand)]/50 text-[var(--earth-brown-dark)] shadow-sm"
                }`}
              >
                <span className="hidden sm:inline opacity-80 group-hover:opacity-100 transition-opacity">إعادة بدء المغامرة</span>
                <span className="sm:hidden">إعادة</span>
                <div className={`p-1 md:p-1.5 rounded-lg md:rounded-xl transition-all duration-300 ${isDarkMode ? "bg-white/5 group-hover:bg-[var(--earth-olive)]" : "bg-[var(--earth-sand)]/20 group-hover:bg-[var(--earth-olive)] group-hover:text-white"}`}>
                  <svg className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-500 group-hover:rotate-[360deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full overflow-y-auto lg:overflow-hidden py-4 md:py-10 px-4 md:px-16">
            <div className="max-w-[1600px] mx-auto h-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 h-full items-stretch">
                
                {/* Left/Top: Visual Context */}
                <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-10 min-h-0 order-first">
                  {/* Scene Navigation - Mobile Only (Above Image) */}
                  <SceneNavigator
                    type="mobile"
                    sceneHistory={sceneHistory}
                    currentScene={currentScene}
                    handleGoToScene={handleGoToScene}
                    isDarkMode={isDarkMode}
                    sceneSelectorRef={sceneSelectorRef}
                  />

                  <div className="flex-1 flex flex-col gap-4 lg:gap-8 min-h-0">
                    <div className="lg:flex-[5.5] aspect-video lg:aspect-auto min-h-0 shadow-[0_20px_40px_rgba(0,0,0,0.3)] lg:shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-2xl lg:rounded-[2.5rem] overflow-hidden border border-white/10">
                      <ImageScenes
                        image={currentScene.sceneImage}
                        sceneNumber={currentScene.sceneNumber}
                        onImageClick={(img) => setPreviewImage(img)}
                      />
                    </div>
                    
                    {/* Scene Navigation - Desktop Only */}
                    <SceneNavigator
                      type="desktop"
                      sceneHistory={sceneHistory}
                      currentScene={currentScene}
                      handleGoToScene={handleGoToScene}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                  
                  {/* Story Progress */}
                  <StoryLine
                    currentScene={currentScene}
                    storyMetadata={storyMetadata}
                    isDarkMode={isDarkMode}
                  />
                </div>

                {/* Right/Bottom: Narrative & Choices */}
                <div className="lg:col-span-7 flex flex-col gap-6 lg:gap-12 min-h-0">
                  <div className="lg:flex-1 min-h-[300px] lg:min-h-0 glass-panel rounded-2xl lg:rounded-[3rem] p-6 lg:p-16 flex flex-col relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)] lg:shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/10">
                    {generatingScene ? (
                      <div className="p-4 lg:p-0"><Loaders type="text" /></div>
                    ) : (
                      <div className="flex-1 flex flex-col justify-center">
                         <SceneText
                          text={currentScene.sceneText}
                          sceneNumber={currentScene.sceneNumber}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    )}
                  </div>

                  <div className="lg:flex-1 min-h-0 flex flex-col">
                    {generatingScene ? (
                      <div className="glass-panel rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 flex-1 border border-white/10">
                        <Loaders type="generating" />
                      </div>
                    ) : (
                      <div className="flex-1 lg:overflow-hidden pb-4 lg:pb-6 px-1 lg:px-2">
                        {(() => {
                          const currentIndex = sceneHistory.findIndex(
                            (s) => s.sceneId === currentScene?.sceneId,
                          );
                          const nextSceneInHistory = sceneHistory[currentIndex + 1];
                          const chosenNodeId = nextSceneInHistory?.chosenNodeId;

                          return (
                            <Nodes
                              nodes={currentScene.nodes}
                              onNodeClick={handleNodeClick}
                              disabled={generatingScene || !!chosenNodeId}
                              chosenNodeId={chosenNodeId}
                              isDarkMode={isDarkMode}
                            />
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      <ImagePreviewModal 
        isOpen={!!previewImage}
        image={previewImage}
        sceneNumber={currentScene?.sceneNumber || 0}
        onClose={() => setPreviewImage(null)}
      />

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass rounded-[2rem] p-8 md:p-10 max-w-[420px] w-full border border-white/40 shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--earth-olive)]/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-[var(--earth-olive)]/5">
                <svg className="w-10 h-10 text-[var(--earth-olive)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-[var(--earth-brown-dark)] text-xl md:text-2xl font-bold mb-3">
                هل تريد الخروج؟
              </h3>
              <p className="text-[var(--earth-brown)] text-sm md:text-base mb-8 leading-relaxed">
                سيتم حفظ تقدمك الحالي، ويمكنك العودة لإكمال مغامرتك في أي وقت
                لاحق.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCancelExit}
                  className="flex-1 px-6 py-3.5 bg-white/60 hover:bg-white text-[var(--earth-brown-dark)] rounded-2xl text-sm font-bold transition-all border border-[var(--earth-sand)]/50 shadow-sm"
                >
                  البقاء في القصة
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="flex-1 px-6 py-3.5 bg-[var(--earth-olive)] hover:bg-[var(--earth-olive-dark)] text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-[var(--earth-olive)]/20"
                >
                  تأكيد الخروج
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restart Confirmation Dialog */}
      {showRestartConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass rounded-[2rem] p-8 md:p-10 max-w-[420px] w-full border border-white/40 shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#BC6C25]/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-[#BC6C25]/5">
                <svg className="w-10 h-10 text-[#BC6C25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-[var(--earth-brown-dark)] text-xl md:text-2xl font-bold mb-3">
                إعادة بدء المغامرة؟
              </h3>
              <p className="text-[var(--earth-brown)] text-sm md:text-base mb-8 leading-relaxed">
                هل أنت متأكد؟ سيؤدي هذا إلى مسح تقدمك الحالي والبدء من المشهد
                الأول.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCancelRestart}
                  className="flex-1 px-6 py-3.5 bg-white/60 hover:bg-white text-[var(--earth-brown-dark)] rounded-2xl text-sm font-bold transition-all border border-[var(--earth-sand)]/50 shadow-sm"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleConfirmRestart}
                  className="flex-1 px-6 py-3.5 bg-[#BC6C25] hover:bg-[#a05a1e] text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-[#BC6C25]/20"
                >
                  تأكيد الإعادة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InteractiveDashboard;
