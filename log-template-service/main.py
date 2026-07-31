import logging
from typing import List

from fastapi import FastAPI
from pydantic import BaseModel
from drain3 import TemplateMiner
from drain3.template_miner_config import TemplateMinerConfig

# Drain3 warns if it can't find a drain3.ini in the working directory —
# harmless (we configure it in code below), but noisy. Quiet it down.
logging.getLogger("drain3").setLevel(logging.ERROR)

MAX_LINES_PER_REQUEST = 50_000

app = FastAPI(title="Rakshak Log Template Service")


class MineRequest(BaseModel):
    lines: List[str]


class ClusterOut(BaseModel):
    clusterId: int
    template: str
    size: int


class MineResponse(BaseModel):
    lineClusters: List[int]
    clusters: List[ClusterOut]
    truncated: bool = False


def build_config() -> TemplateMinerConfig:
    config = TemplateMinerConfig()
    config.drain_sim_th = 0.4
    config.drain_depth = 4
    return config


@app.get("/health")
def health():
    return {"status": "ok", "service": "log-template-service"}


@app.post("/mine", response_model=MineResponse)
def mine(req: MineRequest):
    lines = req.lines
    truncated = len(lines) > MAX_LINES_PER_REQUEST
    if truncated:
        lines = lines[:MAX_LINES_PER_REQUEST]

    # Fresh, in-memory miner per request — this service does one-shot
    # clustering of a single log's lines, not cross-log persistent
    # learning. (A natural future extension: persist state per user so a
    # template common in someone's history but suddenly appearing once
    # elsewhere reads as more anomalous — out of scope for now.)
    miner = TemplateMiner(config=build_config())

    line_clusters: List[int] = []
    cluster_info = {}  # cluster_id -> {template, size} — last-write-wins, which is correct since size accumulates

    for line in lines:
        result = miner.add_log_message(line)
        cluster_id = result["cluster_id"]
        line_clusters.append(cluster_id)
        cluster_info[cluster_id] = {
            "template": result["template_mined"],
            "size": result["cluster_size"],
        }

    clusters = [
        ClusterOut(clusterId=cid, template=info["template"], size=info["size"])
        for cid, info in cluster_info.items()
    ]

    return MineResponse(lineClusters=line_clusters, clusters=clusters, truncated=truncated)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8001)
