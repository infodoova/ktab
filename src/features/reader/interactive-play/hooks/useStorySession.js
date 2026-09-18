import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  startInteractiveStorySession,
  submitInteractiveChoice,
  mapApiChoicesToNodes,
} from "../services/interactivePlayService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Hook for managing an active interactive game/story session lifecycle.
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

  const requestIdRef = useRef(0);
  const sceneSelectorRef = useRef(null);

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
      const response = await startInteractiveStorySession(storyId);
      if (reqId !== requestIdRef.current) return;

      const data = response?.data || response;

      if (data) {
        const turnsData = data.turns || [data];
        const history = turnsData
          .map((t, i) => ({
            sceneId: `turn_${t.turnIndex}`,
            sceneNumber: t.turnIndex,
            sceneText: t.sceneText,
            sceneImage: t.imageUrl || "",
            nodes: mapApiChoicesToNodes(t),
            chosenNodeId: turnsData[i + 1]?.chosenId || null,
          }))
          .reverse();

        const activeSessionId = data.sessionId || data.id || storyId;
        setSessionId(activeSessionId);
        setSceneHistory(history);
        setCurrentScene(history[history.length - 1]);

        setStoryMetadata({
          title: initialStoryTitle,
          ...(data.story || {}),
          storyScenes: data.storyScenes || data.story?.storyScenes,
        });
      }
    } catch (err) {
      console.error("Start session error:", err);
      setError("تعذر بدء الجلسة التفاعلية");
    } finally {
      if (reqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [storyId, initialStoryTitle]);

  useEffect(() => {
    fetchInitialScene();
  }, [fetchInitialScene]);

  const [lastFailedChoice, setLastFailedChoice] = useState(null);

  const handleSelectChoice = async (node) => {
    if (generatingScene || !sessionId || !currentScene) return;

    setGeneratingScene(true);
    setLastFailedChoice(null);

    try {
      const response = await submitInteractiveChoice(sessionId, node.nodeId);
      const data = response?.data || response;

      if (data && data.messageStatus !== "ERROR" && (data.turnIndex !== undefined || data.sceneText)) {
        const newScene = {
          sceneId: `turn_${data.turnIndex ?? (sceneHistory.length + 1)}`,
          sceneNumber: data.turnIndex ?? (sceneHistory.length + 1),
          sceneText: data.sceneText,
          sceneImage: data.imageUrl || "",
          nodes: mapApiChoicesToNodes(data),
          chosenNodeId: null,
        };

        setSceneHistory((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0) {
            updated[lastIdx] = { ...updated[lastIdx], chosenNodeId: node.nodeId };
          }
          return [...updated, newScene];
        });

        setCurrentScene(newScene);
      } else {
        const errMsg = data?.message || "فشل معالجة المشهد الجديد";
        AlertToast(errMsg, "ERROR");
        setLastFailedChoice(node);
      }
    } catch (err) {
      console.error("Submit choice error:", err);
      AlertToast("فشل الاتصال لتوليد المشهد. يمكنك إعادة المحاولة.", "ERROR");
      setLastFailedChoice(node);
    } finally {
      setGeneratingScene(false);
    }
  };

  const handleRetryChoice = () => {
    if (lastFailedChoice) {
      handleSelectChoice(lastFailedChoice);
    }
  };

  const handleGoToScene = (index) => {
    if (sceneHistory[index]) {
      setCurrentScene(sceneHistory[index]);
    }
  };

  const handleRestartSession = () => {
    setShowRestartConfirm(false);
    setSceneHistory([]);
    setCurrentScene(null);
    setLastFailedChoice(null);
    fetchInitialScene();
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
