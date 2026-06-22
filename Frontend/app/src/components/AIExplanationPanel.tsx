import { Bot, Loader2, ShieldCheck } from 'lucide-react';
import type { BuildExplanationResponse } from '../types/api';
import { Badge, EmptyState, ErrorBanner, Panel, SectionTitle } from './ui';

export function AIExplanationPanel({
  explanation,
  isLoading,
  error,
}: {
  explanation: BuildExplanationResponse | null;
  isLoading: boolean;
  error: string | null;
}) {
  if (isLoading) {
    return (
      <Panel>
        <div className="flex items-center gap-3 text-on-surface-variant">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <div>
            <p className="font-headline text-lg font-black uppercase italic text-white">
              AI Build Copilot is analyzing evidence...
            </p>
            <p className="mt-1 text-sm">
              Retrieving supporting chunks and generating a grounded explanation.
            </p>
          </div>
        </div>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel>
        <ErrorBanner message={error} />
        <p className="mt-3 text-sm text-on-surface-variant">
          The structured recommendation still worked. This only means the LLM explanation call failed.
        </p>
      </Panel>
    );
  }

  if (!explanation) {
    return (
      <Panel>
        <EmptyState
          title="No AI Explanation Yet"
          message="Generate a build to retrieve evidence and create a grounded LLM explanation."
        />
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <SectionTitle
          eyebrow="Step 03"
          title="AI Build Explanation"
          subtitle="The LLM explains the recommendation using retrieved RAG evidence rather than unsupported model memory."
        />

        <div className="flex flex-wrap gap-2 md:justify-end">
          {explanation.provider && <Badge tone="primary">{explanation.provider}</Badge>}
          {explanation.model && <Badge>{explanation.model}</Badge>}
          {typeof explanation.latency_ms === 'number' && (
            <Badge tone="secondary">{Math.round(explanation.latency_ms)} ms</Badge>
          )}
        </div>
      </div>

      <div className="mt-4 border border-outline-variant/40 bg-surface-container-low p-4">
        <div className="mb-3 flex items-center gap-2 text-primary">
          <Bot className="h-4 w-4" />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em]">
            Grounded LLM Response
          </p>
        </div>

        <div className="whitespace-pre-wrap text-sm leading-6 text-on-surface">
          {explanation.answer}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-secondary" />
          <p className="font-headline text-sm font-black uppercase tracking-widest">
            Evidence Retrieved
          </p>
        </div>

        {explanation.retrieved_chunks.length === 0 ? (
          <EmptyState title="No Evidence Returned" message="The LLM answered without retrieved chunks. Check /rag/search and embeddings." />
        ) : (
          <div className="space-y-3">
            {explanation.retrieved_chunks.map((chunk, index) => (
              <article
                key={chunk.chunk_id ?? index}
                className="border border-outline-variant/40 bg-surface p-3"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge tone="primary">#{index + 1}</Badge>
                  {chunk.source_table && <Badge>{chunk.source_table}</Badge>}
                  {chunk.source_type && <Badge tone="secondary">{chunk.source_type}</Badge>}
                  {typeof chunk.distance === 'number' && (
                    <Badge tone="neutral">DIST {chunk.distance.toFixed(3)}</Badge>
                  )}
                </div>

                <p className="font-headline text-sm font-black uppercase italic">
                  {chunk.title || chunk.chunk_id}
                </p>

                <p className="mt-2 max-h-28 overflow-hidden text-sm leading-6 text-on-surface-variant">
                  {chunk.chunk_text || 'No chunk text returned.'}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
