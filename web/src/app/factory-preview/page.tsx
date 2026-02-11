'use client';

import { useEffect, useState } from 'react';

interface Route {
  name: string;
  path: string;
  title: string;
  screenId: string;
  requiresAuth: boolean;
  source: string;
}

interface Spec {
  filename: string;
  path: string;
}

interface PreviewIndex {
  timestamp: string;
  routes: Route[];
  specs: Spec[];
  summary: {
    totalRoutes: number;
    manualRoutes: number;
    generatedRoutes: number;
    totalSpecs: number;
    routesUpdated: boolean;
    specsFound: boolean;
  };
}

export default function FactoryPreviewPage() {
  const [index, setIndex] = useState<PreviewIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndex = async () => {
      try {
        const response = await fetch('/factory-preview/index.json');
        if (!response.ok) {
          throw new Error(`Failed to load index: ${response.status}`);
        }
        const data = await response.json();
        setIndex(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIndex(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIndex();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '2px solid #0070f3', paddingBottom: '1rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', color: '#0070f3' }}>Factory Platform Kit - Web Preview</h1>
        <p style={{ margin: '0', color: '#666', fontSize: '0.95rem' }}>
          Mobile routes and specs index (local development)
        </p>
      </header>

      {loading && (
        <div style={{ padding: '2rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          Loading preview index...
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#ffe6e6', color: '#c00', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
          <pre style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
            Make sure to run: node tools/build-preview-index.mjs
          </pre>
        </div>
      )}

      {index && (
        <>
          {/* Summary */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
              Summary
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Routes</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0070f3' }}>
                  {index.summary.totalRoutes}
                </div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Specs</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0070f3' }}>
                  {index.summary.totalSpecs}
                </div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>Manual Routes</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#666' }}>
                  {index.summary.manualRoutes}
                </div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>Generated Routes</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#28a745' }}>
                  {index.summary.generatedRoutes}
                </div>
              </div>
            </div>
          </section>

          {/* Routes Table */}
          {index.routes.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                Mobile Routes ({index.routes.length})
              </h2>
              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Name</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Path</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Title</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Screen</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Auth</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {index.routes.map((route, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                        <td style={{ padding: '0.75rem', color: '#0070f3', fontWeight: '500' }}>{route.name}</td>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>{route.path}</td>
                        <td style={{ padding: '0.75rem' }}>{route.title}</td>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.9rem', color: '#666' }}>
                          {route.screenId}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.5rem',
                              backgroundColor: route.requiresAuth ? '#ffeaa7' : '#dfe6e9',
                              color: route.requiresAuth ? '#d63031' : '#666',
                              fontSize: '0.85rem',
                              borderRadius: '3px',
                              fontWeight: '500'
                            }}
                          >
                            {route.requiresAuth ? 'YES' : 'NO'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.5rem',
                              backgroundColor: route.source === 'manual' ? '#d1ecf1' : '#d4edda',
                              color: route.source === 'manual' ? '#0c5460' : '#155724',
                              fontSize: '0.85rem',
                              borderRadius: '3px',
                              fontWeight: '500'
                            }}
                          >
                            {route.source}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Specs List */}
          {index.specs.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                Feature Specs ({index.specs.length})
              </h2>
              <div style={{ marginTop: '1rem' }}>
                {index.specs.map((spec, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f9f9f9',
                      borderLeft: '4px solid #0070f3',
                      marginBottom: '0.5rem',
                      borderRadius: '0 4px 4px 0'
                    }}
                  >
                    <code style={{ color: '#0070f3', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      {spec.filename}
                    </code>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                      {spec.path}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer */}
          <footer style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #ddd', color: '#666', fontSize: '0.9rem' }}>
            <p>
              Last updated: {new Date(index.timestamp).toLocaleString()}
            </p>
            <p>
              Command to rebuild: <code style={{ backgroundColor: '#f0f0f0', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>
                node tools/build-preview-index.mjs
              </code>
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
