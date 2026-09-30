import { useEffect, useState, useCallback } from 'react'
import { RefreshCcw, DollarSign, TrendingUp, CheckCircle, Clock, FileText, Download, Briefcase, FilePlus, RefreshCw } from 'lucide-react'
import AdminLayout from './AdminLayout'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const API = import.meta.env.VITE_API_URL + '/api/admin'

export default function AdminRevenue() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [monthFrom, setMonthFrom] = useState('')
  const [monthTo, setMonthTo] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetch(`${API}/transactions`).then(r => r.json())
      setTransactions(Array.isArray(data) ? data : [])
    } catch {
      setTransactions(JSON.parse(localStorage.getItem('transactions') || '[]'))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const fmt = d => d ? new Date(d).toLocaleString() : '—'
  const getMonthStr = d => d ? new Date(d).toISOString().slice(0, 7) : ''

  const filtered = transactions.filter(t => {
    const searchMatch = !search ||
      t.email?.toLowerCase().includes(search.toLowerCase()) ||
      t.coupon?.toLowerCase().includes(search.toLowerCase());
    
    const tMonth = getMonthStr(t.created_at || t.date);
    const fromMatch = !monthFrom || tMonth >= monthFrom;
    const toMatch = !monthTo || tMonth <= monthTo;

    return searchMatch && fromMatch && toMatch;
  })

  // Calculate totals based on FILTERED completed transactions
  const completedTx = filtered.filter(t => (t.status || '').toLowerCase() === 'completed')

  const totalRevenue = completedTx.reduce((a, t) => a + parseFloat((t.amount || '0').toString().replace(/[^0-9.]/g, '')), 0)
  
  // Specific revenue types
  const generateRevenue = completedTx.filter(t => parseFloat(t.amount) === 50).reduce((a, t) => a + 50, 0)
  const renewalRevenue = completedTx.filter(t => parseFloat(t.amount) === 20).reduce((a, t) => a + 20, 0)
  const submitRevenue = completedTx.filter(t => parseFloat(t.amount) === 10).reduce((a, t) => a + 10, 0)

  const completed = completedTx.length
  const pending   = filtered.filter(t => (t.status || '').toLowerCase() === 'pending').length

  const handleExportExcel = () => {
    const exportData = filtered.map(t => ({
      Date: fmt(t.created_at || t.date),
      Email: t.email || '—',
      Coupon: t.coupon || '—',
      Type: parseFloat(t.amount) === 50 ? 'Generate' : parseFloat(t.amount) === 20 ? 'Renewal' : parseFloat(t.amount) === 10 ? 'Submit' : 'Other',
      Amount: t.amount ? `$${t.amount}` : '—',
      Status: t.status || 'pending'
    }))
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Revenue")
    XLSX.writeFile(wb, "Revenue_Export.xlsx")
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.text("Revenue Report", 14, 15)
    
    const tableColumn = ["Date", "Email", "Coupon", "Type", "Amount", "Status"]
    const tableRows = []

    filtered.forEach(t => {
      const rowData = [
        fmt(t.created_at || t.date),
        t.email || '—',
        t.coupon || '—',
        parseFloat(t.amount) === 50 ? 'Generate' : parseFloat(t.amount) === 20 ? 'Renewal' : parseFloat(t.amount) === 10 ? 'Submit' : 'Other',
        t.amount ? `$${t.amount}` : '—',
        t.status || 'pending'
      ]
      tableRows.push(rowData)
    })

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    })
    doc.save("Revenue_Export.pdf")
  }

  return (
    <AdminLayout title="Revenue" subtitle="Transaction history and revenue overview">
      <style>{`
        .adm-stats-6-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
          margin-bottom: 1.5rem;
        }
        .adm-stat-card-sm {
          background: var(--bg);
          border-radius: var(--radius);
          box-shadow: var(--shadow-card);
          padding: 16px 12px;
          text-align: center;
          transition: transform 0.25s;
        }
        .adm-stat-card-sm:hover { transform: translateY(-4px); }
        .adm-stat-icon-sm {
          width: 40px; height: 40px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 10px;
        }
        .adm-stat-value-sm {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }
        .adm-stat-label-sm {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        @media (max-width: 1200px) {
          .adm-stats-6-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
        }
        @media (max-width: 768px) {
          .adm-stats-6-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
      <div className="adm-page-actions" style={{ flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px' }}>
          <input className="neu-input adm-search" placeholder="Search by email or coupon…" value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth: '200px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>From:</span>
            <input type="month" className="neu-input" value={monthFrom} onChange={e => setMonthFrom(e.target.value)} style={{ width: 'auto' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>To:</span>
            <input type="month" className="neu-input" value={monthTo} onChange={e => setMonthTo(e.target.value)} style={{ width: 'auto' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="neu-btn" onClick={handleExportExcel} style={{ background: '#27ae60', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={14} /> Excel
          </button>
          <button className="neu-btn" onClick={handleExportPDF} style={{ background: '#c0392b', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={14} /> PDF
          </button>
          <button className="neu-btn adm-refresh-btn" onClick={fetchData} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCcw size={14} className={loading ? 'adm-spin' : ''} />
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="adm-stats-6-grid">
        <div className="adm-stat-card-sm">
          <div className="adm-stat-icon-sm" style={{ background: 'rgba(39,174,96,0.12)' }}><DollarSign size={20} color="#27ae60" /></div>
          <div className="adm-stat-value-sm">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="adm-stat-label-sm">Total Revenue</div>
        </div>
        <div className="adm-stat-card-sm">
          <div className="adm-stat-icon-sm" style={{ background: 'rgba(155,89,182,0.12)' }}><FilePlus size={20} color="#9b59b6" /></div>
          <div className="adm-stat-value-sm">${generateRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="adm-stat-label-sm">Generate</div>
        </div>
        <div className="adm-stat-card-sm">
          <div className="adm-stat-icon-sm" style={{ background: 'rgba(52,73,94,0.12)' }}><Briefcase size={20} color="#34495e" /></div>
          <div className="adm-stat-value-sm">${submitRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="adm-stat-label-sm">Submit</div>
        </div>
        <div className="adm-stat-card-sm">
          <div className="adm-stat-icon-sm" style={{ background: 'rgba(26,188,156,0.12)' }}><RefreshCw size={20} color="#1abc9c" /></div>
          <div className="adm-stat-value-sm">${renewalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="adm-stat-label-sm">Renewal</div>
        </div>
        <div className="adm-stat-card-sm">
          <div className="adm-stat-icon-sm" style={{ background: 'rgba(74,144,217,0.12)' }}><CheckCircle size={20} color="#4A90D9" /></div>
          <div className="adm-stat-value-sm">{completed}</div>
          <div className="adm-stat-label-sm">Completed</div>
        </div>
        <div className="adm-stat-card-sm">
          <div className="adm-stat-icon-sm" style={{ background: 'rgba(230,126,34,0.12)' }}><Clock size={20} color="#e67e22" /></div>
          <div className="adm-stat-value-sm">{pending}</div>
          <div className="adm-stat-label-sm">Pending</div>
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-title">
          Transactions
          <span className="adm-count">{filtered.length}</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>#</th><th>Date</th><th>Email</th><th>Coupon</th><th>Type</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} className="adm-empty">No transactions found.</td></tr>
                : filtered.map((t, i) => (
                  <tr key={t.id || i}>
                    <td className="mono adm-muted">{filtered.length - i}</td>
                    <td>{fmt(t.created_at || t.date)}</td>
                    <td>{t.email || '—'}</td>
                    <td className="mono">{t.coupon || '—'}</td>
                    <td>
                      <span className={`adm-badge ${parseFloat(t.amount) === 20 ? 'badge-blue' : 'badge-green'}`}>
                      {parseFloat(t.amount) === 50 ? 'Generate' : parseFloat(t.amount) === 20 ? 'Renewal' : parseFloat(t.amount) === 10 ? 'Submit' : 'Other'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#27ae60' }}>{t.amount ? `$${t.amount}` : '—'}</td>
                    <td>
                      <span className={`adm-badge ${(t.status || '').toLowerCase() === 'completed' ? 'badge-green' : 'badge-gray'}`}>
                        {t.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
