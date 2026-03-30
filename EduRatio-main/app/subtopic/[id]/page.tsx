import { notFound } from "next/navigation";
import { ChapterFlowClient } from "@/components/subtopic/ChapterFlowClient";
import { getChapterBundle } from "@/lib/chapterRegistry";
import { SUBTOPICS } from "@/lib/content";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SubtopicPage({ params }: PageProps) {
  const { id } = await params;
  const subtopic = SUBTOPICS.find((item) => item.id === id);
  if (!subtopic) notFound();

  const bundle = getChapterBundle(id);
  if (bundle) {
    return <ChapterFlowClient key={`${bundle.id}-${bundle.quiz.length}`} bundle={bundle} />;
  }

  return (
    <section className="space-y-6 rounded-2xl border border-[#C8D9E6] bg-white p-6 text-[#2F4156]">
      <h1 className="font-[family-name:var(--font-baloo)] text-2xl font-extrabold">{subtopic.title}</h1>
      <p className="text-sm text-slate-600">This chapter page is coming soon.</p>
    </section>
  );
}
