import { useCallback, useMemo } from "react";
import { useAuthStore, useReaderPreferencesStore } from "@/core/store";
import { normalizeRole } from "@/core/constants/roles";
import { VOICES_LIST } from "../constants/readerConstants";

export function useReaderVoices() {
  const role = useAuthStore((state) => state.user?.role);
  const savedVoice = useReaderPreferencesStore((state) => state.voice);
  const saveVoice = useReaderPreferencesStore((state) => state.setVoice);
  const isReader = normalizeRole(role) === "READER";
  const freeVoiceIds = useMemo(
    () => VOICES_LIST.filter((v, idx) => v.isFree || idx < 2).map((v) => v.id),
    []
  );
  const defaultVoiceId = freeVoiceIds[0] || VOICES_LIST[0].id;

  // Resolve before sending TTS requests so a previously saved voice cannot
  // select a locked option during manual playback, page changes or prefetch.
  const isSavedVoiceAllowed = !isReader || freeVoiceIds.includes(savedVoice);
  const voice = isSavedVoiceAllowed && savedVoice ? savedVoice : defaultVoiceId;

  const voiceOptions = useMemo(
    () =>
      VOICES_LIST.map((option, index) => ({
        ...option,
        locked: isReader && !(option.isFree || index < 2),
      })),
    [isReader]
  );

  const setVoice = useCallback(
    (voiceId) => {
      if (isReader && !freeVoiceIds.includes(voiceId)) return;
      saveVoice(voiceId);
    },
    [isReader, freeVoiceIds, saveVoice]
  );

  return { voice, setVoice, voiceOptions };
}
