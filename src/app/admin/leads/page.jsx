'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Search,
  Phone,
  MapPin,
  Download,
  RefreshCw,
  Loader2,
  ExternalLink,
  FileSpreadsheet,
  Table as TableIcon,
  Maximize2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const GOOGLE_SHEET_EDIT_URL = 'https://docs.google.com/spreadsheets/d/1Bpjd0IQIAgcHq_Q2pv-UFRBn_il7z6V-5sv49HiV1nw/edit?usp=sharing';
const GOOGLE_SHEET_EMBED_URL = 'https://docs.google.com/spreadsheets/d/1Bpjd0IQIAgcHq_Q2pv-UFRBn_il7z6V-5sv49HiV1nw/edit?usp=sharing&rm=minimal';

export default function AdminLeadsPage() {
  const [activeTab, setActiveTab] = useState('sheet'); // 'sheet' | 'database'
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sheetLoading, setSheetLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [sheetKey, setSheetKey] = useState(Date.now());
  const iframeRef = useRef(null);

  const fetchLeads = async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true);
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('venthulir_token') || localStorage.getItem('token')
          : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch('/api/leads', { headers });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleReloadSheet = () => {
    setSheetLoading(true);
    setSheetKey(Date.now());
  };

  // Filter leads for the Database view
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      locationFilter === 'ALL' || lead.location === locationFilter;

    return matchesSearch && matchesLocation;
  });

  const uniqueLocations = Array.from(
    new Set(leads.map((l) => l.location).filter(Boolean))
  );

  // Export to Excel / CSV
  const handleExportCSV = () => {
    if (!leads.length) return;

    const headers = ['Date', 'Time', 'Customer Name', 'Phone Number', 'Location / District', 'Source', 'Live Sheet Synced'];
    const rows = leads.map((l) => {
      const d = new Date(l.createdAt || Date.now());
      const dateStr = d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
      const timeStr = d.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
      return [
        `"${dateStr}"`,
        `"${timeStr}"`,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${l.phone || ''}"`,
        `"${(l.location || '').replace(/"/g, '""')}"`,
        `"${(l.source || '').replace(/"/g, '""')}"`,
        `"${l.syncedToSheet ? 'Yes' : 'No'}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Venthulir_Visitor_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-page-container" style={{ padding: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#134522', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users className="w-7 h-7 text-[#1B5E2F]" />
            Visitor Leads Management
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Real-time customer inquiries captured from website popup modal (Synced to Live Google Sheet &amp; Database)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href={GOOGLE_SHEET_EDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              background: '#0F9D58',
              color: '#ffffff',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '0.9rem',
              boxShadow: '0 2px 6px rgba(15, 157, 88, 0.25)',
              transition: 'background 0.2s'
            }}
          >
            <ExternalLink className="w-4 h-4" /> Open in Google Sheets
          </a>

          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              background: '#1B5E2F',
              border: 'none',
              color: '#ffffff',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <Download className="w-4 h-4" /> Download CSV
          </button>
        </div>
      </div>

      {/* View Switcher Tabs: Live Google Sheet vs Database Records */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div style={{ display: 'inline-flex', background: '#E8F5EC', padding: '4px', borderRadius: '10px', border: '1px solid #cce8d4' }}>
          <button
            type="button"
            onClick={() => setActiveTab('sheet')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              background: activeTab === 'sheet' ? '#1B5E2F' : 'transparent',
              color: activeTab === 'sheet' ? '#ffffff' : '#134522',
              boxShadow: activeTab === 'sheet' ? '0 2px 8px rgba(27, 94, 47, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Live Google Sheet (Excel)
            <span style={{
              fontSize: '0.72rem',
              background: activeTab === 'sheet' ? 'rgba(255,255,255,0.25)' : '#1B5E2F',
              color: '#ffffff',
              padding: '2px 7px',
              borderRadius: '9999px',
              fontWeight: '800'
            }}>
              LIVE
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('database')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              background: activeTab === 'database' ? '#1B5E2F' : 'transparent',
              color: activeTab === 'database' ? '#ffffff' : '#134522',
              boxShadow: activeTab === 'database' ? '0 2px 8px rgba(27, 94, 47, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <TableIcon className="w-4 h-4" />
            Database Records Table
            <span style={{
              fontSize: '0.72rem',
              background: activeTab === 'database' ? 'rgba(255,255,255,0.25)' : '#d0e8d6',
              color: activeTab === 'database' ? '#ffffff' : '#134522',
              padding: '2px 7px',
              borderRadius: '9999px',
              fontWeight: '800'
            }}>
              {leads.length}
            </span>
          </button>
        </div>

        {activeTab === 'sheet' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleReloadSheet}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #d4d4d4',
                color: '#333',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              title="Reload Sheet Frame"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${sheetLoading ? 'animate-spin' : ''}`} /> Reload Sheet
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: LIVE EMBEDDED GOOGLE SPREADSHEET (PRIMARY)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'sheet' && (
        <div style={{
          position: 'relative',
          background: '#ffffff',
          borderRadius: '14px',
          border: '1.5px solid #d4ebd9',
          boxShadow: '0 4px 18px rgba(11, 51, 31, 0.08)',
          overflow: 'hidden',
          width: '100%',
          height: 'calc(100vh - 220px)',
          minHeight: '620px'
        }}>
          {/* Loading Indicator */}
          {sheetLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255, 255, 255, 0.92)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              gap: '12px'
            }}>
              <Loader2 className="w-9 h-9 animate-spin text-[#1B5E2F]" style={{ color: '#1B5E2F' }} />
              <div style={{ fontSize: '0.98rem', fontWeight: '700', color: '#134522' }}>
                Connecting to Google Sheets...
              </div>
              <p style={{ fontSize: '0.82rem', color: '#666', margin: 0 }}>
                Loading live synchronized Excel spreadsheet
              </p>
            </div>
          )}

          {/* Embedded Google Spreadsheet Iframe */}
          <iframe
            key={sheetKey}
            ref={iframeRef}
            src={GOOGLE_SHEET_EMBED_URL}
            title="Venthulir Visitor Leads Google Sheet"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
            onLoad={() => setSheetLoading(false)}
            allow="clipboard-read; clipboard-write"
          />
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: DATABASE RECORDS TABLE & FILTERING
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'database' && (
        <>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e5e5e5', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>Total Leads Captured</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#134522', marginTop: '4px' }}>{leads.length}</div>
            </div>
            <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e5e5e5', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>Distinct Locations</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1B5E2F', marginTop: '4px' }}>{uniqueLocations.length}</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e5e5e5', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#888' }} />
              <input
                type="text"
                placeholder="Search by name, phone, district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '0.9rem',
                background: '#ffffff',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Districts / Locations ({leads.length})</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => fetchLeads(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #ddd',
                color: '#333',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <RefreshCw className="w-4 h-4" /> Refresh Data
            </button>
          </div>

          {/* Table */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e5e5', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            {loading ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#666' }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ margin: '0 auto 12px', color: '#1B5E2F' }} />
                <p>Loading captured leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#888' }}>
                <Users className="w-12 h-12" style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ fontSize: '1rem', fontWeight: '600' }}>No leads found</p>
                <p style={{ fontSize: '0.85rem' }}>New visitor submissions will show up here automatically.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#FAF9F6', borderBottom: '1px solid #e5e5e5', color: '#134522', fontWeight: '700' }}>
                      <th style={{ padding: '14px 18px' }}>Customer Name</th>
                      <th style={{ padding: '14px 18px' }}>Mobile / WhatsApp</th>
                      <th style={{ padding: '14px 18px' }}>Location / District</th>
                      <th style={{ padding: '14px 18px' }}>Date &amp; Time</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center' }}>WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => {
                      const d = new Date(lead.createdAt || Date.now());
                      const dateStr = d.toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      });
                      const timeStr = d.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      });

                      return (
                        <tr
                          key={lead._id}
                          style={{
                            borderBottom: '1px solid #f0f0f0',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FBF9')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '14px 18px', fontWeight: '600', color: '#134522' }}>
                            {lead.name}
                          </td>
                          <td style={{ padding: '14px 18px', color: '#333' }}>
                            <a
                              href={`tel:${lead.phone}`}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#1B5E2F', textDecoration: 'none', fontWeight: '500' }}
                            >
                              <Phone className="w-3.5 h-3.5" />
                              {lead.phone}
                            </a>
                          </td>
                          <td style={{ padding: '14px 18px', color: '#555' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#E8F5EC', color: '#134522', padding: '4px 10px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '600' }}>
                              <MapPin className="w-3.5 h-3.5" />
                              {lead.location}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', color: '#777', fontSize: '0.82rem' }}>
                            <div>{dateStr}</div>
                            <div style={{ color: '#999', fontSize: '0.75rem' }}>{timeStr}</div>
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                            <a
                              href={`https://wa.me/91${lead.phone}?text=Hello%20${encodeURIComponent(lead.name)}%2C%20Welcome%20to%20Venthulir%20Natural%20Harvests!%20Here%20is%20your%20exclusive%20welcome%20discount%20code%3A%20VENTHULIR10`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                background: '#25D366',
                                color: '#ffffff',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                textDecoration: 'none'
                              }}
                            >
                              Chat
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}
