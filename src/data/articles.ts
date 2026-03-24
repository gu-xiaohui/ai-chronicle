const articles = [
  {
    slug: 'lessons-from-building-claude-code-skills',
    title: '构建 Claude Code 的经验：我们如何使用 Skills',
    author: 'Thariq',
    date: '2026-03-18',
    category: 'Claude Code',
    readTime: '15 分钟阅读',
    excerpt: 'Anthropic 团队分享了他们在 Claude Code 中大规模使用 Skills 的经验，包括 9 种 Skills 类型、制作技巧以及分发管理的最佳实践。',
    originalUrl: 'https://x.com/trq212/status/2033949937936085378',
    content: `
      <p>Skills 已成为 Claude Code 中使用最广泛的扩展点之一。它们灵活、易于制作，且分发简单。</p>
      
      <h2>Skills 的 9 种类型</h2>
      <ol>
        <li><strong>库和 API 参考</strong> - 解释如何正确使用库、CLI 或 SDK</li>
        <li><strong>产品验证</strong> - 描述如何测试或验证代码是否正常工作</li>
        <li><strong>数据获取和分析</strong> - 连接到你的数据和监控堆栈</li>
        <li><strong>业务流程和团队自动化</strong> - 将重复的工作流程自动化为一个命令</li>
        <li><strong>代码脚手架和模板</strong> - 为代码库中的特定功能生成框架样板代码</li>
        <li><strong>代码质量和审查</strong> - 在组织内强制执行代码质量并帮助审查代码</li>
        <li><strong>CI/CD 和部署</strong> - 帮助你在代码库中获取、推送和部署代码</li>
        <li><strong>运行手册</strong> - 接受症状，通过多工具调查，并生成结构化报告</li>
        <li><strong>基础设施运维</strong> - 执行例行维护和操作程序</li>
      </ol>

      <h2>制作 Skills 的技巧</h2>
      <ul>
        <li><strong>不要说显而易见的事</strong> - 专注于那些能推动 Claude 跳出常规思维方式的信息</li>
        <li><strong>建立 Gotchas 部分</strong> - 从常见失败点积累而来</li>
        <li><strong>使用文件系统和渐进式披露</strong> - Skill 是文件夹，可以包含脚本、资源、数据</li>
        <li><strong>避免过度限制 Claude</strong> - 给信息但保留灵活性</li>
        <li><strong>Description 字段是给模型看的</strong> - 描述何时触发</li>
      </ul>

      <blockquote>
        Skills 是 Agent 非常强大、灵活的工具，但现在还处于早期阶段，我们都在摸索如何最好地使用它们。
      </blockquote>
    `
  },
  {
    slug: 'claude-code-best-practices',
    title: 'Claude Code 最佳实践：从"能用"到"真的好用"',
    author: 'Mr Panda',
    date: '2026-03-23',
    category: 'Claude Code',
    readTime: '20 分钟阅读',
    excerpt: '作者分享了使用 Claude Code 大半年的实战经验，从 CLAUDE.md 配置、提示词技巧、Plan Mode、子 Agent 等多个维度总结了关键实践。',
    originalUrl: 'https://x.com/PandaTalk8/status/2035975664730575325',
    content: `
      <p>我用 Claude Code 大半年了，踩过的坑比写过的代码还多。这东西的上限远比我想象得高，但前提是你得知道怎么用。</p>

      <h2>核心建议</h2>
      <ol>
        <li><strong>写好 CLAUDE.md</strong> — 一次投入，每次对话都受益</li>
        <li><strong>给精确的指令</strong> — 目标 + 约束 + 验证标准</li>
        <li><strong>用 Plan Mode</strong> — 复杂任务先规划再动手</li>
        <li><strong>管理上下文</strong> — /clear、/compact、子 Agent</li>
        <li><strong>控制权限</strong> — deny 危险操作，allow 常用命令</li>
        <li><strong>频繁 commit</strong> — 保留回退能力</li>
      </ol>

      <h2>CLAUDE.md 的关键原则</h2>
      <ul>
        <li>写 Claude 从代码里读不出来的东西</li>
        <li>控制在 200 行以内</li>
        <li>不要放频繁变化的内容</li>
      </ul>

      <h2>提示词技巧</h2>
      <ul>
        <li>用 @ 引用具体文件</li>
        <li>贴截图和图片</li>
        <li>给验证标准</li>
        <li>明确"不要做"的事</li>
      </ul>

      <blockquote>
        Claude Code 的核心使用哲学：它是一个极其能干的协作者，但不是自动驾驶。方向盘始终在你手里。
      </blockquote>
    `
  },
  {
    slug: 'seeing-like-an-agent',
    title: '构建 Claude Code 的经验：像 Agent 一样思考',
    author: 'Thariq',
    date: '2026-02-28',
    category: 'Agent 设计',
    readTime: '12 分钟阅读',
    excerpt: '探讨了构建 Agent 时最困难的部分之一：设计其工具空间。通过类比数学问题求解中需要的工具，解释了如何根据模型的能力来设计工具。',
    originalUrl: 'https://x.com/trq212/status/2027463795355095314',
    content: `
      <p>构建 Agent 框架最困难的部分之一是构建其<strong>工具空间（Action Space）</strong>。</p>

      <p>为了让自己进入模型的心态，我喜欢想象被给到一个困难的数学问题。为了解决它，你需要什么工具？这取决于你自己的技能！</p>
      
      <ul>
        <li><strong>纸</strong> 是最低要求，但你会受限于手动计算</li>
        <li><strong>计算器</strong> 会更好，但你需要知道如何操作更高级的选项</li>
        <li><strong>电脑</strong> 是最快和最强大的选择，但你需要知道如何使用它</li>
      </ul>

      <h2>关键教训</h2>
      <ol>
        <li><strong>AskUserQuestion 工具</strong> - 三次尝试才找到最佳方案</li>
        <li><strong>Tasks 取代 Todos</strong> - 模型能力提升后，旧工具可能成为限制</li>
        <li><strong>搜索界面设计</strong> - 从 RAG 到 Grep，让 Agent 自己构建上下文</li>
        <li><strong>渐进式披露</strong> - 不添加工具也能扩展能力</li>
      </ol>

      <blockquote>
        经常实验，阅读你的输出，尝试新事物。像 Agent 一样思考。
      </blockquote>
    `
  }
]

export default articles
