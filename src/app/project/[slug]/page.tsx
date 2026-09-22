import { notFound } from "next/navigation";
import { getProject, listProjects } from "@/lib/db";
import type { Project } from "@/lib/types";
import ProjectDetailClient from "./ProjectDetailClient";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const all = listProjects();
  const related = project.related
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is Project => Boolean(p));

  return <ProjectDetailClient project={project} related={related} />;
}
