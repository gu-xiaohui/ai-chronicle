---
title: 构建无向量 RAG 系统：无需嵌入、无需向量数据库
author: vixhal
date: 2026-03-27
category: Agent 设计
originalUrl: https://x.com/thevixhal/status/2037236399691489797
readTime: 20 分钟阅读
---

![封面](/images/articles/vectorless-rag-pageindex/cover.jpg)

在这篇文章中，我们将构建一个**无向量 RAG 系统**——使用分层页面索引，将文档转换为树结构，LLM 在树中逐层推理找到答案。

**不需要嵌入向量。不需要向量数据库。不需要相似性搜索。**

这就像你在现实中搜索信息——打开课本目录，找到章节，查看小节标题，直接跳到需要的那页。**PageIndex 的工作方式也一样。**

完整代码：[github.com/vixhal-baraiya/pageindex-rag](https://github.com/vixhal-baraiya/pageindex-rag)

## 计划

**Step 1：解析文档为层次树**

发送文档给 LLM，拆分为顶级章节。对足够长的章节（>300 词），再次发送给 LLM 拆分为子节。短章节保持为叶子，长章节变成有子节点的内部节点。

**Step 2：自底向上构建摘要**

遍历树（后序：子节点先于父节点）。每个叶子节点获得 LLM 生成的摘要。每个内部节点从子节点摘要构建摘要。根节点最终获得整个文档的摘要。

**Step 3：保存索引**

序列化树为 JSON 文件。这是索引——构建一次，重复使用。

**Step 4：通过树搜索检索**

查询时从根开始，展示 LLM 子节点的摘要，问哪个最相关。移动到该子节点，重复直到叶节点。叶节点的原始文本就是检索上下文。

**Step 5：生成答案**

将检索上下文和问题传给 LLM 获得答案。

## 架构

![索引时间](/images/articles/vectorless-rag-pageindex/index-flow.jpg)

索引时间：文档 → LLM 分段 → 树结构 → LLM 摘要 → JSON 索引

![查询时间](/images/articles/vectorless-rag-pageindex/query-flow.jpg)

查询时间：问题 → 从根遍历树 → 找到叶节点 → 叶内容 + 问题 → LLM → 答案

## 核心代码

### PageNode 数据结构

```python
@dataclass
class PageNode:
    title: str
    content: str      # 原始文本，叶子节点填充
    summary: str      # LLM 生成，索引器填充
    depth: int        # 0=根, 1=章节, 2=子节
    children: list    # 子节点列表
    parent: Optional["PageNode"] = None

    def is_leaf(self) -> bool:
        return len(self.children) == 0
```

### 文档解析器

两遍扫描。第一遍将整个文档拆分为顶级章节。第二遍对长章节（>300 词）拆分为子节。

```python
SUBSECTION_THRESHOLD = 300  # 词数

def _segment(text: str) -> list:
    """让 LLM 将文本拆分为逻辑段落"""
    prompt = f"""Split the following text into logical sections.
    Return JSON with "sections" key. Each item has:
    - "title": short title (5 words or less)
    - "content": the text belonging to this section
    Text: {text[:8000]}"""
    # 调用 LLM，返回结构化 JSON

def parse_document(text: str) -> PageNode:
    root = PageNode(title="root", ...)
    for item in _segment(text):
        node = PageNode(title=title, depth=1)
        if word_count > SUBSECTION_THRESHOLD:
            # 长章节：拆分为子节
            subsections = _segment(content)
            for sub in subsections:
                child = PageNode(title=..., depth=2)
                node.children.append(child)
        else:
            node.content = content  # 短章节：保持为叶子
        root.children.append(node)
    return root
```

### 摘要构建（后序遍历）

```python
def build_summaries(node: PageNode):
    # 后序遍历：子节点先于父节点
    for child in node.children:
        build_summaries(child)

    if node.is_leaf():
        node.summary = _summarize(node.content, node.title)
    else:
        # 从子节点摘要构建父节点摘要
        children_text = "\n\n".join(
            f"[{c.title}]: {c.summary}" for c in node.children
        )
        node.summary = _summarize(children_text, node.title)
```

### 树搜索检索

```python
def retrieve(query: str, root: PageNode) -> str:
    node = root
    while not node.is_leaf():
        if not node.children:
            break
        # LLM 读取子节点摘要，选择最相关的分支
        node = _pick_child(query, node)
    return node.content  # 叶节点的原始文本
```

每次查询只需 2-3 次 LLM 调用，每次约 50 token 上下文。**极快且极便宜。**

### 完整使用

```python
# 首次：构建索引
build_index("document.md")

# 之后：查询
print(ask("你的问题"))
```

## 索引长什么样

```json
{
  "title": "root",
  "summary": "文档涵盖退货、配送选项和账户设置。",
  "children": [
    {
      "title": "退货和退款",
      "summary": "退款在收到退货后14天内处理。",
      "content": "我们接受30天内的退货...",
      "depth": 1
    },
    {
      "title": "配送选项",
      "summary": "国内(3-5天)和国际配送(7-14天)。",
      "depth": 1,
      "children": [
        {
          "title": "国内配送",
          "summary": "标准配送3-5个工作日，通过USPS。",
          "content": "我们通过USPS国内配送...",
          "depth": 2
        },
        {
          "title": "国际配送",
          "summary": "国际订单通过DHL配送，7-14天到达。",
          "content": "国际配送支持50+国家...",
          "depth": 2
        }
      ]
    }
  ]
}
```

短章节保持为 depth-1 叶子。长章节（如"配送选项"）变成有子节点的内部节点。

## 常见问题

**LLM 总是选错分支** → 摘要太模糊。用更强的模型做 `_summarize` 或增加摘要详细度。

**LLM 分段位置不好** → 增加 `_segment` 的 `max_tokens`，或将文档拆分为 ~3000 词的块再分段。

**叶节点内容太长** → 降低 `SUBSECTION_THRESHOLD` 让更多章节被拆分为子节。

## 为什么选择无向量 RAG

| 传统向量 RAG | PageIndex（无向量 RAG） |
|---|---|
| 需要向量数据库 | 只需 JSON 文件 |
| 需要嵌入模型 | 不需要嵌入 |
| 语义相似性搜索 | 逻辑推理导航 |
| 可能检索到语义相似但不相关的内容 | 精确定位到正确的章节 |
| 基础设施复杂 | 零额外基础设施 |
| 搜索质量取决于嵌入质量 | 搜索质量取决于 LLM 推理能力 |

**无向量 RAG 最适合：**
- 结构化的知识密集型文档
- 需要精确检索而非模糊匹配的场景
- 想避免向量数据库基础设施开销的项目
- 文档内容经常更新的场景（只需重建 JSON 索引）

**局限性：**
- 对非结构化、碎片化内容不如向量搜索灵活
- 索引构建依赖 LLM 质量
- 树深度有限（通常 2-3 层）
