import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";

const syncSheet = async (sheet) => {
  await fetch("https://iqs-backend.onrender.com/api/sheet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sheet),
  });
};

export const useSheetStore = create((set, get) => ({
  sheet: null,

  fetchSheet: async () => {
    const res = await fetch("https://iqs-backend.onrender.com/api/sheet");
    const data = await res.json();
    set({ sheet: data });
  },

  /* ---------- TOPIC ---------- */
  addTopic: (title) => {
    const { sheet } = get();
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      topics: [
        ...sheet.topics,
        { id: crypto.randomUUID(), title, subTopics: [] },
      ],
    };

    set({ sheet: updatedSheet });
    syncSheet(updatedSheet);
  },

  deleteTopic: (topicId) => {
    const { sheet } = get();
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      topics: sheet.topics.filter((t) => t.id !== topicId),
    };

    set({ sheet: updatedSheet });
    syncSheet(updatedSheet);
  },

  editTopic: (topicId, title) => {
    const { sheet } = get();
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      topics: sheet.topics.map((t) =>
        t.id === topicId ? { ...t, title } : t
      ),
    };

    set({ sheet: updatedSheet });
    syncSheet(updatedSheet);
  },

  reorderTopics: (oldIndex, newIndex) => {
    const { sheet } = get();
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      topics: arrayMove(sheet.topics, oldIndex, newIndex),
    };

    set({ sheet: updatedSheet });
    syncSheet(updatedSheet);
  },

  /* ---------- SUB-TOPIC ---------- */
  addSubTopic: (topicId, title) => {
    const { sheet } = get();
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      topics: sheet.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: [
                ...t.subTopics,
                { id: crypto.randomUUID(), title, questions: [] },
              ],
            }
          : t
      ),
    };

    set({ sheet: updatedSheet });
    syncSheet(updatedSheet);
  },

  deleteSubTopic: (topicId, subId) => {
    const { sheet } = get();
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      topics: sheet.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.filter((s) => s.id !== subId),
            }
          : t
      ),
    };

    set({ sheet: updatedSheet });
    syncSheet(updatedSheet);
  },

  editSubTopic: (topicId, subId, title) => {
    const { sheet } = get();
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      topics: sheet.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subId ? { ...s, title } : s
              ),
            }
          : t
      ),
    };

    set({ sheet: updatedSheet });
    syncSheet(updatedSheet);
  },

  reorderSubTopics: (topicId, oldIndex, newIndex) => {
    const { sheet } = get();
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      topics: sheet.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: arrayMove(
                t.subTopics,
                oldIndex,
                newIndex
              ),
            }
          : t
      ),
    };

    set({ sheet: updatedSheet });
    syncSheet(updatedSheet);
  },

  /* ---------- QUESTIONS ---------- */
  addQuestion: (topicId, subId, q) => {
    const { sheet } = get();
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      topics: sheet.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subId
                  ? {
                      ...s,
                      questions: [
                        ...s.questions,
                        {
                          id: crypto.randomUUID(),
                          completed: false, // ⭐ NEW
                          ...q,
                        },
                      ],
                    }
                  : s
              ),
            }
          : t
      ),
    };

    set({ sheet: updatedSheet });
    syncSheet(updatedSheet);
  },

  deleteQuestion: (topicId, subId, qId) => {
    const { sheet } = get();
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      topics: sheet.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subId
                  ? {
                      ...s,
                      questions: s.questions.filter(
                        (q) => q.id !== qId
                      ),
                    }
                  : s
              ),
            }
          : t
      ),
    };

    set({ sheet: updatedSheet });
    syncSheet(updatedSheet);
  },

  editQuestion: (topicId, subId, qId, data) => {
    const { sheet } = get();
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      topics: sheet.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subId
                  ? {
                      ...s,
                      questions: s.questions.map((q) =>
                        q.id === qId
                          ? { ...q, ...data }
                          : q
                      ),
                    }
                  : s
              ),
            }
          : t
      ),
    };

    set({ sheet: updatedSheet });
    syncSheet(updatedSheet);
  },

  reorderQuestions: (topicId, subId, oldIndex, newIndex) => {
    const { sheet } = get();
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      topics: sheet.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subId
                  ? {
                      ...s,
                      questions: arrayMove(
                        s.questions,
                        oldIndex,
                        newIndex
                      ),
                    }
                  : s
              ),
            }
          : t
      ),
    };

    set({ sheet: updatedSheet });
    syncSheet(updatedSheet);
  },

  /* ⭐ BONUS: TOGGLE QUESTION STATUS */
  toggleQuestionStatus: (topicId, subId, qId) => {
    const { sheet } = get();
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      topics: sheet.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subId
                  ? {
                      ...s,
                      questions: s.questions.map((q) =>
                        q.id === qId
                          ? { ...q, completed: !q.completed }
                          : q
                      ),
                    }
                  : s
              ),
            }
          : t
      ),
    };

    set({ sheet: updatedSheet });
    syncSheet(updatedSheet);
  },
}));
