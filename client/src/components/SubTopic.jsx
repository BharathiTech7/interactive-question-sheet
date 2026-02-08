import { useState } from "react";
import { useSheetStore } from "../store/sheetStore";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SubTopic({ topicId, sub }) {
  const addQuestion = useSheetStore((state) => state.addQuestion);
  const deleteQuestion = useSheetStore((state) => state.deleteQuestion);
  const deleteSubTopic = useSheetStore((state) => state.deleteSubTopic);
  const editSubTopic = useSheetStore((state) => state.editSubTopic);
  const editQuestion = useSheetStore((state) => state.editQuestion);
  const reorderQuestions = useSheetStore(
    (state) => state.reorderQuestions
  );

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: sub.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditingSub, setIsEditingSub] = useState(false);
  const [open, setOpen] = useState(true);
  const [subTitle, setSubTitle] = useState(sub.title);

  const total = sub.questions.length;
  const done = sub.questions.filter((q) => q.completed).length;

  const [qTitle, setQTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [link, setLink] = useState("");

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="ml-8 mt-6 rounded-xl p-5
                 bg-[var(--bg-sub)]
                 border border-[var(--border-main)]"
    >
      {/* ---------- Sub-topic Header ---------- */}
      <div
        className="flex justify-between items-center mb-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <span
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab opacity-70 hover:opacity-100"
          >
            ☰
          </span>

          {isEditingSub ? (
            <input
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm
                         bg-[var(--bg-row)]
                         text-[var(--text-main)]
                         border border-[var(--border-main)]"
            />
          ) : (
            <h3 className="font-semibold flex items-center gap-2
                           text-[var(--text-main)]">
              {sub.title}
              <span className="text-xs px-2 py-0.5 rounded-full
                               bg-[var(--bg-row)]
                               text-[var(--text-muted)]">
                {done}/{total}
              </span>
            </h3>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteSubTopic(topicId, sub.id);
          }}
          className="text-red-500 text-xs hover:underline"
        >
          Delete
        </button>
      </div>

      {open && (
        <>
          {/* ---------- Add Question ---------- */}
          <div className="ml-6 mt-4 flex gap-3 flex-wrap items-center">
            <input
              type="text"
              placeholder="Question title"
              value={qTitle}
              onChange={(e) => setQTitle(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm
                         bg-[var(--bg-row)]
                         text-[var(--text-main)]
                         border border-[var(--border-main)]"
            />

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm
                         bg-[var(--bg-row)]
                         text-[var(--text-main)]
                         border border-[var(--border-main)]"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <input
              type="text"
              placeholder="Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm w-64
                         bg-[var(--bg-row)]
                         text-[var(--text-main)]
                         border border-[var(--border-main)]"
            />

            <button
              onClick={() => {
                if (!qTitle.trim()) return;
                addQuestion(topicId, sub.id, {
                  title: qTitle,
                  difficulty,
                  link,
                });
                setQTitle("");
                setLink("");
              }}
              className="bg-blue-600 hover:bg-blue-500
                         text-white px-4 py-2 rounded-lg text-sm"
            >
              Add Question
            </button>
          </div>

          {/* ---------- Questions ---------- */}
          <div className="mt-4">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event;
                if (!over || active.id === over.id) return;

                const oldIndex = sub.questions.findIndex(
                  (q) => q.id === active.id
                );
                const newIndex = sub.questions.findIndex(
                  (q) => q.id === over.id
                );

                reorderQuestions(topicId, sub.id, oldIndex, newIndex);
              }}
            >
              <SortableContext
                items={sub.questions.map((q) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {sub.questions.map((q) => (
                    <QuestionItem
                      key={q.id}
                      q={q}
                      topicId={topicId}
                      subId={sub.id}
                      deleteQuestion={deleteQuestion}
                      editQuestion={editQuestion}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- Question Item ---------------- */

function QuestionItem({
  q,
  topicId,
  subId,
  deleteQuestion,
  editQuestion,
}) {
  const toggleQuestionStatus = useSheetStore(
    (state) => state.toggleQuestionStatus
  );

  const [isEditingQ, setIsEditingQ] = useState(false);
  const [title, setTitle] = useState(q.title);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: q.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="ml-6 p-4 rounded-xl
                 bg-[var(--bg-card)]
                 border border-[var(--border-main)]
                 flex justify-between items-center text-sm"
    >
      <div className="flex items-center gap-3">
        <span {...listeners} className="cursor-grab opacity-70">
          ☰
        </span>

        <input
          type="checkbox"
          checked={q.completed}
          onChange={() =>
            toggleQuestionStatus(topicId, subId, q.id)
          }
          className="w-5 h-5 accent-emerald-500"
        />

        {isEditingQ ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-2 py-1 rounded text-sm
                       bg-[var(--bg-row)]
                       text-[var(--text-main)]
                       border border-[var(--border-main)]"
          />
        ) : (
          <>
            {q.link ? (
              <a
                href={q.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-500 hover:underline"
              >
                {q.title}
              </a>
            ) : (
              <span className="font-medium text-[var(--text-main)]">
                {q.title}
              </span>
            )}

            <span
              className={`ml-2 px-3 py-1 rounded-full text-xs
                ${
                  q.difficulty === "Easy"
                    ? "bg-green-200 text-green-800"
                    : q.difficulty === "Medium"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}
            >
              {q.difficulty}
            </span>
          </>
        )}
      </div>

      <div className="flex gap-3">
        {isEditingQ ? (
          <button
            onClick={() => {
              editQuestion(topicId, subId, q.id, {
                title,
              });
              setIsEditingQ(false);
            }}
            className="text-green-500 text-xs hover:underline"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditingQ(true)}
            className="text-blue-500 text-xs hover:underline"
          >
            Edit
          </button>
        )}

        <button
          onClick={() =>
            deleteQuestion(topicId, subId, q.id)
          }
          className="text-red-500 text-xs hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
