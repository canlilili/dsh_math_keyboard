# 数学符号键盘（math-symbol-keyboard）

> A DeepSeek Harness (DSH) Web UI plugin: a math / Greek / LaTeX symbol keyboard for the conversation composer,
> with a KaTeX-typeset preview, clickable argument placeholders, a formula draft area, matrix & determinant templates,
> and a Unicode-vs-LaTeX output switch. UI text is bilingual (zh / en).
>
> **Install (DSH profile):** clone this repository, then add the bundle from the clone path with the Harness plugin
> manager (`install_bundle`). After editing `src/client.source.js`, run `node build.mjs` to regenerate `client.js`.

在 DSH Web 对话输入框的工具行（发送按钮左侧的紧凑控件区）新增一个 `∑` 按钮。
点击后在输入框上方弹出 MS Word「公式/符号」风格的面板：6 个分类标签（希腊字母 / 运算符 / 微积分 /
三角 / 箭头逻辑 / 矩阵）、网格化符号按钮、**KaTeX 排版预览（空括号显示为可点的虚线方块）**、
公式草稿输入框与插入按钮。点符号即可插入光标处；需要长公式时点进草稿区拼装，在预览里确认排版，
必要时点虚线方块直接定位到对应参数，最后点「插入」整段写入输入框。

```
输入框工具行:  [ 权限 ] … [ 附件 ] [ 模型 ] [ ∑ ] [ 发送 ]
                                    │
           ┌────────────────────────┴─────────────────────────┐
           │ 希腊字母 | 运算符 | 微积分 | 三角 | 箭头逻辑 | 矩阵│
           │ sin cos tan cot … | ° ′ ″  (6 列网格，可滚动)      │
           │ ─────────────────────────────────────────────── │
           │ 排版预览                    2 个待填参数，点方框可定位 │
           │            a   ⌈ ⌉   ⌊ ⌋  ← 排版后的公式          │
           │ 公式草稿                                 清空     │
           │ [ \frac{a}{b} + \int_{0}^{1} x^{2}\,dx        ] │
           │ 符号会追加到草稿…                        [ 插入 ] │
           └──────────────────────────────────────────────────┘
```

两种用法都在同一个面板里：

- **组装公式（默认）**：点 `∑` 打开面板时光标自动进入草稿区；点符号、直接打字都进草稿，预览实时排版，
  空 `{}` 显示成虚线方块，点方块把草稿光标送进对应括号；确认后点「插入」（或 Ctrl+Enter）→
  整段草稿作为一次可撤销编辑写入输入框，面板收起、光标交还输入框。
- **直接插入**：在面板打开时点回输入框（点击输入卡片**不会**收起面板，只在点卡片外部才收起），
  焦点回到输入框后，点符号就直接写进输入框光标处，可连续点；再点草稿框又能切回草稿组装。

草稿区右下角「插入」按钮旁边有一个 **Unicode 开关**：关闭（默认）时符号插入 `\alpha`、`\times` 这类
LaTeX 命令；打开后符号直接插入字符本身（`α`、`×`、`≤`），模板（分式、根号、积分等）仍插入 LaTeX，
因为它们需要占位括号。

## 目录结构

| 文件 | 职责 |
| --- | --- |
| `src/client.source.js` | **可编辑源码**：语言字典、符号字典、输入桥、KaTeX 预览、UI 与自包含 CSS、slot 挂载 |
| `client.js` | **生成产物**（由 `build.mjs` 把 `third_party/katex.min.js` 拼进源码），浏览器加载的就是它 |
| `build.mjs` | `node build.mjs`：把 KaTeX UMD 源注入源码标记，重写 `client.js` |
| `third_party/katex.min.js` | KaTeX 0.16.22 渲染器（MIT，见 `third_party/katex-LICENSE.txt`）|
| `index.js` | Host 半边（空实现）：只让 bundle 可被激活，从而加载浏览器模块 |
| `cordis.patch.yml` | 向 profile 插入一行 `math-symbol-keyboard` |
| `locale/{en,zh}.json` | 插件管理页显示用的标题/描述 |
| `icon.svg` | 原创图标（蓝色键盘底 + Σ）|

> `client.js` 是生成文件：改功能请改 `src/client.source.js`，然后执行 `node build.mjs`。
> 直接改 `client.js` 会在下次构建时被覆盖。

## 一、关键挂载节点与选择器（DOM 更新时改这里）

本插件**不靠 CSS 选择器找输入框来挂载**：挂载点是宿主声明的 Slot 座位，因此不受官网 DOM 结构变化影响。
只有「把光标移进 `{}`」这一步需要读 DOM。

### 1. 按钮与面板的挂载座位（`client.js` → `apply()`）

```js
ctx.slots.inject('conversation.input.right', () => ctx.slots.register({
  name: 'conversation.input.right',   // ← 座位键（改这里可换位置）
  id: 'math-keyboard',
  order: 36,
  locale: NS,
}, MathKeyboard))
```

- `conversation.input.right`：输入框工具行里、发送按钮之前的紧凑控件区（会话作用域，无会话时不渲染）。
- 可选替代座位（用 `cordis_inspect_query` 的 `Slots.listSubTree` 可复核）：
  - `conversation.input.left`：工具行左侧，若希望键盘按钮靠左。
  - `conversation.input.overlay`：输入卡片内的浮层（宿主自带的斜杠菜单也在这里）；适合把面板改成卡片内浮层。
  - `conversation.composer.dock`：输入卡片下方的环境条目（若只需要一个静态入口）。
- **什么时候需要微调**：只有宿主重命名 / 删除该 Slot 时才需要换键；插件不会因为没有 DOM 元素而挂不上。
  换键后检查：`Slots.listSubTree(root: '新座位键')` 里能看到 `math-keyboard` 这条 occupant。

### 2. 编辑器元素选择器（`client.js` → `EDITOR_SELECTOR`）

```js
const EDITOR_SELECTOR =
  '[contenteditable="true"][data-lexical-editor="true"], [contenteditable="true"]'
```

- 插入文本**不需要**它；它只用于模板插入后把光标左移到第一个 `{}` 内（以及插入后把焦点交还输入框）。
- 查找顺序：从本按钮向上找最近的、内部含 contenteditable 的祖先（即输入卡片），失败再退回
  `document.querySelector(EDITOR_SELECTOR)`。
- **什么时候需要微调**：宿主改用别的富文本编辑器、或不再给根元素 `data-lexical-editor` 时。
  第一段选择器失效会自动落到第二段；两者都失效则仅「光标进括号」退化为「光标停在模板末尾」，插入本身仍正常。
- 若编辑器异步挂载（切会话瞬间），`waitForEditor()` 用 `MutationObserver` 等最多 600ms 再补光标定位——
  这就是需求里的「DOM 等待机制」，但等待的是光标定位所需的元素，不是挂载点。

### 3. 写入通道（`client.js` → `insertToComposer()`）

```js
const span = inputActions.captureInsertion()   // 快照光标/选区 + 草稿版本号
inputActions.insertText(text, span)            // 一次可撤销的普通文本编辑
```

- 这是宿主提供的 composer API（`InputActions`），**不是**直接改 DOM 或派发 `InputEvent` / `change`：
  DSH 的输入框是 Lexical 受控编辑器，直接改 DOM 会被编辑器状态覆盖，而 `insertText` 走的是
  「编辑器自身的可撤销编辑」，前端数据流（草稿持久化、发送按钮可用性）会自动跟上。
- `insertText` 返回 `false` 表示此刻不可编辑（提交中 / 版本已变）；面板底部会提示「输入框当前不可编辑」。
- 草稿提交时优先用「点进草稿那一刻记住的 span」（清空草稿区之前输入框的光标）；宿主编辑器失焦会清空
  选区，所以这一层记忆是必要的。若版本已变，`insertToComposer` 会自动用当前光标重试一次。
- **什么时候需要微调**：宿主改 `InputActions` 契约时只改 `insertToComposer()` 这一段。

## 二、扩展符号字典

所有符号都在 `client.js` 的「Layer 2 — the symbol data dictionary」里，两个工厂函数：

```js
sym(glyph, latex, name)            // 单个符号
tmpl(glyph, latex, name, caret?)   // 带占位括号的模板
```

- `glyph`：按钮上显示的字形（例如 `α`、`∫`、`a⁄b`）。
- `latex`：实际插入的文本（`\alpha`、`\int_{}^{}`）。
- `name`：悬停预览条与 `title` / `aria-label` 里的英文名称，便于检索。
- `caret`：仅模板用。默认取第一个 `{` 之后的位置（即光标落进第一组 `{}`）；
  也可显式给绝对下标，例如 `tmpl('()', '\\left( \\right)', 'parentheses', 6)`。

**加一个符号**（一行）：

```js
const OPERATORS = [
  // …
  sym('≅', '\\cong', 'congruent'),
]
```

**加一个模板**：

```js
tmpl('∑', '\\sum_{k=0}^{\\infty}', 'infinite series')   // 光标落进第一组 {}，即 k=0 处
```

**让某个位置变成"参数"而不是写死的字符**：把那个字符换成空的 `{}`。

```js
tmpl('ⁿ', '^{}', 'superscript')   // 只有一个参数（指数），自动挂在光标前一个字符上
tmpl('ₙ', '_{}', 'subscript')     // 同上，下标
tmpl('∑', '\\sum_{}^{}', 'summation with bounds')   // 上下限都是参数，各一个方块
tmpl('∏', '\\prod_{}^{}', 'product with bounds')
tmpl('a⁄b', '\\frac{}{}', 'fraction')               // 分子、分母各一个方块（只在运算符页）
```

上标/下标**不再带空底数**：插入 `^{}` / `_{}` 时 TeX 会把它挂到前一个记号上，
所以光标停在 `x` 后面点一下就得到 `x^{}`，只需填指数；预览里只有一个方块。
若直接在空行点，会得到没有底数的上标（TeX 允许，稍后补个字母即可）。

同理，原来写死 `i=1`、`n` 的求和/求积上下限已改成空括号；无上下限的 `\sum` / `\prod`
仍保留（行内求和、求积用），四个条目都在「微积分」标签页里。

极限与对数/最值也按同一规则补齐（每个参数一个方块，光标默认落在第一个）：

| 按钮 | 插入内容 | 参数 |
| --- | --- | --- |
| `lim` | `\lim_{}{}` | 趋近条件 + 表达式 |
| `min` | `\min_{}{}` | 取值域 + 表达式 |
| `max` | `\max_{}{}` | 取值域 + 表达式 |
| `log` | `\log_{}{}` | 底数 + 真数 |
| `log` | `\log{}` | 真数 |
| `ln` | `\ln{}` | 真数 |

**上标类重音（accent）**：`\vec{}`（箭头）、`\ddot{}`（双点）、`\hat{}`（帽形/乘幂）、`\dot{}`（单点）、
`\overline{}`（上划线）都只有一个参数——参数就是被加帽的表达式，插入后光标落在 `{}` 内。
它们和分式一起只放在**「运算符」页**的「分式与重音」分组里（不再跨页重复）。

> 箭头按钮的图标用内联 SVG 画（`VECTOR_ICON`），而不是文本字符：合成箭头 `U+20D7`
> 在部分系统 UI 字体里缺字形，会显示成"a□"。`glyph` 字段既可以放字符串，也可以放 React 节点；
> 其余按钮仍是文本字形。

### 分组与去重（`group()` / `stackGlyph()`）

每个标签页的网格用 `group('group.x')` 插入一行小标题（`grid-column:1 / -1`，右侧接一条细线），
把符号按语义分段：

| 标签页 | 分组（符号数） |
| --- | --- |
| 希腊字母 | 小写 27、大写 11 |
| 运算符 | 算术 9、关系 9、集合 9、其他 9、分式与重音 6 |
| 微积分 | 积分 4、求和与连乘 4、极限与对数 6、根号与括号 4、上下标与结构 4 |
| 箭头逻辑 | 箭头 13、逻辑 11 |
| 矩阵 | 25 个矩阵 + 5 个行列式（单页不分组）|

去重规则：

- 同一个 LaTeX 字符串只出现一次，**跨标签页也算重复**：分式与全部重音统一收在「运算符」页。
- 视觉相同但插入内容不同的条目保留，用复合字形 `stackGlyph()` 区分：
  `∫` / `∫ₐᵇ`、`∑` / `∑ᵢ₌₁ⁿ`、`∏` / `∏ᵢ₌₁ⁿ`、`log` / `log_a`、`√` / `√[n]`（都是 HTML `sup`/`sub`，不依赖特殊 Unicode）。
- 字形重复而语义不同的 `⊥`（`\perp` 与 `\bot`）只保留「运算符」页的 `\perp`，删掉了箭头页的 `\bot`。


### 三角标签页（`TRIG`）

| 分组 | 按钮 | 插入内容 | 参数 |
| --- | --- | --- | --- |
| 基本函数 | `sin` `cos` `tan` `cot` `sec` `csc` | `\sin{}` … `\csc{}` | 各一个（函数自变量）|
| 反函数 | `sin⁻¹` `cos⁻¹` `tan⁻¹` `cot⁻¹` `sec⁻¹` `csc⁻¹` | `\arcsin{}` … `\arccsc{}` | 各一个 |
| 度分秒 | `°` `′` `″` | LaTeX 模式插入 `^{\circ}` / `'` / `''`；Unicode 模式插入 `°` / `′` / `″` | 无（跟在数字后自动成为上标/角分/角秒）|

反函数按钮的 `⁻¹` 用 `stackGlyph('sin', '-1')` 的 HTML `sup` 画，不依赖上标 Unicode 字符；
度分秒三个条目是 `sym()`，所以「Unicode 直插」开关对它们同样生效。

### 矩阵标签页（`MATRICES`）

`matrixLatex(rows, cols, env)` 生成 `\begin{pmatrix}…\end{pmatrix}` / `\begin{vmatrix}…\end{vmatrix}`，
**每个单元格都是空组 `{}`**，因此预览里每个格子都是一个可点方块；`matrixItem()` 把光标指向第一个单元格
（不能复用 `tmpl` 的"第一个 `{`"默认值——那是 `\begin{pmatrix}` 的参数）。

| 按钮 | 插入内容 | 数量 |
| --- | --- | --- |
| `1×1` … `5×5` | `\begin{pmatrix}…\end{pmatrix}` | 25（行优先，1×1 → 1×5 → 2×1 → … → 5×5）|
| `|1×1|` … `|5×5|` | `\begin{vmatrix}…\end{vmatrix}` | 5（仅方阵）|

行列为 `r×c` 时单元格数 = `r*c`，5×5 即 25 个参数方块。行列式只给 n×n：非方阵的行列式没有定义，
所以没有 1×2、2×3 之类的"行列式"按钮（想要也能加，但数学上无意义）。要换矩阵括号样式，
把 `env` 改成 `bmatrix`（方括号）或 `matrix`（无括号）即可。

**加一个新分类（第 5 个 Tab）**：

```js
const CATEGORIES = [
  // … 现有 4 个
  { id: 'sets', labelKey: 'tab.sets', items: SETS },   // SETS = [sym(...), tmpl(...)]
]
```

再在 `client.js` 顶部的 `zh` / `en` 字典里加 `'tab.sets'` 文案（`t()` 会按当前语言取词；
缺键时会退回 en 字典再退回键名本身）。面板宽度、网格列数在 `STYLES` 里：
`.dsh-mathkb-panel{width:372px}`、`.dsh-mathkb-grid{grid-template-columns:repeat(6,…)}`。

**Unicode 直插开关**（面板里「插入」旁边的开关）：

- 关闭（默认，`DEFAULT_UNICODE_MODE = false`）：符号插入 LaTeX 命令（`\alpha`、`\times`）。
- 打开：`sym()` 条目插入它的 `glyph` 字符（`α`、`×`、`≤`），模板仍然插入 LaTeX。
- 想让某个符号在 unicode 模式下插入别的字符，给条目补 `unicode` 字段即可（`sym()` 默认用 `glyph`）。
- 想改默认值：`src/client.source.js` 顶部 `const DEFAULT_UNICODE_MODE = true`。

## 三、交互细节

| 行为 | 实现 |
| --- | --- |
| 点击 `∑` 展开/收起 | `aria-expanded` + `aria-haspopup="dialog"`，按钮本身不抢焦点（`mousedown.preventDefault()`）|
| 标签栏不挤压 | 6 个标签用 `flex-wrap:wrap` + `gap:4px`，放不下就换行，**不使用横向滚动**；选中态只改背景与内描边（不改字号/字重），所以切换分类不会改变任何标签的宽度 |
| 打开时自动聚焦草稿 | 打开瞬间先记住输入框光标，再由 effect 把焦点与光标移到草稿末尾；`draftActive` 随之变真 |
| 点击输入卡片不收起 | 关闭判定用 `composerCardOf(root)`：目标在输入卡片内（含输入框、发送键）时保持面板打开 |
| 点击页面空白收起 | 打开时在 `document` 上挂捕获阶段 `pointerdown`，目标既不在面板也不在输入卡片内才关闭 |
| Esc 收起 | 同上，捕获阶段 `keydown` |
| 连续插入不关闭 | 只有上述关闭路径；每次插入前重新 `captureInsertion()` 或按草稿光标追加 |
| 插入后光标进 `{}` | 模板按 `caretIndex` 计数向左派发 `ArrowLeft`（Lexical 的 keydown 命令），落到第一组大括号内 |
| 插入后可继续打字 | 插入后把焦点交还输入框（`focusEditor`），键盘输入直接落到草稿 |
| 悬停预览 | 草稿区左下角显示 `名称 · 插入内容`（内容随 Unicode 开关变化）；按钮同时带原生 `title` 提示 |
| 深浅色自适应 | 仅使用 `--dsw-alias-*` 主题令牌；面板投影由 `color-mix(label-primary 18%, transparent)` 派生 |
| 样式隔离 | 所有类名带 `dsh-mathkb-` 前缀，样式以 React `<style>` 元素随组件挂载/卸载，不污染全局 |
| 资源回收 | 关闭/卸载时移除 document 监听、清理提示定时器；slot 注册由 ctx.effect 自动回收 |

### 公式草稿区的规则

| 规则 | 说明 |
| --- | --- |
| 符号去向 | 草稿文本框有焦点时（打开面板后的默认状态），符号追加到**草稿**（在草稿光标/选区处，模板按 `caretIndex` 移位）；点回输入框后焦点离开草稿，符号改为插入输入框 |
| 草稿输入 | 可直接键入、粘贴、选中替换；`Ctrl+Enter` / `Cmd+Enter` 等于点「插入」 |
| 插入 | 整段草稿作为**一次**可撤销编辑写入输入框；随后清空草稿、收起面板、焦点回到输入框 |
| 换行 | 提交前把 `\s*\n\s*` 折叠成一个空格——LaTeX 数学里空白无意义，也避免把裸换行塞进 Lexical 文本节点 |
| 光标记忆 | 宿主的编辑器在失焦时会清空选区，所以点进草稿的 `mousedown` 会先记住输入框光标；提交时优先复用这个 span，若草稿版本已变则回退到当前光标（`insertText` 返回 `false` 时自动重试一次） |
| 草稿生命周期 | 面板收起再打开时草稿保留（同一会话内），「清空」显式丢弃；切换会话会重挂载组件并清空 |
| 快捷键隔离 | 草稿的 `keydown` 做 `stopPropagation()`，避免触发宿主的全局快捷键；Esc 由 document 捕获阶段处理，仍然生效 |

### 排版预览与参数方块

| 规则 | 说明 |
| --- | --- |
| 渲染时机 | 草稿每次变化都用 `katex.renderToString(..., { displayMode: true, throwOnError: false })` 重排；HTML 经 `dangerouslySetInnerHTML` 注入预览区 |
| 空括号变方块 | `scanPlaceholders()` 找出草稿里未被转义的空 `{}`；渲染时只替换**括号内的空内容**，外层花括号保留（`\frac{}{}` 去掉括号会变成缺参），替换成 `\htmlClass{dsh-mathkb-slot dsh-mathkb-slot-<i>}{\phantom{00}}` |
| 点方块定位参数 | 方块类名带序号，点击时读序号 → `slots[i]`（草稿偏移）→ 光标落在 `{` 与 `}` 之间。**不依赖 DOM 顺序**（分式的分母在 DOM 里排在分子之前，序号类名避免了错位） |
| 安全 | KaTeX 的 `trust` 只允许 `\htmlClass`，用户写 `\href{javascript:…}` 之类不会生成链接或内联 HTML |
| 样式来源 | 宿主前端样式表已含 KaTeX CSS 与字体（`vendor-*.css` 的 `@font-face` 指向 `assets/fonts/`），所以插件只内置 JS、不再打包 CSS；若将来宿主移除该样式，预览会退化成无排版 HTML，届时需把 katex.css 打包并处理字体路径 |
| 居中与留白 | 预览体 `display:flex` + `align-items/justify-content: safe center`：短公式双向居中，超宽时退回起始边而非被裁掉；上下 16px 内边距给上标方块的描边留出空间（`overflow:auto` 的滚动容器只能显示内容盒范围内的像素，内容盒之上会被裁切且无法滚动到） |
| 排版失败 | `throwOnError: false` 时 KaTeX 把出错片段标红继续显示；真正抛异常时显示「无法排版」提示，草稿原文不受影响 |
| 版本 | 内置 KaTeX 0.16.22（MIT）。换版本：替换 `third_party/katex.min.js` 后 `node build.mjs` |


## 四、验证状态

- `client.js` / `src/client.source.js` 通过 `node --check`；三个 JSON 通过 `JSON.parse`。
- 排版管线在 Node 里用**同一份**内置 KaTeX 跑过一组用例（`\frac{}{}`、`\int_{}^{}`、`\sqrt[n]{}`、
  `\binom{}{}`、`\left( \right)` 等）：空组数量与序号标记一一对应、`\href` 被 `trust` 拦下。
- `Slots.listSubTree(root: 'conversation.input.right')` 显示 occupant `math-keyboard`，`order: 36`。
  这个序号是「新代码是否已加载」的探针：构建后序号 +1 且实时 Client 立刻回报，说明新模块已被 HMR 重新注册；
  模块级 `const katex = …` 也随加载执行，因此 KaTeX 在本页环境里初始化成功。
- 本次环境没有浏览器控制能力，**预览排版观感、方块点击、插入落点、深浅色表现未经真人视觉验证**；
  这部分需在页面里点一遍确认。若面板里看不到预览区或仍是旧布局，先刷新页面；仍无则重启 DSH。

