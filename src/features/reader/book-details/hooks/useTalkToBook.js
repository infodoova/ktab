import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertToast } from "@/components/myui/AlertToast";
import { askBookQuestion, cleanLlmJsonAnswer } from "../services/talkToBookService";

const MIN_QUESTION_LENGTH = 3;
const MAX_QUESTION_LENGTH = 350;

/**
 * Generates tailored, high-intellect recommendation questions grounded in the book's
 * specific title, author, genre, and editorial context.
 *
 * @param {Object} params
 * @param {string} params.bookTitle
 * @param {string} [params.authorName]
 * @param {string} [params.genre]
 * @param {string} [params.description]
 * @returns {string[]}
 */
function generateTailoredPrompts({ bookTitle, authorName, genre, description }) {
  // Extract primary title before colon/dash subtitles to ensure concise, non-overflowing prompts on mobile
  const rawTitle = bookTitle ? bookTitle.split(/[:\-–—]/)[0].trim() : "";
  const title = rawTitle
    ? `«${rawTitle.length > 25 ? rawTitle.slice(0, 23).trim() + "..." : rawTitle}»`
    : "هذا العمل";
  const author = authorName && authorName !== "مؤلف غير معروف" ? authorName : null;
  const isMemoirOrHistory =
    /مذكرات|سيرة|تاريخ|سياس|دبلوماس|وثائق/i.test(genre || "") ||
    /مذكرات|سيرة|وزارة|دبلوماس|سياس/i.test(bookTitle || "") ||
    /مذكرات|وثائق|سيرة|سياس/i.test(description || "");

  const isLiterary =
    /رواية|قصة|خيال|أدب/i.test(genre || "") ||
    /رواية|قصص/i.test(bookTitle || "");

  if (isMemoirOrHistory) {
    return [
      `ما هي أبرز المحطات والوقائع التاريخية الموثقة في ${title}؟`,
      author
        ? `كيف يصف ${author} كواليس اتخاذ القرارات والمفاوضات في هذا العمل؟`
        : `كيف توثق فصول الكتاب كواليس صنع القرار والمفاوضات؟`,
      `ما هي أهم التحديات والأزمات التي يستعرضها الكاتب في فصول مذكراته؟`,
      `ما هي الدروس والعبر السياسية والتنفيذية المستخلصة من هذه التجربة؟`,
      `لخّص لي أهم القضايا والملفات التي تناولها الكتاب بإيجاز...`,
      `ما هي الرؤية المستقبلية أو الخلاصات التي يقدمها الكاتب في ختام مذكراته؟`,
    ];
  }

  if (isLiterary) {
    return [
      `ما هي الفكرة الجوهرية والرسالة الفلسفية في ${title}؟`,
      `من هي الشخصيات الأكثر تأثيراً في مسار الأحداث وما هي دوافعها؟`,
      `ما هو الصراع المحوري الذي تدور حوله فصول الرواية؟`,
      `لخّص لي أحداث البداية وتطور الحبكة بإيجاز...`,
      author
        ? `ما هي أبرز الرمزيات والأساليب الأدبية التي وظفها ${author}؟`
        : `ما هي أبرز الرمزيات والمعاني الكامنة بين صفحات الكتاب؟`,
      `ما هي الدروس الإنسانية والتحولات النفسية لأبطال القصة؟`,
    ];
  }

  // Non-fiction / Intellectual / General
  return [
    `ما هي الأطروحة والفرضية المركزية لكتاب ${title}؟`,
    author
      ? `ما هي الرؤية والمنهجية التي يعتمدها ${author} في طرح أفكاره؟`
      : `ما هي المنهجية التي يعتمدها الكاتب في معالجة موضوعاته؟`,
    `ما هي أهم الاستنتاجات والتوصيات العملية التي يقدمها هذا العمل؟`,
    `لخّص لي أهم محاور ونقاط الكتاب الرئيسية بإيجاز...`,
    `ما هي الأدلة والبراهين التي يستند إليها الكاتب لدعم فكرته؟`,
    `ما هي الفائدة المعرفية الكبرى التي يخرج بها القارئ من هذا الكتاب؟`,
  ];
}

/**
 * Validates whether the user's input adheres to server question constraints.
 * Detects excessive character repetition and length boundaries.
 *
 * @param {string} text
 * @returns {boolean}
 */
function isValidQuestion(text) {
  if (!text || typeof text !== "string") return false;
  const trimmed = text.trim();
  if (trimmed.length < MIN_QUESTION_LENGTH || trimmed.length > MAX_QUESTION_LENGTH) {
    return false;
  }
  // Block repeated single character spam (e.g. "aaaaaa...")
  if (/^(.)\1{5,}$/.test(trimmed)) {
    return false;
  }
  return true;
}

const SESSION_STORAGE_KEY_PREFIX = "ktab_talk_to_book_session_";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24-hour retention window

/**
 * Loads a cached conversation session for the given book from localStorage if within the TTL window.
 *
 * @param {string|number} bookId
 * @returns {{ bookId: string, messages: Array, draftQuestion: string } | null}
 */
function loadSavedSession(bookId) {
  if (bookId == null || typeof window === "undefined") return null;
  const normalizedId = String(bookId).trim();
  if (!normalizedId) return null;

  const key = `${SESSION_STORAGE_KEY_PREFIX}${normalizedId}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    // Strict validation: must match requested bookId
    if (!parsed || String(parsed.bookId) !== normalizedId) {
      return null;
    }

    // Invalidate if the session exceeds the 24-hour TTL threshold
    if (parsed.savedAt && Date.now() - parsed.savedAt > SESSION_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }

    if (!Array.isArray(parsed.messages) || parsed.messages.length === 0) {
      return null;
    }

    // Sanitize any existing assistant messages to strip legacy unparsed JSON envelopes
    const cleanedMessages = parsed.messages.map((msg) => {
      if (msg && msg.role === "assistant" && typeof msg.content === "string") {
        const cleaned = cleanLlmJsonAnswer(msg.content);
        return {
          ...msg,
          content: cleaned.answer || msg.content,
          citations:
            Array.isArray(msg.citations) && msg.citations.length > 0
              ? msg.citations
              : cleaned.citations,
          citedPages:
            Array.isArray(msg.citedPages) && msg.citedPages.length > 0
              ? msg.citedPages
              : cleaned.citedPages,
        };
      }
      return msg;
    });

    return {
      ...parsed,
      messages: cleanedMessages,
    };
  } catch (err) {
    console.warn("Failed to load saved TalkToBook session:", err);
    return null;
  }
}

/**
 * Persists the current conversation messages and draft question to localStorage.
 * Strictly scoped to the specified bookId.
 *
 * @param {string|number} bookId
 * @param {string} bookTitle
 * @param {Array} messages
 * @param {string} draftQuestion
 */
function saveSession(bookId, bookTitle, messages, draftQuestion = "") {
  if (bookId == null || typeof window === "undefined") return;
  const normalizedId = String(bookId).trim();
  if (!normalizedId) return;

  const key = `${SESSION_STORAGE_KEY_PREFIX}${normalizedId}`;
  try {
    const hasUserInteraction = Array.isArray(messages) && messages.some((m) => m.role === "user");
    const hasDraft = typeof draftQuestion === "string" && draftQuestion.trim().length > 0;

    // Do not save clean, untouched default welcome screens
    if (!hasUserInteraction && !hasDraft) {
      return;
    }

    const messagesToSave = messages.slice(-60);
    const payload = {
      bookId: normalizedId,
      bookTitle: bookTitle || "",
      messages: messagesToSave,
      draftQuestion: draftQuestion || "",
      savedAt: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.warn("Failed to persist TalkToBook session to localStorage:", err);
  }
}

/**
 * Removes cached conversation session for the given book from localStorage.
 *
 * @param {string|number} bookId
 */
function clearSavedSession(bookId) {
  if (bookId == null || typeof window === "undefined") return;
  const normalizedId = String(bookId).trim();
  if (!normalizedId) return;

  const key = `${SESSION_STORAGE_KEY_PREFIX}${normalizedId}`;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn("Failed to clear saved TalkToBook session:", err);
  }
}

/**
 * Custom hook encapsulating state, validation, communication, and navigation
 * for the Talk-to-Book interactive AI feature.
 *
 * @param {Object} params
 * @param {string|number} params.bookId - ID of currently viewed book.
 * @param {string} [params.bookTitle] - Title for personalized empty state.
 * @param {string} [params.authorName] - Author name for tailored prompts.
 * @param {string} [params.genre] - Book genre for contextual prompts.
 * @param {string} [params.description] - Book summary for contextual prompts.
 */
export function useTalkToBook({
  bookId,
  bookTitle = "",
  authorName = "",
  genre = "",
  description = "",
} = {}) {
  const navigate = useNavigate();
  const normalizedBookId = bookId != null ? String(bookId).trim() : "";

  // Dedicated ref to track the active bookId currently represented in component state
  const activeBookIdRef = useRef(normalizedBookId);

  const savedSession = useMemo(() => loadSavedSession(normalizedBookId), [normalizedBookId]);

  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState(() => savedSession?.draftQuestion || "");
  const [isLoading, setIsLoading] = useState(false);
  const [predictionIndex, setPredictionIndex] = useState(0);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  // Generate tailored questions according to book subject matter
  const predictionsList = useMemo(() => {
    return generateTailoredPrompts({ bookTitle, authorName, genre, description });
  }, [bookTitle, authorName, genre, description]);

  // Dynamic rotating placeholder cycling through tailored questions
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setPredictionIndex((prev) => (prev + 1) % predictionsList.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isOpen, predictionsList.length]);

  const currentPlaceholder = predictionsList[predictionIndex % predictionsList.length];

  const buildInitialWelcomeMessage = useCallback(() => [
    {
      id: `welcome-${normalizedBookId || "default"}`,
      role: "assistant",
      content: bookTitle
        ? `مرحباً بك! أنا مساعد القراءة المعتمد لكتاب «${bookTitle}». اطرح علي أي سؤال يتعلق بأحداثه، شخصياته، أو أفكاره وسأجيبك مباشرة استناداً إلى صفحات الكتاب الأصلية.`
        : "مرحباً بك! أنا رفيق القراءة الذكي. اطرح أي سؤال يتعلق بنصوص أو أفكار الكتاب وسأجيبك بدقة مستنداً إلى الصفحات المعتمدة.",
      citations: [],
      citedPages: [],
      cached: false,
      source: "INTERNAL_RAG",
      hitCount: 0,
      timestamp: new Date().toISOString(),
    },
  ], [normalizedBookId, bookTitle]);

  const [messages, setMessages] = useState(() => {
    if (savedSession?.messages && savedSession.messages.length > 0) {
      return savedSession.messages;
    }
    return buildInitialWelcomeMessage();
  });

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom of conversation feed upon new messages or loading trigger
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(false);
      // Small timeout to allow modal animation to mount before requesting focus
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isLoading, scrollToBottom]);

  // Modal open / close handlers
  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Input change with 350-character boundary clamp
  const handleQuestionChange = useCallback((e) => {
    const nextVal = e.target.value;
    if (nextVal.length <= MAX_QUESTION_LENGTH) {
      setQuestion(nextVal);
    }
  }, []);

  /**
   * Advances and applies the next tailored AI recommendation prompt directly into the input.
   * Every click advances to the next suggestion in the list and updates the textarea.
   */
  const handleCyclePrediction = useCallback(() => {
    setPredictionIndex((prev) => {
      const nextIdx = (prev + 1) % predictionsList.length;
      const nextPrompt = predictionsList[nextIdx];
      setQuestion(nextPrompt);
      return nextIdx;
    });

    // Keep focus and place cursor at end
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const len = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(len, len);
      }
    }, 10);
  }, [predictionsList]);

  /**
   * Internal submission pipeline handling API communication and message state appending.
   *
   * @param {string} promptText - User query to submit.
   */
  const sendQuestion = useCallback(
    async (promptText) => {
      const trimmed = promptText ? promptText.trim() : "";

      if (!isValidQuestion(trimmed)) {
        if (!trimmed || trimmed.length < MIN_QUESTION_LENGTH) {
          AlertToast("يرجى كتابة سؤال لا يقل عن 3 أحرف.", "WARNING");
        } else if (trimmed.length > MAX_QUESTION_LENGTH) {
          AlertToast("يتجاوز السؤال الحد الأقصى المسموح به (350 حرفًا).", "WARNING");
        } else {
          AlertToast("يرجى كتابة سؤال واضح ومفهوم بدون تكرار غير مفيد.", "WARNING");
        }
        return;
      }

      if (!bookId) {
        AlertToast("معرف الكتاب غير متوفر حالياً.", "ERROR");
        return;
      }

      const userMessageId = `user-${Date.now()}`;
      const userMessage = {
        id: userMessageId,
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setQuestion("");
      setIsLoading(true);

      try {
        const responseData = await askBookQuestion(bookId, trimmed);
        const cleaned = cleanLlmJsonAnswer(responseData.answer || responseData);

        const aiMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: cleaned.answer || responseData.answer,
          citations:
            Array.isArray(responseData.citations) && responseData.citations.length > 0
              ? responseData.citations
              : cleaned.citations,
          citedPages:
            Array.isArray(responseData.citedPages) && responseData.citedPages.length > 0
              ? responseData.citedPages
              : cleaned.citedPages,
          cached: Boolean(responseData.cached),
          source: responseData.source || "INTERNAL_RAG",
          hitCount: typeof responseData.hitCount === "number" ? responseData.hitCount : 0,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (err) {
        const is502Error =
          err?.status === 502 ||
          err?.code === "INVALID_BOOK_CITATIONS" ||
          (typeof err?.message === "string" &&
            (err.message.includes("توثيق الاقتباسات") ||
             err.message.includes("502") ||
             err.message.includes("Bad Gateway") ||
             err.message.includes("Invalid citation") ||
             err.message.includes("InvalidBookCitationsException")));

        const fallbackMessage = is502Error
          ? "تعذر توثيق الاقتباسات من صفحات الكتاب بدقة، يرجى إعادة صياغة السؤال."
          : (err?.message || "تعذر إكمال الاستعلام حالياً. يرجى إعادة المحاولة.");

        AlertToast(fallbackMessage, "ERROR");

        const errorAssistantMessage = {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: fallbackMessage,
          isError: true,
          citations: [],
          citedPages: [],
          cached: false,
          source: "ERROR",
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, errorAssistantMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [bookId]
  );

  const handleSubmit = useCallback(
    (e) => {
      if (e) e.preventDefault();
      if (!isLoading) {
        sendQuestion(question);
      }
    },
    [isLoading, question, sendQuestion]
  );

  const handleQuickPromptClick = useCallback(
    (quickPrompt) => {
      if (!isLoading) {
        sendQuestion(quickPrompt);
      }
    },
    [isLoading, sendQuestion]
  );

  // Handle switching between different books: safely swap session data
  useEffect(() => {
    if (!normalizedBookId) return;

    if (activeBookIdRef.current !== normalizedBookId) {
      activeBookIdRef.current = normalizedBookId;
      const session = loadSavedSession(normalizedBookId);
      if (session?.messages && session.messages.length > 0) {
        setMessages(session.messages);
        setQuestion(session.draftQuestion || "");
      } else {
        setMessages(buildInitialWelcomeMessage());
        setQuestion("");
      }
    }
  }, [normalizedBookId, buildInitialWelcomeMessage]);

  // Persist session to localStorage ONLY when state strictly matches the active book
  useEffect(() => {
    if (!normalizedBookId) return;
    if (activeBookIdRef.current === normalizedBookId) {
      saveSession(normalizedBookId, bookTitle, messages, question);
    }
  }, [normalizedBookId, bookTitle, messages, question]);

  const handleClearChat = useCallback(() => {
    clearSavedSession(normalizedBookId);
    setMessages(buildInitialWelcomeMessage());
    setQuestion("");
  }, [normalizedBookId, buildInitialWelcomeMessage]);

  /**
   * Navigates directly into the Reader view targeting either a verbatim text snippet
   * or a fallback cited page number.
   *
   * @param {{ id?: number, snippet?: string, page?: number | null } | number} citation
   */
  const handleCitationClick = useCallback(
    (citation) => {
      if (!bookId || !citation) return;

      let pageNumber = typeof citation === "object" ? citation.page : null;
      let snippet = typeof citation === "object" ? citation.snippet : null;
      const citationId =
        typeof citation === "object" ? citation.id : (typeof citation === "number" ? citation : null);

      // If snippet is missing from payload, scan conversation history for matching citation ID
      if (!snippet && citationId != null) {
        for (let i = messages.length - 1; i >= 0; i--) {
          const msg = messages[i];
          if (Array.isArray(msg?.citations)) {
            const found = msg.citations.find((c) => Number(c?.id) === Number(citationId));
            if (found) {
              if (found.snippet) snippet = found.snippet;
              if (found.page) pageNumber = found.page;
              break;
            }
          }
        }
      }

      setIsOpen(false);

      const queryParams = new URLSearchParams();
      if (snippet) queryParams.set("snippet", snippet);
      if (pageNumber) queryParams.set("page", pageNumber);

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

      navigate(`/reader/display/${bookId}${queryString}`, {
        state: {
          targetPage: pageNumber,
          initialPage: pageNumber,
          highlightSnippet: snippet,
        },
      });
    },
    [bookId, messages, navigate]
  );

  /**
   * Backward-compatible page click handler.
   *
   * @param {number} pageNumber
   */
  const handlePageClick = useCallback(
    (pageNumber) => {
      handleCitationClick({ page: pageNumber });
    },
    [handleCitationClick]
  );

  // Keyboard navigation & accessibility (Escape to dismiss)
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Handle composer Enter vs Shift+Enter
  const handleComposerKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  /**
   * Writes the specified message text to clipboard with legacy fallback.
   *
   * @param {string} msgId
   * @param {string} text
   */
  const handleCopyMessage = useCallback(async (msgId, text) => {
    if (!text) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const tempTextarea = document.createElement("textarea");
        tempTextarea.value = text;
        tempTextarea.style.position = "fixed";
        tempTextarea.style.left = "-9999px";
        document.body.appendChild(tempTextarea);
        tempTextarea.focus();
        tempTextarea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextarea);
      }
      setCopiedMessageId(msgId);
      setTimeout(() => {
        setCopiedMessageId((current) => (current === msgId ? null : current));
      }, 2000);
    } catch (err) {
      console.warn("Could not copy message text to clipboard:", err);
    }
  }, []);

  const charCount = question.length;
  const isQuestionValid = isValidQuestion(question);

  return {
    isOpen,
    handleOpen,
    handleClose,
    handleToggle,
    question,
    charCount,
    maxChars: MAX_QUESTION_LENGTH,
    isQuestionValid,
    currentPlaceholder,
    handleCyclePrediction,
    handleApplyPrediction: handleCyclePrediction,
    handleQuestionChange,
    handleComposerKeyDown,
    handleSubmit,
    handleQuickPromptClick,
    handleClearChat,
    handleCitationClick,
    handlePageClick,
    handleCopyMessage,
    copiedMessageId,
    messages,
    isLoading,
    messagesEndRef,
    textareaRef,
  };
}
