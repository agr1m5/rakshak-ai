import { useEffect, useRef, useState } from "react";
import { UploadCloud, FileText, Trash2, Loader2, RotateCw, ChevronDown, ChevronRight } from "lucide-react";
import * as logService from "../services/logService";
import * as threatService from "../services/threatService";
import LogDetail from "../components/logs/LogDetail";

const ALLOWED_EXTENSIONS = [".txt", ".log", ".json", ".csv"];

const STATUS_STYLES = {
  pending: "text-ink-400 border-ink-600",
  parsed: "text-severity-low border-severity-low/40",
  failed: "text-severity-critical border-severity-critical/40",
};

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LogAnalyzer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedLog, setExpandedLog] = useState(null);
  const [expandedThreats, setExpandedThreats] = useState(null);
  const [reparsing, setReparsing] = useState(null);
  const [detecting, setDetecting] = useState(false);

  const fileInputRef = useRef(null);

  const loadLogs = () => {
    setLoading(true);
    logService
      .listLogs()
      .then(setLogs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const validateFile = (file) => {
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Unsupported file type "${ext}". Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`;
    }
    return null;
  };

  const handleFile = async (file) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const log = await logService.uploadLog(file, setUploadProgress);
      setLogs((prev) => [log, ...prev]);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDelete = async (logId) => {
    try {
      await logService.deleteLog(logId);
      setLogs((prev) => prev.filter((l) => l._id !== logId));
      if (expandedId === logId) setExpandedId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleExpand = async (logId) => {
    if (expandedId === logId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(logId);
    setExpandedLog(null);
    setExpandedThreats(null);
    try {
      const [log, threats] = await Promise.all([
        logService.getLog(logId),
        threatService.listThreatsForLog(logId),
      ]);
      setExpandedLog(log);
      setExpandedThreats(threats);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDetectThreats = async (logId) => {
    setDetecting(true);
    try {
      const threats = await threatService.detectThreats(logId);
      setExpandedThreats(threats);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetecting(false);
    }
  };

  const handleReparse = async (logId, e) => {
    e.stopPropagation();
    setReparsing(logId);
    try {
      const updated = await logService.reparseLog(logId);
      setLogs((prev) => prev.map((l) => (l._id === logId ? updated : l)));
      if (expandedId === logId) {
        setExpandedLog(updated);
        const threats = await threatService.listThreatsForLog(logId);
        setExpandedThreats(threats);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setReparsing(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-mono text-sentinel-400 mb-1 uppercase tracking-wide">
          Analysis
        </p>
        <h1 className="font-display text-2xl text-ink-50">Log analyzer</h1>
        <p className="text-ink-400 text-sm mt-1">
          Upload a log file to extract IPs, status codes, and detect threats
          like brute force, SQL injection, XSS, and more. Click a row to see
          the full breakdown.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-severity-critical/30 bg-severity-critical/10 px-4 py-2 text-sm text-severity-critical">
          {error}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-lg border-2 border-dashed p-10 text-center cursor-pointer transition-colors flex flex-col items-center gap-3 ${
          dragActive
            ? "border-sentinel-400 bg-sentinel-400/5"
            : "border-ink-700 bg-ink-900 hover:border-ink-600"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = ""; // allow re-selecting the same file
          }}
        />
        {uploading ? (
          <>
            <Loader2 size={22} className="animate-spin text-sentinel-400" strokeWidth={1.5} />
            <span className="text-sm text-ink-400">Uploading… {uploadProgress}%</span>
          </>
        ) : (
          <>
            <UploadCloud size={22} strokeWidth={1.5} className="text-ink-600" />
            <span className="text-sm text-ink-400">
              Drag &amp; drop, or click to browse —{" "}
              <span className="font-mono text-ink-500">
                {ALLOWED_EXTENSIONS.join(" · ")}
              </span>
            </span>
          </>
        )}
      </div>

      <div className="mt-6">
        <h2 className="font-display text-sm text-ink-50 mb-3">Uploaded logs</h2>

        {loading ? (
          <div className="text-sm text-ink-600 font-mono">Loading…</div>
        ) : logs.length === 0 ? (
          <div className="rounded-lg border border-ink-700 bg-ink-900 p-8 text-center text-ink-600 text-sm">
            No logs uploaded yet
          </div>
        ) : (
          <div className="rounded-lg border border-ink-700 bg-ink-900 divide-y divide-ink-700">
            {logs.map((log) => (
              <div key={log._id}>
                <div
                  onClick={() => toggleExpand(log._id)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-ink-800/40"
                >
                  {expandedId === log._id ? (
                    <ChevronDown size={14} className="text-ink-500 shrink-0" strokeWidth={1.75} />
                  ) : (
                    <ChevronRight size={14} className="text-ink-500 shrink-0" strokeWidth={1.75} />
                  )}
                  <FileText size={16} className="text-sentinel-400 shrink-0" strokeWidth={1.75} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-ink-50 truncate">{log.originalName}</div>
                    <div className="text-xs font-mono text-ink-500">
                      {log.fileType.toUpperCase()} · {formatBytes(log.sizeBytes)} ·{" "}
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-mono uppercase ${STATUS_STYLES[log.status]}`}
                  >
                    {log.status}
                  </span>
                  <button
                    onClick={(e) => handleReparse(log._id, e)}
                    disabled={reparsing === log._id}
                    className="shrink-0 text-ink-600 hover:text-sentinel-400 disabled:opacity-40"
                    aria-label="Re-parse log"
                    title="Re-parse"
                  >
                    <RotateCw
                      size={14}
                      strokeWidth={1.75}
                      className={reparsing === log._id ? "animate-spin" : ""}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(log._id);
                    }}
                    className="shrink-0 text-ink-600 hover:text-severity-critical"
                    aria-label="Delete log"
                  >
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                </div>

                {expandedId === log._id && (
                  expandedLog ? (
                    <LogDetail
                      log={expandedLog}
                      threats={expandedThreats}
                      onDetectThreats={() => handleDetectThreats(log._id)}
                      detecting={detecting}
                    />
                  ) : (
                    <div className="p-4 text-sm text-ink-500 font-mono border-t border-ink-700">
                      Loading…
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
