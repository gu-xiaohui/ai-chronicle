---
title: 代理记忆：详细解析
author: Ramakrushna (ram)
date: 2026-03-27
category: Agent 设计
originalUrl: https://x.com/techwith_ram/status/2037499938574110770
readTime: 25 分钟阅读
---

![封面](/images/articles/agentic-memory-detailed-breakdown/cover.jpg)

想象一下，有一天你雇佣了一位才华横溢的自由职业者。第一天，她非常出色，发现了每个 bug，写了干净的文档，甚至提出了你没想过的改进建议。你印象深刻。

第二天，你走进来说："嘿，还记得我们昨天讨论的那个问题吗？"

她停顿了一下。看着你。微微一笑。"抱歉……什么问题？"

没有记忆。没有上下文。完全消失了。

你会像我写这篇文章时一样震惊。这正是大多数 LLM 的行为方式。每一次新的对话都是全新的开始。模型不知道你是谁，你们一起构建了什么，或者你几分钟前在另一个聊天窗口中讨论了什么。

对于一个简单的聊天机器人来说，这没问题。但对于一个**代理**——一个运行任务、做出决策并随时间改进的东西——这种失忆症是不可接受的。

因为真正的智能不仅仅是良好地回应。它是关于**记忆、学习和在已有基础上构建**。

记忆是将无状态系统转变为能够真正进化的东西的关键。

## 什么是代理记忆？

![概览](/images/articles/agentic-memory-detailed-breakdown/overview.jpg)

代理记忆不只是一件事。它更像是一个在幕后工作的系统——不同类型的存储、检索信息的方式，以及管理这一切的智能策略，让代理能够真正地随时间传递上下文。

核心理念很简单：**记忆不是在做一件事；它同时在做三件非常不同的事。**

- **连续性**是关于身份的。它是代理如何知道你是谁、你偏好什么以及你们已经一起构建了什么的方式。没有它，每次交互都感觉像从头开始。
- **上下文**是关于手头的任务。刚刚发生了什么，使用了什么工具，返回了什么结果，接下来需要做什么。它是防止多步工作流崩溃的东西。
- **学习**是关于变得更好。理解什么有效、什么无效，并慢慢随时间改进决策，而不是重复同样的错误。

综合起来，它使代理感觉一致、可靠，并在每次交互中都变得更智能一些。

## 四种记忆类型

![记忆类型](/images/articles/agentic-memory-detailed-breakdown/memory-types.jpg)

该领域已经收敛到四种不同的记忆类型。把它们想象成大脑的四个不同部分，每个都为特定的工作而进化。

### 1. 上下文内记忆

![上下文内记忆](/images/articles/agentic-memory-detailed-breakdown/in-context.jpg)

上下文窗口是代理的工作台。上面的所有东西都可以立即访问。模型可以在单次前向传递中对其进行推理。不需要检索步骤。

但工作台有大小限制。每个 token 都花费金钱和时间。当会话结束时，工作台会被清空。

**上下文中的内容：**

- **系统提示**：代理人格、规则、能力、当前日期/用户信息
- **对话历史**：本次会话到目前为止的来回对话
- **工具调用结果**：代理刚刚调用的工具的输出
- **检索到的记忆**：从外部存储拉入的块
- **草稿本**：中间推理（逐步思考输出）

**滑动窗口问题**

在长对话中，历史不断积累，最终会溢出上下文限制。截断最旧消息的朴素解决方案会丢失重要的早期上下文。更好的策略：

- **摘要化**：定期将旧的回合压缩为简短摘要并替换
- **选择性保留**：保留包含关键事实、决策或工具结果的回合；丢弃闲聊
- **卸载到外部记忆**：将重要事实提取到向量存储中，然后按需检索

### 2. 外部记忆

![外部记忆](/images/articles/agentic-memory-detailed-breakdown/external.jpg)

外部记忆是任何在模型之外持久化的东西——数据库、向量存储、键值存储和文件。它跨越会话边界。如果存储得当，你的代理可以记住六个月前的事情。

外部存储有两种风格：

**结构化存储（精确查找）**：PostgreSQL、Redis、SQLite。按键、ID 或 SQL 查询。快速、可预测，非常适合用户配置文件、偏好设置和结构化数据。

**向量存储（语义搜索）**：Pinecone、Chroma、pgvector。按含义查询，"找到与此概念相似的记忆。"对非结构化笔记和情景回忆至关重要。

检索步骤是一个瓶颈。如果你不检索正确的记忆，代理就会表现得好像它们不存在一样。**良好的记忆架构是 20% 的存储和 80% 的检索设计。**

### 3. 情景记忆

情景记忆是最被低估的类型。虽然外部记忆存储事实，但情景记忆存储**事件**——具体来说，是过去行动的结果。

最简单的形式是结构化日志：每次代理完成任务时，它记录发生了什么。随着时间的推移，这个日志成为代理在做出决策之前可以查阅的丰富自我知识来源。

**一个情景的样子：**

```json
{
  "episode_id": "ep_20240315_003",
  "timestamp": "2024-03-15T14:23:11Z",
  "task": "将50页PDF总结为3个要点",
  "approach": "顺序分块，每块2000个token",
  "outcome": "成功",
  "duration_ms": 4820,
  "token_cost": 12400,
  "quality_score": 0.91,
  "notes": "效果良好。层次分块会更快。",
  "embedding": [0.023, -0.441, 0.182]
}
```

当新任务到来时，代理检索语义最相似的过去情景，并使用它们来选择策略。这本质上是从个人历史中进行少样本学习，而不是从手工制作的数据集中学习。

![反思循环](/images/articles/agentic-memory-detailed-breakdown/reflection.jpg)

### 4. 语义/参数记忆

这是模型与生俱来的记忆。所有内容都在训练期间编码在权重中——关于世界的事实、语言模式、推理策略、编码约定和文化知识。

它始终存在。代理永远不需要检索它。但它有严格的限制：

- **在训练时冻结**：模型不知道截止日期之后发生了什么
- **无法在运行时更新**：你不能在不重新训练或微调的情况下注入新的永久事实
- **不透明**：你无法确切检查模型"知道"或不知道什么
- **容易产生幻觉**：模型用看似合理但错误的补全来填补空白

对于任何时间敏感、领域特定或私密的内容，不要依赖参数记忆。使用外部检索。

**正确的思维模型**：参数记忆是代理的通识教育。外部、情景和上下文内记忆是代理的在职经验。最好的代理结合两者。

## 记忆如何在代理循环中流动？

![记忆流](/images/articles/agentic-memory-detailed-breakdown/flow.jpg)

让我们把所有东西放在一起。以下是代理每次处理请求时发生的事情——展示每个记忆系统的运作。

注意记忆操作位于 LLM 调用的两端：之前检索，之后写入。模型本身是无状态的；记忆系统是赋予有状态、有意识的代理幻觉的东西。

## 构建记忆层

让我们构建这个。我们将使用 Python 和 OpenAI 进行嵌入，ChromaDB 作为本地向量存储。相同的概念适用于任何其他技术栈——只需更换库。

### MemoryStore 类

处理写入记忆（带嵌入）和语义检索。它是其他一切的基础。

```python
import chromadb
from openai import OpenAI
from datetime import datetime
import json, uuid

class MemoryStore:
    """AI 代理的持久化向量记忆。"""

    def __init__(self, agent_id: str, persist_dir: str = "./memory_db"):
        self.agent_id = agent_id
        self.openai = OpenAI()
        self.client = chromadb.PersistentClient(path=persist_dir)
        self.collection = self.client.get_or_create_collection(
            name=f"agent_{agent_id}_memories",
            metadata={"hnsw:space": "cosine"}
        )

    def _embed(self, text: str) -> list[float]:
        """使用 OpenAI 将文本转换为嵌入向量。"""
        response = self.openai.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding

    def remember(self, content: str, memory_type: str = "general",
                 metadata: dict = None) -> str:
        """存储一条记忆。返回记忆 ID。"""
        memory_id = str(uuid.uuid4())
        embedding = self._embed(content)
        meta = {
            "type": memory_type,
            "timestamp": datetime.utcnow().isoformat(),
            "agent_id": self.agent_id,
            **(metadata or {})
        }
        self.collection.add(
            ids=[memory_id],
            embeddings=[embedding],
            documents=[content],
            metadatas=[meta]
        )
        return memory_id

    def recall(self, query: str, k: int = 5,
               memory_type: str = None,
               min_relevance: float = 0.6) -> list[dict]:
        """检索与查询最相关的 k 条记忆。"""
        query_embedding = self._embed(query)
        where = {"type": memory_type} if memory_type else None
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=k,
            where=where,
            include=["documents", "metadatas", "distances"]
        )
        memories = []
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0]
        ):
            relevance = 1 - dist
            if relevance >= min_relevance:
                memories.append({
                    "content": doc,
                    "metadata": meta,
                    "relevance": round(relevance, 3)
                })
        return sorted(memories, key=lambda x: x["relevance"], reverse=True)
```

### EpisodicLogger 类

现在让我们在顶层添加情景日志。

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class Episode:
    task: str
    approach: str
    outcome: str  # "success" | "partial" | "failure"
    duration_ms: int
    token_cost: int
    quality_score: float  # 0.0 – 1.0
    notes: str = ""
    error: Optional[str] = None

class EpisodicLogger:
    def __init__(self, memory_store: MemoryStore):
        self.store = memory_store

    def log(self, episode: Episode):
        """将情景保存到记忆中作为可搜索的文档。"""
        doc = (
            f"任务: {episode.task}\n"
            f"方法: {episode.approach}\n"
            f"结果: {episode.outcome}\n"
            f"备注: {episode.notes}"
        )
        self.store.remember(
            content=doc,
            memory_type="episode",
            metadata={
                "outcome": episode.outcome,
                "quality_score": episode.quality_score,
                "duration_ms": episode.duration_ms,
                "token_cost": episode.token_cost,
            }
        )

    def recall_similar(self, task: str, k: int = 3) -> list[dict]:
        """查找与当前任务相似的过去情景。"""
        return self.store.recall(
            query=task, k=k,
            memory_type="episode",
            min_relevance=0.65
        )
```

## 向量数据库

这是任何严肃记忆系统的核心。与 SQL 的精确匹配查询不同，它找到高维空间中向量的最近邻居。这就是实现语义搜索的方式——找到概念上相关的记忆，即使它们不共享任何词汇。

### 相似性搜索如何工作

每条记忆都被转换为向量（使用 OpenAI 的嵌入模型，是一个 1,536 个浮点数的数组）。概念上相似的文本产生相似的向量。查询时，你嵌入查询并使用余弦相似度找到最接近的向量。

```python
import numpy as np

def cosine_similarity(a: list, b: list) -> float:
    """
    1.0 = 相同含义
    0.0 = 无关
    -1.0 = 相反含义
    """
    a, b = np.array(a), np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
```

本地开发从 ChromaDB 开始。部署时，如果你已经在 Postgres 上，评估 pgvector。需要大规模时使用 Pinecone 或 Qdrant。

## 记忆管理

真正的记忆系统不只是积累。它们策展。一个不断增长、不聚焦的存储会随时间退化——检索变得更嘈杂，延迟上升，矛盾的记忆混淆代理。

你需要一个遗忘策略。以下是三种主要方法：

### 1. 基于时间的衰减

较旧的记忆不太相关。按新近度和语义相关性的组合来评分记忆。

```python
import math
from datetime import datetime

def memory_score(
    relevance: float,      # 余弦相似度 0-1
    importance: float,     # 写入时存储 0-1
    created_at: datetime,  # 记忆形成时间
    recency_weight: float = 0.3,
    decay_factor: float = 0.995
) -> float:
    """灵感来自 Generative Agents 论文 (Park et al., 2023)。"""
    hours_old = (datetime.utcnow() - created_at).total_seconds() / 3600
    recency = math.pow(decay_factor, hours_old)
    return (relevance * 0.4 + importance * 0.3 + recency * recency_weight)
```

### 2. 写入时的重要性评分

存储记忆时，让模型对自己的输出进行重要性评分。只存储高评分的项目。这从源头过滤噪音。

### 3. 定期整合

运行夜间作业，将重复或高度相似的记忆合并为单个规范摘要。这类似于人类睡眠如何巩固记忆。

## 最后的思考

归根结底，记忆是让 AI 感觉更像伙伴而不是工具的东西。没有它，每次交互都从零开始。有了它，代理可以理解、适应并随时间改进。

真正的力量不仅仅在模型中；而在于你如何设计模型记住什么、忘记什么以及如何使用这些信息。

**把记忆层设计好，其他一切都会变得更智能。**
