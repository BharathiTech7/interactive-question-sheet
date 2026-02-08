import { useEffect, useState, useRef } from "react";
import { useSheetStore } from "./store/sheetStore";
import Topic from "./components/Topic";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function App() {
  const { sheet, fetchSheet, addTopic } = useSheetStore();
  const [topicTitle, setTopicTitle] = useState("");
  const reorderTopics = useSheetStore(
    (state) => state.reorderTopics
  );

  /* ---------- THEME ---------- */
  const [dark, setDark] = useState(false);

  /* ---------- TOPIC SCROLL ---------- */
  const topicRefs = useRef({});

  useEffect(() => {
    fetchSheet();
  }, [fetchSheet]);

  if (!sheet)
    return (
      <div className="app-root flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    /* ✅ SINGLE ROOT (THIS WAS THE BUG) */
    <div className={`app-root ${dark ? "dark" : ""}`}>

      <div className="app-container max-w-6xl mx-auto px-6 py-8">

        {/* ---------- HEADER ---------- */}
        <div className="flex justify-between items-center mb-8">
          {/* ---------- HEADER ---------- */}
<div className="flex justify-between items-center mb-8">
  <div>
    <h1 className="text-3xl font-bold">
      Interactive Question{" "}
      <span className="text-blue-600">
         Management Sheet
      </span>
    </h1>

    <p className="text-sm text-[var(--text-muted)] mt-1">
      Manage topics, sub-topics and questions
    </p>
  </div>
</div>


          {/* ---------- THEME TOGGLE ---------- */}
          <button
            onClick={() => setDark(!dark)}
            className="px-4 py-2 rounded-lg
                       bg-[var(--bg-card)]
                       border border-[var(--border-main)]
                       text-sm font-medium
                       hover:opacity-80 transition"
          >
            {dark ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>

        {/* ---------- ADD TOPIC ---------- */}
        <div className="mb-10 flex gap-3 items-center">
          <input
            type="text"
            placeholder="Enter topic name"
            value={topicTitle}
            onChange={(e) => setTopicTitle(e.target.value)}
            className="px-4 py-2 rounded-lg w-72
                       bg-[var(--bg-card)]
                       border border-[var(--border-main)]
                       focus:outline-none"
          />

          <button
            onClick={() => {
              if (!topicTitle.trim()) return;
              addTopic(topicTitle);
              setTopicTitle("");
            }}
            className="bg-blue-600 text-white
                       px-5 py-2 rounded-lg
                       hover:bg-blue-500 transition"
          >
            Add Topic
          </button>
        </div>

        {/* ---------- TOP BAR ---------- */}
        {sheet.topics.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {sheet.topics.map((t) => (
              <button
                key={t.id}
                onClick={() =>
                  topicRefs.current[t.id]?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="px-3 py-1.5 rounded-full text-sm
                           bg-[var(--bg-card)]
                           border border-[var(--border-main)]
                           hover:opacity-80 transition"
              >
                {t.title}
              </button>
            ))}
          </div>
        )}

        {/* ---------- TOPICS ---------- */}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const oldIndex = sheet.topics.findIndex(
              (t) => t.id === active.id
            );
            const newIndex = sheet.topics.findIndex(
              (t) => t.id === over.id
            );

            reorderTopics(oldIndex, newIndex);
          }}
        >
          <SortableContext
            items={sheet.topics.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-8">
              {sheet.topics.map((topic) => (
                <div
                  key={topic.id}
                  ref={(el) =>
                    (topicRefs.current[topic.id] = el)
                  }
                >
                  <Topic topic={topic} />
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>

      </div>
    </div>
  );
}

export default App;
