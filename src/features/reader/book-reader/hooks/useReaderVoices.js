import { useCallback, useMemo } from "react";
import { useAuthStore, useReaderPreferencesStore } from "@/core/store";
import { normalizeRole } from "@/core/constants/roles";
import { VOICES_LIST } from "../constants/readerConstants";

export function useReaderVoices() {
  const role = useAuthStore((state) => state.user?.role);
  const savedVoice = useReaderPreferencesStore((state) => state.voice);
  const saveVoice = useReaderPreferencesStore((state) => state.setVoice);
  const isReader = normalizeRole(role) === "READER";
  const firstVoiceId = VOICES_LIST[0].id;

  // Resolve before sending TTS requests so a previously saved voice cannot
  // select a locked option during manual playback, page changes or prefetch.
  const voice = isReader ? firstVoiceId : savedVoice;
  const voiceOptions = useMemo(() => VOICES_LIST.map((option, index) => ({
    ...option,
    locked: isReader && index > 0,
  })), [isReader]);

  const setVoice = useCallback((voiceId) => {
    if (isReader && voiceId !== firstVoiceId) return;
    saveVoice(voiceId);
  }, [isReader, firstVoiceId, saveVoice]);

  return { voice, setVoice, voiceOptions };
}
