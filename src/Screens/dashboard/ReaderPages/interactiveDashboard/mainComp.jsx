import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getHelper, postHelper } from "../../../../../apis/apiHelpers";
import SceneText from "../../../../components/myui/Users/ReaderPages/interactiveDashboard/sceneText";
import Nodes from "../../../../components/myui/Users/ReaderPages/interactiveDashboard/nodes";
import ImageScenes from "../../../../components/myui/Users/ReaderPages/interactiveDashboard/imageScenes";
import Loaders from "../../../../components/myui/Users/ReaderPages/interactiveDashboard/loaders";

// ============================================================
// FAKE FALLBACK DATA (for development/testing)
// ============================================================
const FAKE_INITIAL_SCENE = {
  sceneId: "scene_0",
  sceneNumber: 0,
  sceneText: "أنت تقف عند مفترق طرق في غابة قديمة. الظلام يحيط بك من كل جانب، وأصوات غريبة تتردد في الأرجاء. أمامك أربعة مسارات مختلفة، كل واحد يبدو أنه يقود إلى مصير مختلف تماماً.",
  sceneImage: "https://picsum.photos/1200/600?random=1",
  nodes: [
    {
      nodeId: "node_1",
      nodeText: "المسار الشمالي - الممر المضاء",
      nodeDescription: "طريق واضح تحت ضوء القمر"
    },
    {
      nodeId: "node_2", 
      nodeText: "المسار الشرقي - الكهف المظلم",
      nodeDescription: "كهف عميق مظلم ومخيف"
    },
    {
      nodeId: "node_3",
      nodeText: "المسار الجنوبي - الجسر القديم",
      nodeDescription: "جسر متهالك يبدو خطيراً"
    },
    {
      nodeId: "node_4",
      nodeText: "المسار الغربي - البوابة الحجرية",
      nodeDescription: "بوابة ضخمة برموز غريبة"
    }
  ]
};

const generateFakeNextScene = (chosenNode, sceneNumber) => {
  const scenarios = [
    {
      sceneText: "لقد اخترت طريقاً جديداً. أمامك الآن تحديات جديدة ومفاجآت غير متوقعة. الضباب يبدأ بالتكاثف حولك.",
      image: `https://picsum.photos/1200/600?random=${sceneNumber + 10}`
    },
    {
      sceneText: "الطريق الذي اخترته يقودك إلى مكان ساحر. الأشجار هنا تتوهج بضوء خافت والهواء مليء برائحة الزهور.",
      image: `https://picsum.photos/1200/600?random=${sceneNumber + 20}`
    },
    {
      sceneText: "أنت الآن في قلب المغامرة. الأصوات من حولك تزداد وضوحاً وتبدأ في فهم أن اختياراتك لها عواقب.",
      image: `https://picsum.photos/1200/600?random=${sceneNumber + 30}`
    },
    {
      sceneText: "المشهد يتغير بشكل جذري. أنت في مكان لم تتخيله من قبل. خياراتك ستحدد مصيرك النهائي.",
      image: `https://picsum.photos/1200/600?random=${sceneNumber + 40}`
    }
  ];

  const scenario = scenarios[sceneNumber % scenarios.length];

  return {
    sceneId: `scene_${sceneNumber}`,
    sceneNumber: sceneNumber,
    sceneText: scenario.sceneText,
    sceneImage: scenario.image,
    chosenNodeId: chosenNode.nodeId,
    nodes: [
      {
        nodeId: `node_${sceneNumber}_1`,
        nodeText: "استكشف المحيط بحذر",
        nodeDescription: "انظر حولك بتمعن"
      },
      {
        nodeId: `node_${sceneNumber}_2`,
        nodeText: "تقدم بجرأة",
        nodeDescription: "استمر بثقة"
      },
      {
        nodeId: `node_${sceneNumber}_3`,
        nodeText: "ابحث عن مخرج",
        nodeDescription: "حاول العودة"
      },
      {
        nodeId: `node_${sceneNumber}_4`,
        nodeText: "انتظر وراقب",
        nodeDescription: "راقب بصبر"
      }
    ]
  };
};

// ============================================================
// MAIN COMPONENT
// ============================================================
function InteractiveDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const storyId = location.state?.storyId;

  const [loading, setLoading] = useState(true);
  const [generatingScene, setGeneratingScene] = useState(false);
  const [currentScene, setCurrentScene] = useState(null);
  const [sceneHistory, setSceneHistory] = useState([]);
  const [error, setError] = useState(null);
  const [storyMetadata, setStoryMetadata] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const requestIdRef = useRef(0);
  const sceneSelectorRef = useRef(null);

  // Scroll active scene into view
  useEffect(() => {
    if (sceneSelectorRef.current) {
      const activeButton = sceneSelectorRef.current.querySelector('[data-active="true"]');
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
      const response = await getHelper({
        url: `${import.meta.env.VITE_API_URL}/interactive-stories/${storyId}/start`,
      });

      if (reqId !== requestIdRef.current) return;

      const data = response?.data ?? response;
      const scene = data?.scene ?? data?.initialScene ?? data;
      const metadata = data?.story ?? data?.metadata;

      if (scene && scene.sceneText && scene.nodes) {
        setCurrentScene(scene);
        setSceneHistory([scene]);
        setStoryMetadata(metadata);
      } else {
        throw new Error("Invalid scene data structure");
      }
    } catch (err) {
      console.warn("API failed, using fallback data:", err);
      if (reqId !== requestIdRef.current) return;
      
      setCurrentScene(FAKE_INITIAL_SCENE);
      setSceneHistory([FAKE_INITIAL_SCENE]);
      setStoryMetadata({
        title: "مغامرة الغابة الغامضة",
        genre: "Fantasy",
        totalScenes: "∞"
      });
    } finally {
      if (reqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [storyId]);

  const generateNextScene = useCallback(async (chosenNode) => {
    const reqId = ++requestIdRef.current;
    setGeneratingScene(true);
    setError(null);

    try {
      const response = await postHelper({
        url: `${import.meta.env.VITE_API_URL}/interactive-stories/${storyId}/next-scene`,
        body: {
          currentSceneId: currentScene.sceneId,
          chosenNodeId: chosenNode.nodeId,
          sceneNumber: currentScene.sceneNumber + 1
        }
      });

      if (reqId !== requestIdRef.current) return;

      const data = response?.data ?? response;
      const nextScene = data?.scene ?? data?.nextScene ?? data;

      if (nextScene && nextScene.sceneText && nextScene.nodes) {
        setCurrentScene(nextScene);
        setSceneHistory(prev => [...prev, nextScene]);
      } else {
        throw new Error("Invalid next scene data");
      }
    } catch (err) {
      console.warn("API failed, using fake generated scene:", err);
      if (reqId !== requestIdRef.current) return;

      const fakeScene = generateFakeNextScene(chosenNode, sceneHistory.length);
      setCurrentScene(fakeScene);
      setSceneHistory(prev => [...prev, fakeScene]);
    } finally {
      if (reqId === requestIdRef.current) {
        setGeneratingScene(false);
      }
    }
  }, [storyId, currentScene, sceneHistory.length]);

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
          <h2 className="text-2xl font-bold text-[var(--earth-brown-dark)] mb-2">حدث خطأ</h2>
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
    <div className="h-screen h-[100dvh] bg-gradient-to-br from-[var(--earth-cream)] via-white to-[var(--earth-paper)] relative overflow-hidden flex flex-col">
      {/* Background decorative elements - Enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--earth-olive)]/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-[var(--earth-brown)]/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-[var(--earth-sand)]/20 rounded-full blur-[80px] animate-pulse delay-500" />
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235d4037' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
        />
      </div>

      {loading ? (
        <Loaders type="initial" />
      ) : (
        <div className="relative z-10 flex flex-col h-full">
          {/* Header - Super Compact & Responsive */}
          <div className="flex justify-between items-center px-2 md:px-4 py-2 border-b border-[var(--earth-sand)]/20 bg-white/40 backdrop-blur-md flex-shrink-0">
            {/* Max Left: Reload (Restart) */}
            <button
              onClick={handleRestart}
              className="p-1 md:p-1.5 bg-white/80 hover:bg-[var(--earth-cream)] backdrop-blur-sm rounded-lg text-[var(--earth-brown)] text-[9px] md:text-[10px] font-bold transition-all border border-[var(--earth-sand)]/50 flex-shrink-0"
            >
              🔄 <span className="hidden xs:inline">إعادة</span>
            </button>

            {/* Compact Scene Selector - Scrollable, Centered, and Width Limited */}
            {sceneHistory.length > 1 ? (
              <div className="flex-1 flex justify-center px-2 overflow-hidden">
                <div 
                  ref={sceneSelectorRef}
                  className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth px-2 py-1 snap-x max-w-[140px] md:max-w-[320px]" 
                  dir="rtl"
                >
                  {sceneHistory.map((scene, index) => (
                    <button
                      key={scene.sceneId}
                      data-active={currentScene.sceneId === scene.sceneId}
                      onClick={() => handleGoToScene(index)}
                      className={`w-6 h-6 md:w-7 md:h-7 flex-shrink-0 rounded-full text-[10px] md:text-[11px] font-bold transition-all snap-center ${
                        currentScene.sceneId === scene.sceneId
                          ? "bg-[var(--earth-olive)] text-white shadow-md scale-110"
                          : "bg-white/60 text-[var(--earth-brown)] border border-[var(--earth-sand)]/50 hover:bg-white/80"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Max Right: Back button then Title */}
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 flex-row-reverse">
              <button
                onClick={handleExitClick}
                className="p-1.5 bg-white/80 hover:bg-[var(--earth-cream)] backdrop-blur-sm rounded-lg text-[var(--earth-brown)] transition-all border border-[var(--earth-sand)]/50"
                title="الخروج"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              {storyMetadata && (
                <div className="text-[var(--earth-brown-dark)] max-w-[80px] sm:max-w-[120px] md:max-w-[200px] text-right">
                  <h1 className="text-[10px] md:text-sm font-bold truncate">{storyMetadata.title}</h1>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area - Full height control */}
          <div className="flex-1 overflow-hidden flex flex-col p-2 md:p-4 gap-2 md:gap-3">
            <div className="container mx-auto max-w-4xl flex flex-col h-full gap-2 md:gap-3">
              {/* Image Section */}
              <ImageScenes 
                image={currentScene.sceneImage} 
                sceneNumber={currentScene.sceneNumber}
              />

              {/* Text Section */}
              <SceneText 
                text={currentScene.sceneText}
                sceneNumber={currentScene.sceneNumber}
              />

              {/* Action Section - Takes remaining space */}
              <div className="flex-1 min-h-0">
                {generatingScene ? (
                  <Loaders type="generating" />
                ) : (
                  <Nodes 
                    nodes={currentScene.nodes}
                    onNodeClick={handleNodeClick}
                    disabled={generatingScene}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass rounded-[2rem] p-8 md:p-10 max-w-[420px] w-full border border-white/40 shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--earth-olive)]/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-[var(--earth-olive)]/5">
                <span className="text-4xl">🚪</span>
              </div>
              <h3 className="text-[var(--earth-brown-dark)] text-xl md:text-2xl font-bold mb-3">
                هل تريد الخروج؟
              </h3>
              <p className="text-[var(--earth-brown)] text-sm md:text-base mb-8 leading-relaxed">
                سيتم حفظ تقدمك الحالي، ويمكنك العودة لإكمال مغامرتك في أي وقت لاحق.
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
                <span className="text-4xl">🔄</span>
              </div>
              <h3 className="text-[var(--earth-brown-dark)] text-xl md:text-2xl font-bold mb-3">
                إعادة بدء المغامرة؟
              </h3>
              <p className="text-[var(--earth-brown)] text-sm md:text-base mb-8 leading-relaxed">
                هل أنت متأكد؟ سيؤدي هذا إلى مسح تقدمك الحالي والبدء من المشهد الأول.
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
