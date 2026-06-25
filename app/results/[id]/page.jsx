'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageTransition from '@/components/animations/PageTransition';
import DocumentHeader from '@/components/results/DocumentHeader';
import RiskScoreBadge from '@/components/results/RiskScoreBadge';
import SummaryCard from '@/components/results/SummaryCard';
import ClauseList from '@/components/results/ClauseList';
import RedFlagBanner from '@/components/results/RedFlagBanner';
import ObligationsList from '@/components/results/ObligationsList';
import KeyAmounts from '@/components/results/KeyAmounts';
import ChatWindow from '@/components/results/ChatWindow';
import Skeleton from '@/components/ui/Skeleton';

export default function ResultsPage() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/documents/${params.id}`);
        if (res.ok) {
          const json = await res.json();
          const doc = json.document;
          const analysis = doc.analyses?.[0]?.result_json || {};
          setData({
            ...analysis,
            documentText: doc.raw_text,
            language: doc.language,
            document_type: doc.analyses?.[0]?.document_type || analysis.document_type,
            risk_score: doc.analyses?.[0]?.risk_score || analysis.risk_score,
            risk_score_number: doc.analyses?.[0]?.risk_score_num || analysis.risk_score_number,
          });
        } else {
          const stored = localStorage.getItem(`doc_${params.id}`);
          if (stored) {
            setData(JSON.parse(stored));
          } else {
            setNotFound(true);
          }
        }
      } catch {
        const stored = localStorage.getItem(`doc_${params.id}`);
        if (stored) {
          setData(JSON.parse(stored));
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ padding: 40, maxWidth: 680, margin: '0 auto' }}>
        <Skeleton height={24} width="60%" />
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Skeleton height={80} />
          <Skeleton height={120} />
          <Skeleton height={200} />
        </div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <PageTransition>
        <div style={{ textAlign: 'center', padding: '6rem 24px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 28, color: 'var(--text-primary)', marginBottom: 12 }}>
            Document not found
          </h1>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24 }}>
            This analysis is no longer available. Please upload your document again.
          </p>
          <Link href="/upload" className="btn-primary" style={{ height: 48, padding: '0 28px' }}>
            Upload a Document
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <DocumentHeader
        filename={data.document_type}
        docType={data.document_type}
        language={data.language}
        documentId={params.id}
      />
      <div className="results-layout">
        <div className="results-main">
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <RiskScoreBadge
              riskScore={data.risk_score}
              riskScoreNumber={data.risk_score_number}
              riskReason={data.risk_reason}
            />
            <SummaryCard summary={data.simple_summary} keyFacts={data.key_facts} />
            {data.red_flag_count > 0 && (
              <RedFlagBanner redFlagCount={data.red_flag_count} clauses={data.clauses} />
            )}
            <ClauseList clauses={data.clauses} />
            <ObligationsList obligations={data.obligations} documentId={params.id} />
            <KeyAmounts amounts={data.key_amounts} />

            {data.your_rights && data.your_rights.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 18, color: 'var(--text-primary)', marginBottom: 12 }}>
                  Your Rights
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {data.your_rights.map((right, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 16px', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--success)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{right}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="results-chat">
          <ChatWindow
            documentText={data.documentText}
            documentId={params.id}
            language={data.language || 'English'}
            suggestedQuestions={data.suggested_questions || []}
          />
        </div>
      </div>

      <style jsx>{`
        .results-layout {
          display: grid;
          grid-template-columns: 60% 40%;
          min-height: calc(100vh - 68px - 60px);
        }
        .results-main {
          overflow-y: auto;
          max-height: calc(100vh - 68px - 60px);
        }
        .results-chat {
          position: sticky;
          top: 128px;
          height: calc(100vh - 68px - 60px);
        }
        @media (max-width: 1024px) {
          .results-layout {
            grid-template-columns: 1fr;
          }
          .results-chat {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 60vh;
            z-index: 30;
            border-top: 2px solid var(--border);
            border-left: none;
          }
        }
      `}</style>
    </PageTransition>
  );
}
