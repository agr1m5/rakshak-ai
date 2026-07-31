import fs from "fs/promises";
import { parseTextEntries, parseJsonEntries, parseCsvEntries } from "./extractors.js";
import { aggregateEntries } from "./aggregate.js";
import { mineTemplates, findRareEntries } from "./templateMiningClient.js";

const MAX_CONTENT_CHARS = 5_000_000; // ~5MB of text — matches the upload size ceiling with headroom
const MAX_LINES_FOR_MINING = 20_000; // mining is O(n) but each line does clustering work — cap for very large logs

export async function parseLogFile(log) {
  const content = await fs.readFile(log.storagePath, "utf-8");
  const truncated = content.slice(0, MAX_CONTENT_CHARS);

  let entries;
  switch (log.fileType) {
    case "json":
      entries = parseJsonEntries(truncated);
      break;
    case "csv":
      entries = parseCsvEntries(truncated);
      break;
    case "txt":
    case "log":
    default:
      entries = parseTextEntries(truncated);
      break;
  }

  const summary = aggregateEntries(entries);

  // Template mining runs as a supplementary pass on top of the regex
  // extraction above — never blocks or fails the parse if the service
  // is unreachable (see templateMiningClient.js).
  const miningEntries = entries.slice(0, MAX_LINES_FOR_MINING);
  const miningResult = await mineTemplates(miningEntries.map((e) => e.raw));
  const rareEntries = findRareEntries(miningEntries, miningResult);

  summary.templateAnomalies = {
    enabled: miningResult !== null,
    clusterCount: miningResult?.clusters.length ?? 0,
    rareLines: rareEntries.slice(0, 20),
  };

  return summary;
}
