"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScaleIcon, ZapIcon, ShieldCheckIcon, BookOpenIcon } from "lucide-react"

export default function ApproachesPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 p-6">
          <div className="max-w-5xl w-full space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Approaches for Accuracy, Balance, and Efficiency</h1>
                <p className="text-gray-600">Evaluation of RAG variants and alternatives tailored for legal/policy workloads.</p>
              </div>
            </div>

            <div className="mb-2 flex justify-end gap-2">
              <Button asChild variant="outline" size="sm">
                <a href="/architecture">View System Architecture</a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/documentation">Back to Docs</a>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  Highest Accuracy: Hybrid RAG + Knowledge Graph
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <p>
                  Uses dense vector search, BM25, and knowledge-graph traversal with sentence-level citation binding. Optimized for legal defensibility and precise grounding.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Dense + BM25 fusion</Badge>
                  <Badge variant="secondary">Citation-aware chunks</Badge>
                  <Badge variant="secondary">KG nodes/edges</Badge>
                  <Badge variant="secondary">Self-RAG controller</Badge>
                </div>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pros: highest precision, auditable evidence, multilingual query normalization.</li>
                  <li>Cons: higher compute and operational complexity; requires robust preprocessing.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScaleIcon className="h-5 w-5" />
                  Balanced: Lightweight Hybrid RAG
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <p>
                  Keep vector + BM25 retrieval, drop online KG traversal at query time. Persist citation spans during ingestion.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pros: good accuracy with lower latency and cost.</li>
                  <li>Cons: fewer structured cross-document relations than full KG.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ZapIcon className="h-5 w-5" />
                  Maximum Efficiency: Cached RAG + Query Planning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <p>
                  Add aggressive caching (query, retrieval, and answer), deterministic query planning, and smaller models for retrieval scoring.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pros: lowest cost and fastest responses for repeated workloads.</li>
                  <li>Cons: may underperform on novel or long-tail queries.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alternative for Even More Accuracy: Fine‑tuned LLM + Legal Ontology</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <p>
                  Fine‑tune LLaMA‑3 70B/GPT‑4‑class models on curated judgments and acts; integrate an ontology (Acts → Sections → Clauses; citation networks like Indian Kanoon).
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pros: strong legal phrasing fidelity, improved summarization style.</li>
                  <li>Cons: training/serving cost, continual re‑training to track updates.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Roadmap: Final Architecture and Future Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Finalize Hybrid RAG + KG with sentence‑level citation binding and multilingual query normalization.</li>
                  <li>Enable retrieval fusion (BM25+dense) and introduce tiered caches for answers, traces, and embeddings.</li>
                  <li>Roll out a lightweight ontology (Acts → Sections → Clauses) and progressively enrich the graph.</li>
                  <li>Pilot fine‑tuning on curated judgments for tone/style; keep RAG as the source of truth.</li>
                  <li>Harden observability and evaluation harness with feedback‑driven regression tests.</li>
                </ol>
                <p className="text-xs text-muted-foreground">This aligns with the architecture diagram and future plan shown in the app.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


