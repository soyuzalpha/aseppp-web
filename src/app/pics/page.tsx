import { listPhotos } from "@/lib/db";
import PicsClient from "./PicsClient";

// Content lives in sqlite, so this can't be prerendered at build time.
export const dynamic = "force-dynamic";

export default function PicsPage() {
  return <PicsClient photos={listPhotos()} />;
}
