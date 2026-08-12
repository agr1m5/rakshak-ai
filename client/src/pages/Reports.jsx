import { useEffect, useState } from "react";
import { FileText, Download, Trash2, Plus, Loader2 } from "lucide-react";
import SeverityBadge from "../components/ui/SeverityBadge";
import * as reportService from "../services/reportService";
import * as logService from "../services/logService";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [parsedLogs, setParsedLogs] = useState([]);
  const [selectedLogId, setSelectedLogId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportList, logList] = await Promise.all([
        reportService.listReports(),
        logService.listLogs(),
      ]);
      setReports(reportList);
      setParsedLogs(logList.filter((l) => l.status === "parsed"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedLogId) return;
    setError(null);
    setGenerating(true);
    try {
      const report = await reportService.createReport(selectedLogId);
      setReports((prev) => [report, ...prev]);
      setSelectedLogId("");
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (report) => {
    setDownloadingId(report._id);
    try {
      await reportService.downloadReport(report._id, `${report.title}.pdf`);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (reportId) => {
    try {
      await reportService.deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-mono text-sentinel-400 mb-1 uppercase tracking-wide">
          Reporting
        </p>
        <h1 className="font-display text-2xl text-ink-50">Incident reports</h1>
        <p className="text-ink-400 text-sm mt-1">
          Generate a PDF incident report from any parsed log — executive
          summary, detected threats, mitigations, and a timeline.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-severity-critical/30 bg-severity-critical/10 px-4 py-2 text-sm text-severity-critical">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-ink-700 bg-ink-900 p-4 mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
        <select
          value={selectedLogId}
          onChange={(e) => setSelectedLogId(e.target.value)}
          className="flex-1 rounded-md border border-ink-700 bg-ink-950 px-3 py-2 text-sm text-ink-50 focus:outline-none focus:ring-1 focus:ring-sentinel-400"
        >
          <option value="">
            {parsedLogs.length === 0 ? "No parsed logs available yet" : "Select a parsed log…"}
          </option>
          {parsedLogs.map((log) => (
            <option key={log._id} value={log._id}>
              {log.originalName}
            </option>
          ))}
        </select>
        <button
          onClick={handleGenerate}
          disabled={!selectedLogId || generating}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-md bg-sentinel-400 px-4 py-2 text-sm font-medium text-ink-950 disabled:opacity-40 transition-opacity"
        >
          {generating ? (
            <Loader2 size={14} className="animate-spin" strokeWidth={2} />
          ) : (
            <Plus size={14} strokeWidth={2} />
          )}
          {generating ? "Generating…" : "Generate report"}
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-ink-600 font-mono">Loading…</div>
      ) : reports.length === 0 ? (
        <div className="rounded-lg border border-ink-700 bg-ink-900 p-10 flex flex-col items-center gap-2 text-ink-600">
          <FileText size={22} strokeWidth={1.5} />
          <span className="text-sm">No reports yet</span>
        </div>
      ) : (
        <div className="rounded-lg border border-ink-700 bg-ink-900 divide-y divide-ink-700">
          {reports.map((report) => (
            <div key={report._id} className="flex items-center gap-3 px-4 py-3">
              <FileText size={16} className="text-sentinel-400 shrink-0" strokeWidth={1.75} />
              <div className="min-w-0 flex-1">
                <div className="text-sm text-ink-50 truncate">{report.title}</div>
                <div className="text-xs font-mono text-ink-500">
                  {new Date(report.createdAt).toLocaleString()}
                </div>
              </div>
              <SeverityBadge level={report.overallSeverity} />
              <button
                onClick={() => handleDownload(report)}
                disabled={downloadingId === report._id}
                className="shrink-0 text-ink-500 hover:text-sentinel-400 disabled:opacity-40"
                aria-label="Download PDF"
                title="Download PDF"
              >
                {downloadingId === report._id ? (
                  <Loader2 size={15} className="animate-spin" strokeWidth={1.75} />
                ) : (
                  <Download size={15} strokeWidth={1.75} />
                )}
              </button>
              <button
                onClick={() => handleDelete(report._id)}
                className="shrink-0 text-ink-600 hover:text-severity-critical"
                aria-label="Delete report"
              >
                <Trash2 size={14} strokeWidth={1.75} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
