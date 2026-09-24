import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  startInteractiveStorySession,
  submitInteractiveChoice,
  mapApiChoicesToNodes,
  clearSessionRequestCache,
} from "../services/interactivePlayService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Hook for managing an active interactive game/story session lifecycle.
 * Provides defensive guards against rapid spam, double answers, picking on old scenes,
 * picking while generating, and duplicate calls on refresh.
 */
export function useStorySession() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const storyId = searchParams.get("storyId") || location.state?.storyId;
  const initialStoryTitle = location.state?.storyTitle || "";

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
  const [lastFailedChoice, setLastFailedChoice] = useState(null);
  const [isChoicesSheetOpen, setIsChoicesSheetOpen] = useState(false);

  // Synchronization refs for deduplication and spam prevention
  const requestIdRef = useRef(0);
  const choiceRequestIdRef = useRef(0);
  const sceneSelectorRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const lastFetchedStoryIdRef = useRef(null);
  const isStartingSessionRef = useRef(false);
  const isSubmittingChoiceRef = useRef(false);

  const fetchInitialScene = useCallback(
    async (forceRestart = false) => {
      if (!storyId) {
        setError("لم يتم تحديد القصة");
        setLoading(false);
        return;
      }

      // Guard against duplicate start calls on React StrictMode mount or rapid re-renders
      if (
        !forceRestart &&
        (isStartingSessionRef.current ||
          (hasInitializedRef.current && lastFetchedStoryIdRef.current === storyId))
      ) {
        return;
      }

      isStartingSessionRef.current = true;
      lastFetchedStoryIdRef.current = storyId;
      hasInitializedRef.current = true;

      const reqId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      try {
        const response = await startInteractiveStorySession(storyId);
        if (reqId !== requestIdRef.current) return;

        const data = response?.data || response;

        if (data) {
          const rawTurns = Array.isArray(data.turns) ? data.turns : [data];
          // Sort turns ascending by turnIndex (1, 2, 3...)
          const sortedTurns = [...rawTurns].sort(
            (a, b) => (a.turnIndex || 0) - (b.turnIndex || 0)
          );

          const history = sortedTurns.map((t) => ({
            sceneId: `turn_${t.turnIndex}`,
            sceneNumber: t.turnIndex,
            sceneText: t.sceneText || "",
            sceneImage: t.imageUrl || "",
            nodes: mapApiChoicesToNodes(t),
            chosenNodeId: t.chosenId || null,
          }));

          const activeSessionId = data.sessionId || data.id || storyId;
          setSessionId(activeSessionId);
          setSceneHistory(history);

          // Active scene is the first unanswered scene (chosenNodeId is null), or the latest scene
          const activeScene =
            history.find((s) => !s.chosenNodeId) || history[history.length - 1];
          setCurrentScene(activeScene);

          setStoryMetadata({
            title: initialStoryTitle || data.story?.title || data.title || "",
            ...(data.story || {}),
            storyScenes: data.storyScenes || data.story?.storyScenes || 14,
          });

          // Preload active scene artwork
          if (activeScene?.sceneImage) {
            const img = new Image();
            img.src = activeScene.sceneImage;
          }
        }
      } catch (err) {
        if (reqId !== requestIdRef.current) return;
        console.error("Start session error:", err);
        setError("تعذر بدء الجلسة التفاعلية");
      } finally {
        isStartingSessionRef.current = false;
        if (reqId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [storyId, initialStoryTitle]
  );

  useEffect(() => {
    fetchInitialScene();
  }, [fetchInitialScene]);

  const handleSelectChoice = async (node) => {
    // 1. Guard against multi-click / spamming choice submissions (synchronous ref check)
    if (isSubmittingChoiceRef.current) return;

    // 2. Guard against missing session, missing current scene, or invalid node
    if (!sessionId || !currentScene || !node?.nodeId) return;

    // 3. Guard against choosing while generating or if current scene is pending
    if (generatingScene || currentScene.isPending) return;

    // 4. Guard against re-choosing if an answer was already selected on this scene
    if (currentScene.chosenNodeId) return;

    // 5. Guard against choosing from historical/old scenes in the timeline:
    // User can ONLY choose on the latest scene in sceneHistory!
    const latestScene = sceneHistory[sceneHistory.length - 1];
    if (!latestScene || currentScene.sceneId !== latestScene.sceneId) return;

    // Synchronously acquire lock BEFORE anything else to prevent racing clicks
    isSubmittingChoiceRef.current = true;
    const choiceReqId = ++choiceRequestIdRef.current;

    setGeneratingScene(true);
    setLastFailedChoice(null);

    const selectedNodeId = node.nodeId;
    const currentSceneId = currentScene.sceneId;
    const currentSceneNum = currentScene.sceneNumber || sceneHistory.length;
    const nextSceneNum = currentSceneNum + 1;

    // Create optimistic pending scene for next step
    const pendingScene = {
      sceneId: `turn_${nextSceneNum}_pending`,
      sceneNumber: nextSceneNum,
      sceneText: "",
      sceneImage: "",
      nodes: [],
      chosenNodeId: null,
      isPending: true,
    };

    // Mark current scene as chosen and immediately advance history and active view to next step
    const previousSnapshot = currentScene;
    setSceneHistory((prev) => {
      const updated = prev.map((s) =>
        s.sceneId === currentSceneId ? { ...s, chosenNodeId: selectedNodeId } : s
      );
      if (!updated.some((s) => s.sceneId === pendingScene.sceneId)) {
        return [...updated, pendingScene];
      }
      return updated;
    });

    // Advance directly to the next step to show loading there
    setCurrentScene(pendingScene);

    try {
      const response = await submitInteractiveChoice(sessionId, selectedNodeId);
      if (choiceReqId !== choiceRequestIdRef.current) return;

      const resData = response?.data || response;

      if (resData && resData.messageStatus !== "ERROR") {
        if (Array.isArray(resData.turns)) {
          const sortedTurns = [...resData.turns].sort(
            (a, b) => (a.turnIndex || 0) - (b.turnIndex || 0)
          );
          const history = sortedTurns.map((t) => ({
            sceneId: `turn_${t.turnIndex}`,
            sceneNumber: t.turnIndex,
            sceneText: t.sceneText || "",
            sceneImage: t.imageUrl || "",
            nodes: mapApiChoicesToNodes(t),
            chosenNodeId: t.chosenId || null,
          }));
          setSceneHistory(history);
          const activeScene =
            history.find((s) => !s.chosenNodeId) || history[history.length - 1];
          setCurrentScene(activeScene);
          if (activeScene?.sceneImage) {
            const img = new Image();
            img.src = activeScene.sceneImage;
          }
        } else if (resData.turnIndex !== undefined || resData.sceneText) {
          const newScene = {
            sceneId: `turn_${resData.turnIndex ?? nextSceneNum}`,
            sceneNumber: resData.turnIndex ?? nextSceneNum,
            sceneText: resData.sceneText || "",
            sceneImage: resData.imageUrl || "",
            nodes: mapApiChoicesToNodes(resData),
            chosenNodeId: null,
          };

          if (newScene.sceneImage) {
            const img = new Image();
            img.src = newScene.sceneImage;
          }

          // Replace pending scene with the real resolved scene
          setSceneHistory((prev) =>
            prev.map((s) => (s.sceneId === pendingScene.sceneId ? newScene : s))
          );
          setCurrentScene(newScene);
        }
      } else {
        const errMsg = resData?.message || "فشل معالجة المشهد الجديد";
        AlertToast(errMsg, "ERROR");
        setLastFailedChoice(node);
        // Rollback: remove pending scene and restore current scene for retry
        setSceneHistory((prev) => prev.filter((s) => s.sceneId !== pendingScene.sceneId));
        setCurrentScene(previousSnapshot);
      }
    } catch (err) {
      if (choiceReqId !== choiceRequestIdRef.current) return;
      console.error("Submit choice error:", err);
      AlertToast("فشل الاتصال لتوليد المشهد. يمكنك إعادة المحاولة.", "ERROR");
      setLastFailedChoice(node);
      // Rollback: remove pending scene and restore current scene for retry
      setSceneHistory((prev) => prev.filter((s) => s.sceneId !== pendingScene.sceneId));
      setCurrentScene(previousSnapshot);
    } finally {
      if (choiceReqId === choiceRequestIdRef.current) {
        isSubmittingChoiceRef.current = false;
        setGeneratingScene(false);
      }
    }
  };

  const handleRetryChoice = () => {
    if (lastFailedChoice && !generatingScene && !isSubmittingChoiceRef.current) {
      handleSelectChoice(lastFailedChoice);
    }
  };

  const handleGoToScene = (index) => {
    // Cannot navigate away while a scene is actively being generated
    if (generatingScene || isSubmittingChoiceRef.current) return;
    if (sceneHistory[index]) {
      setCurrentScene(sceneHistory[index]);
    }
  };

  const handleRestartSession = () => {
    setShowRestartConfirm(false);
    clearSessionRequestCache(storyId);
    hasInitializedRef.current = false;
    lastFetchedStoryIdRef.current = null;
    isSubmittingChoiceRef.current = false;
    choiceRequestIdRef.current++;
    setSceneHistory([]);
    setCurrentScene(null);
    setLastFailedChoice(null);
    fetchInitialScene(true);
  };

  const handleExitSession = () => {
    navigate("/reader/interactive-stories");
  };

  return {
    loading,
    generatingScene,
    currentScene,
    sceneHistory,
    error,
    storyMetadata,
    showExitConfirm,
    setShowExitConfirm,
    showRestartConfirm,
    setShowRestartConfirm,
    previewImage,
    setPreviewImage,
    isChoicesSheetOpen,
    setIsChoicesSheetOpen,
    sceneSelectorRef,
    lastFailedChoice,
    handleRetryChoice,
    handleSelectChoice,
    handleGoToScene,
    handleRestartSession,
    handleExitSession,
  };
}

export default useStorySession;
