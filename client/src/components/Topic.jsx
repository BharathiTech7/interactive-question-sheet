import { useState } from "react";
import { useSheetStore } from "../store/sheetStore";
import SubTopic from "./SubTopic";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Topic({ topic }) {
  const [subTopicTitle, setSubTopicTitle] = useState("");

  const addSubTopic = useSheetStore((state) => state.addSubTopic);
  const deleteTopic = useSheetStore((state) => state.deleteTopic);
  const editTopic = useSheetStore((state) => state.editTopic);
  const reorderSubTopics = useSheetStore(
    (state) => state.reorderSubTopics
  );

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(topic.title);

  /* ---------- Progress Calculation (BONUS) ---------- */
  const totalQuestions = topic.subTopics.reduce(
    (acc, sub) => acc + sub.questions.length,
    0
  );

  const completedQuestions = topic.subTopics.reduce(
    (acc, sub) =>
      acc + sub.questions.filter((q) => q.completed).length,
    0
  );

  const progress =
    totalQuestions === 0
      ? 0
      : Math.round((completedQuestions / totalQuestions) * 100);

  /* ---------- Topic Drag ---------- */
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="rounded-2xl p-6 mb-10
                 shadow-lg hover:shadow-2xl
                 transition-all duration-300
                 bg-[var(--bg-card)]
                 text-[var(--text-main)]
                 border border-[var(--border-main)]"
    >
      {/* ---------- Topic Header ---------- */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <span
            {...listeners}
            className="cursor-grab opacity-70 hover:opacity-100"
          >
            ☰
          </span>

          {isEditing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-1.5 rounded-lg
                         bg-[var(--bg-row)]
                         text-[var(--text-main)]
                         border border-[var(--border-main)]"
            />
          ) : (
            <h2 className="text-xl font-bold">
              {topic.title}
            </h2>
          )}
        </div>

        <div className="flex gap-4">
          {isEditing ? (
            <button
              onClick={() => {
                editTopic(topic.id, title);
                setIsEditing(false);
              }}
              className="text-green-500 text-sm hover:underline"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 text-sm hover:underline"
            >
              Edit
            </button>
          )}

          <button
            onClick={() => deleteTopic(topic.id)}
            className="text-red-500 text-sm hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      {/* ---------- Progress Bar (BONUS) ---------- */}
      <div className="mb-6">
        <div className="flex justify-between text-xs opacity-70 mb-1">
          <span>Progress</span>
          <span>
            {completedQuestions}/{totalQuestions}
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden
                        bg-[var(--border-main)]">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ---------- Add Sub-topic ---------- */}
      <div className="flex gap-3 items-center mb-6">
        <input
          type="text"
          placeholder="Enter sub-topic"
          value={subTopicTitle}
          onChange={(e) => setSubTopicTitle(e.target.value)}
          className="px-4 py-2 rounded-lg text-sm w-64
                     bg-[var(--bg-row)]
                     text-[var(--text-main)]
                     border border-[var(--border-main)]"
        />

        <button
          onClick={() => {
            if (!subTopicTitle.trim()) return;
            addSubTopic(topic.id, subTopicTitle);
            setSubTopicTitle("");
          }}
          className="bg-blue-600 hover:bg-blue-500
                     text-white px-4 py-2 rounded-lg text-sm"
        >
          Add Sub-topic
        </button>
      </div>

      {/* ---------- Sub-topics ---------- */}
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;
          if (!over || active.id === over.id) return;

          const oldIndex = topic.subTopics.findIndex(
            (s) => s.id === active.id
          );
          const newIndex = topic.subTopics.findIndex(
            (s) => s.id === over.id
          );

          reorderSubTopics(topic.id, oldIndex, newIndex);
        }}
      >
        <SortableContext
          items={topic.subTopics.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {topic.subTopics.map((sub) => (
              <SubTopic
                key={sub.id}
                topicId={topic.id}
                sub={sub}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
