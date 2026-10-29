window.__ModuleLoader__.load({
  id: '@local/math-symbol-keyboard',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /**
     * Vector-accent icon. The combining arrow (U+20D7) is missing from some UI
     * fonts and renders as a tofu box, so this accent is drawn instead of
     * written as text; every other entry keeps a text glyph.
     */
    const VECTOR_ICON = h('svg', {
      viewBox: '0 0 24 24',
      width: 18,
      height: 18,
      'aria-hidden': 'true',
      focusable: 'false',
    },
      h('path', {
        d: 'M5 19h14',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
      }),
      h('path', {
        d: 'M5 10.5h13M14.5 6.5l4 4-4 4',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }))

    /**
     * Composite glyph for the few families that share a base symbol but insert
     * different LaTeX (∫ vs ∫ₐᵇ, ∑ vs ∑ᵢ₌₁ⁿ, log vs log_a). `sup`/`sub` are
     * plain text, so no font-specific Unicode marks are needed.
     */
    function stackGlyph (base, sup, sub) {
      return h('span', { className: 'dsh-mathkb-stack' },
        base,
        sup !== undefined ? h('sup', null, sup) : null,
        sub !== undefined ? h('sub', null, sub) : null)
    }

    /* ------------------------------------------------------------------ *
     * Vendored KaTeX 0.16.22 (MIT, https://katex.org) — typeset preview.
     * The Web page already ships KaTeX's stylesheet and fonts, so only the
     * renderer is embedded here. `build.mjs` splices the UMD source into the
     * marker below; never paste it by hand.
     * ------------------------------------------------------------------ */
    const katex = (function () {
      const module = { exports: {} }
      const exports = module.exports
      /*__KATEX_UMD__*/
      return module.exports
    })()

    /* ================================================================== *
     * Layer 1 — locale dictionaries (all user-visible text)
     * ================================================================== */

    const NS = 'math-keyboard'

    const zh = {
      'panel': '数学符号键盘',
      'open': '打开数学符号键盘',
      'close': '关闭数学符号键盘',
      'tab.greek': '希腊字母',
      'tab.operators': '运算符',
      'tab.calculus': '微积分',
      'tab.arrows': '箭头逻辑',
      'tab.trig': '三角',
      'tab.matrices': '矩阵',
      'hint': '单击符号插入到光标处，可连续插入',
      'insertFailed': '输入框当前不可编辑',
      'draft.title': '公式草稿',
      'draft.placeholder': '点这里组装长公式：可直接输入，也可点选上方符号',
      'draft.clear': '清空',
      'draft.insert': '插入',
      'draft.hintDraft': '符号会追加到草稿；Ctrl+Enter 或「插入」放入输入框',
      'draft.hintComposer': '点上方草稿框可先组装公式，确认后再插入',
      'preview.title': '排版预览',
      'preview.empty': '在下方输入或拼装 LaTeX，这里会显示排版结果',
      'preview.slots': '{count} 个待填参数，点方框可定位',
      'preview.error': '无法排版这段 LaTeX，可继续编辑原文',
      'group.greekLower': '小写',
      'group.greekUpper': '大写',
      'group.arithmetic': '算术',
      'group.relation': '关系',
      'group.sets': '集合',
      'group.special': '其他',
      'group.structure': '分式与重音',
      'group.integral': '积分',
      'group.sum': '求和与连乘',
      'group.functions': '极限与对数',
      'group.roots': '根号与括号',
      'group.scripts': '上下标与结构',
      'group.arrows': '箭头',
      'group.logic': '逻辑',
      'group.trigBasic': '基本函数',
      'group.trigInverse': '反函数',
      'group.trigAngle': '度分秒',
      'mode.unicode': 'Unicode',
      'mode.switch': '切换 Unicode 直插模式',
      'mode.hint': '开启后符号直接插入字符本身（α、×、≤…），模板仍插入 LaTeX',
      'mode.on': 'Unicode 直插已开启：符号插入字符本身，模板仍为 LaTeX',
    }

    const en = {
      'panel': 'Math symbol keyboard',
      'open': 'Open the math symbol keyboard',
      'close': 'Close the math symbol keyboard',
      'tab.greek': 'Greek',
      'tab.operators': 'Operators',
      'tab.calculus': 'Calculus',
      'tab.arrows': 'Arrows',
      'tab.trig': 'Trig',
      'tab.matrices': 'Matrices',
      'hint': 'Click a symbol to insert it at the caret',
      'insertFailed': 'The composer is not editable right now',
      'draft.title': 'Formula draft',
      'draft.placeholder': 'Build long formulas here: type directly or click symbols above',
      'draft.clear': 'Clear',
      'draft.insert': 'Insert',
      'draft.hintDraft': 'Symbols go into the draft; Ctrl+Enter or Insert commits it',
      'draft.hintComposer': 'Click the draft box to compose first, then insert',
      'preview.title': 'Typeset preview',
      'preview.empty': 'Type or build LaTeX below; the typeset result appears here',
      'preview.slots': '{count} argument slots — click a box to jump there',
      'preview.error': 'This LaTeX cannot be typeset; keep editing the source',
      'group.greekLower': 'Lowercase',
      'group.greekUpper': 'Uppercase',
      'group.arithmetic': 'Arithmetic',
      'group.relation': 'Relations',
      'group.sets': 'Sets',
      'group.special': 'Misc',
      'group.structure': 'Fraction & accents',
      'group.integral': 'Integrals',
      'group.sum': 'Sums & products',
      'group.functions': 'Limits & logs',
      'group.roots': 'Roots & brackets',
      'group.scripts': 'Scripts & structure',
      'group.arrows': 'Arrows',
      'group.logic': 'Logic',
      'group.trigBasic': 'Functions',
      'group.trigInverse': 'Inverse',
      'group.trigAngle': 'Degrees',
      'mode.unicode': 'Unicode',
      'mode.switch': 'Toggle Unicode direct insert',
      'mode.hint': 'Insert the character itself (α, ×, ≤…) instead of the LaTeX command; templates stay LaTeX',
      'mode.on': 'Unicode direct insert is on: symbols insert themselves, templates stay LaTeX',
    }

    /* ================================================================== *
     * Layer 2 — the symbol data dictionary
     *
     * Every entry is one grid button. Two factories build them, and adding a
     * symbol means adding one call (see README.md → "Extending the dictionary").
     *
     *   sym(glyph, latex, name)          a single symbol
     *   tmpl(glyph, latex, name, caret?) a LaTeX template with placeholder
     *                                    braces; `caret` is the offset inside
     *                                    the inserted text where the composer
     *                                    caret must land (defaults to the first
     *                                    `{` group, i.e. inside `{}`)
     * ================================================================== */

    /**
     * Default of the "Unicode" switch inside the panel: `false` inserts LaTeX
     * commands, `true` inserts the plain character for every entry that has one
     * (structure templates keep their LaTeX, since they need placeholder
     * braces to be clickable).
     */
    const DEFAULT_UNICODE_MODE = false

    /** A single symbol: `glyph` is what the button shows, `latex` what it writes. */
    function sym (glyph, latex, name) {
      return { kind: 'symbol', glyph, latex, name, unicode: glyph, caretIndex: -1 }
    }

    /**
     * A structure template. The caret lands inside the first brace group, or at
     * `caret` when supplied, so the next keystroke fills the placeholder.
     */
    function tmpl (glyph, latex, name, caret) {
      const brace = latex.indexOf('{')
      const caretIndex = caret !== undefined ? caret : brace < 0 ? -1 : brace + 1
      return { kind: 'template', glyph, latex, name, caretIndex }
    }

    /** Inserted text for one entry under the current mode. */
    function textOf (item, unicode) {
      return unicode === true && item.unicode ? item.unicode : item.latex
    }

    /** A full-width caption that starts a new section inside a grid. */
    function group (labelKey) {
      return { kind: 'group', labelKey }
    }

    const GREEK = [
      group('group.greekLower'),
      sym('α', '\\alpha', 'alpha'),
      sym('β', '\\beta', 'beta'),
      sym('γ', '\\gamma', 'gamma'),
      sym('δ', '\\delta', 'delta'),
      sym('ε', '\\epsilon', 'epsilon'),
      sym('ζ', '\\zeta', 'zeta'),
      sym('η', '\\eta', 'eta'),
      sym('θ', '\\theta', 'theta'),
      sym('ϑ', '\\vartheta', 'vartheta'),
      sym('ι', '\\iota', 'iota'),
      sym('κ', '\\kappa', 'kappa'),
      sym('λ', '\\lambda', 'lambda'),
      sym('μ', '\\mu', 'mu'),
      sym('ν', '\\nu', 'nu'),
      sym('ξ', '\\xi', 'xi'),
      sym('π', '\\pi', 'pi'),
      sym('ϖ', '\\varpi', 'varpi'),
      sym('ρ', '\\rho', 'rho'),
      sym('σ', '\\sigma', 'sigma'),
      sym('ς', '\\varsigma', 'varsigma'),
      sym('τ', '\\tau', 'tau'),
      sym('υ', '\\upsilon', 'upsilon'),
      sym('φ', '\\varphi', 'varphi'),
      sym('ϕ', '\\phi', 'phi'),
      sym('χ', '\\chi', 'chi'),
      sym('ψ', '\\psi', 'psi'),
      sym('ω', '\\omega', 'omega'),
      group('group.greekUpper'),
      sym('Γ', '\\Gamma', 'Gamma'),
      sym('Δ', '\\Delta', 'Delta'),
      sym('Θ', '\\Theta', 'Theta'),
      sym('Λ', '\\Lambda', 'Lambda'),
      sym('Ξ', '\\Xi', 'Xi'),
      sym('Π', '\\Pi', 'Pi'),
      sym('Σ', '\\Sigma', 'Sigma'),
      sym('Υ', '\\Upsilon', 'Upsilon'),
      sym('Φ', '\\Phi', 'Phi'),
      sym('Ψ', '\\Psi', 'Psi'),
      sym('Ω', '\\Omega', 'Omega'),
    ]

    const OPERATORS = [
      group('group.arithmetic'),
      sym('±', '\\pm', 'plus or minus'),
      sym('∓', '\\mp', 'minus or plus'),
      sym('×', '\\times', 'times'),
      sym('÷', '\\div', 'divide'),
      sym('·', '\\cdot', 'dot product'),
      sym('∗', '\\ast', 'asterisk'),
      sym('∘', '\\circ', 'compose'),
      sym('⊕', '\\oplus', 'direct sum'),
      sym('⊗', '\\otimes', 'tensor product'),
      group('group.relation'),
      sym('≈', '\\approx', 'approximately'),
      sym('≠', '\\neq', 'not equal'),
      sym('≡', '\\equiv', 'equivalent'),
      sym('≤', '\\leq', 'less or equal'),
      sym('≥', '\\geq', 'greater or equal'),
      sym('≪', '\\ll', 'much less'),
      sym('≫', '\\gg', 'much greater'),
      sym('∼', '\\sim', 'similar'),
      sym('∝', '\\propto', 'proportional to'),
      group('group.sets'),
      sym('∈', '\\in', 'element of'),
      sym('∉', '\\notin', 'not element of'),
      sym('⊂', '\\subset', 'subset'),
      sym('⊃', '\\supset', 'superset'),
      sym('⊆', '\\subseteq', 'subset or equal'),
      sym('⊇', '\\supseteq', 'superset or equal'),
      sym('∪', '\\cup', 'union'),
      sym('∩', '\\cap', 'intersection'),
      sym('∅', '\\emptyset', 'empty set'),
      group('group.special'),
      sym('∞', '\\infty', 'infinity'),
      sym('∂', '\\partial', 'partial derivative'),
      sym('∇', '\\nabla', 'nabla'),
      sym('∠', '\\angle', 'angle'),
      sym('⊥', '\\perp', 'perpendicular'),
      sym('∥', '\\parallel', 'parallel'),
      sym('△', '\\triangle', 'triangle'),
      sym('…', '\\ldots', 'ellipsis'),
      sym('⋯', '\\cdots', 'centered ellipsis'),
      group('group.structure'),
      /* Vertical fraction: numerator and denominator are both parameters. */
      tmpl('a⁄b', '\\frac{}{}', 'fraction'),
      /* Accents: one parameter each, drawn above whatever the argument is. */
      tmpl(VECTOR_ICON, '\\vec{}', 'vector'),
      tmpl('ẍ', '\\ddot{}', 'double dot'),
      tmpl('â', '\\hat{}', 'hat / power'),
      tmpl('ẋ', '\\dot{}', 'dot derivative'),
      tmpl('x̄', '\\overline{}', 'overline'),
    ]

    const CALCULUS = [
      group('group.integral'),
      tmpl('∫', '\\int', 'indefinite integral'),
      tmpl(stackGlyph('∫', 'b', 'a'), '\\int_{}^{}', 'definite integral'),
      tmpl('∬', '\\iint_{}^{}', 'double integral'),
      tmpl('∮', '\\oint', 'contour integral'),
      group('group.sum'),
      tmpl('∑', '\\sum', 'summation'),
      /* The bounds are empty groups on purpose: lower and upper limit are
       * parameters, so the preview shows two boxes to fill in. */
      tmpl(stackGlyph('∑', 'n', 'i=1'), '\\sum_{}^{}', 'summation with bounds'),
      tmpl('∏', '\\prod', 'product'),
      tmpl(stackGlyph('∏', 'n', 'i=1'), '\\prod_{}^{}', 'product with bounds'),
      group('group.functions'),
      /* Limits and logarithms follow the same rule: every argument is an empty
       * group, so the preview shows a box per parameter. */
      tmpl('lim', '\\lim_{}{}', 'limit'),
      tmpl('min', '\\min_{}{}', 'minimum'),
      tmpl('max', '\\max_{}{}', 'maximum'),
      tmpl(stackGlyph('log', undefined, 'a'), '\\log_{}{}', 'logarithm with base'),
      tmpl('log', '\\log{}', 'logarithm'),
      tmpl('ln', '\\ln{}', 'natural logarithm'),
      group('group.roots'),
      tmpl('√', '\\sqrt{}', 'square root'),
      tmpl(stackGlyph('√', 'n', undefined), '\\sqrt[n]{}', 'nth root'),
      tmpl('()', '\\left( \\right)', 'parentheses', 6),
      tmpl('||', '\\left| \\right|', 'absolute value', 6),
      group('group.scripts'),
      /* Scripts carry no base group: `^{}` / `_{}` attach to whatever token
       * precedes the caret, and the only parameter is the script itself. */
      tmpl('ⁿ', '^{}', 'superscript'),
      tmpl('ₙ', '_{}', 'subscript'),
      tmpl('C', '\\binom{}{}', 'binomial coefficient'),
      tmpl('f′', "f'(x)", 'derivative'),
    ]

    const ARROWS = [
      group('group.arrows'),
      sym('→', '\\rightarrow', 'right arrow'),
      sym('←', '\\leftarrow', 'left arrow'),
      sym('↔', '\\leftrightarrow', 'both arrows'),
      sym('⇒', '\\Rightarrow', 'implies'),
      sym('⇐', '\\Leftarrow', 'implied by'),
      sym('⇔', '\\Leftrightarrow', 'if and only if'),
      sym('↦', '\\mapsto', 'maps to'),
      sym('↑', '\\uparrow', 'up arrow'),
      sym('↓', '\\downarrow', 'down arrow'),
      sym('⟶', '\\longrightarrow', 'long right arrow'),
      sym('⟹', '\\Longrightarrow', 'long implies'),
      sym('↗', '\\nearrow', 'north east arrow'),
      sym('↘', '\\searrow', 'south east arrow'),
      group('group.logic'),
      sym('∀', '\\forall', 'for all'),
      sym('∃', '\\exists', 'exists'),
      sym('∄', '\\nexists', 'not exists'),
      sym('¬', '\\neg', 'not'),
      sym('∧', '\\land', 'and'),
      sym('∨', '\\lor', 'or'),
      sym('∴', '\\therefore', 'therefore'),
      sym('∵', '\\because', 'because'),
      sym('⊢', '\\vdash', 'proves'),
      sym('⊨', '\\models', 'models'),
      sym('⊤', '\\top', 'top'),
    ]

    const TRIG = [
      group('group.trigBasic'),
      tmpl('sin', '\\sin{}', 'sine'),
      tmpl('cos', '\\cos{}', 'cosine'),
      tmpl('tan', '\\tan{}', 'tangent'),
      tmpl('cot', '\\cot{}', 'cotangent'),
      tmpl('sec', '\\sec{}', 'secant'),
      tmpl('csc', '\\csc{}', 'cosecant'),
      group('group.trigInverse'),
      tmpl(stackGlyph('sin', '-1'), '\\arcsin{}', 'arcsine'),
      tmpl(stackGlyph('cos', '-1'), '\\arccos{}', 'arccosine'),
      tmpl(stackGlyph('tan', '-1'), '\\arctan{}', 'arctangent'),
      tmpl(stackGlyph('cot', '-1'), '\\arccot{}', 'arccotangent'),
      tmpl(stackGlyph('sec', '-1'), '\\arcsec{}', 'arcsecant'),
      tmpl(stackGlyph('csc', '-1'), '\\arccsc{}', 'arccosecant'),
      group('group.trigAngle'),
      /* Angle units: LaTeX mode writes the math form, Unicode mode the glyph. */
      sym('°', '^{\\circ}', 'degree'),
      sym('′', "'", 'arcminute'),
      sym('″', "''", 'arcsecond'),
    ]

    /**
     * Matrix / determinant source: every cell is an empty group, so each cell
     * becomes a fillable box in the preview. `env` is `pmatrix` (parentheses),
     * `bmatrix` (brackets) or `vmatrix` (determinant bars).
     */
    function matrixLatex (rows, cols, env) {
      const cell = '{}'
      const row = new Array(cols).fill(cell).join(' & ')
      const body = new Array(rows).fill(row).join('\\\\')
      return '\\begin{' + env + '}' + body + '\\end{' + env + '}'
    }

    /** One matrix grid button; the caret points at the first empty cell. */
    function matrixItem (glyph, name, rows, cols, env) {
      const latex = matrixLatex(rows, cols, env)
      /* The first `{` belongs to `\begin{...}`, so aim at the first cell. */
      return tmpl(glyph, latex, name, latex.indexOf('{}') + 1)
    }

    /**
     * 25 matrix sizes (row-major 1×1 … 5×5) plus square determinants 1×1 … 5×5.
     * A determinant needs a square matrix to mean anything, so only n×n gets one.
     */
    const MATRICES = []
    for (let rows = 1; rows <= 5; rows += 1) {
      for (let cols = 1; cols <= 5; cols += 1) {
        MATRICES.push(matrixItem(
          rows + '×' + cols,
          'matrix ' + rows + '×' + cols,
          rows,
          cols,
          'pmatrix',
        ))
      }
    }
    for (let size = 1; size <= 5; size += 1) {
      MATRICES.push(matrixItem(
        '|' + size + '×' + size + '|',
        'determinant ' + size + '×' + size,
        size,
        size,
        'vmatrix',
      ))
    }

    const CATEGORIES = [
      { id: 'greek', labelKey: 'tab.greek', items: GREEK },
      { id: 'operators', labelKey: 'tab.operators', items: OPERATORS },
      { id: 'calculus', labelKey: 'tab.calculus', items: CALCULUS },
      { id: 'trig', labelKey: 'tab.trig', items: TRIG },
      { id: 'arrows', labelKey: 'tab.arrows', items: ARROWS },
      { id: 'matrices', labelKey: 'tab.matrices', items: MATRICES },
    ]

    /* ================================================================== *
     * Layer 3 — composer bridge (insertion + caret placement)
     *
     * Text is inserted through the host's own composer API, so the draft is a
     * normal, undoable editor edit — no synthetic input/change events and no
     * DOM writes are needed. Only the "caret inside the first brace" step
     * reads the DOM to find the contenteditable root.
     * ================================================================== */

    /**
     * The composer is a Lexical contenteditable. Lexical marks its root with
     * `data-lexical-editor`; the plain `[contenteditable="true"]` fallback
     * keeps the caret step working if that attribute is ever renamed.
     */
    const EDITOR_SELECTOR = '[contenteditable="true"][data-lexical-editor="true"], [contenteditable="true"]'

    /** Nearest contenteditable owned by the composer that contains `node`. */
    function findEditor (node) {
      let current = node
      while (current !== null && current !== undefined && current !== document.body) {
        const editor = current.querySelector(EDITOR_SELECTOR)
        if (editor !== null && editor !== document.body) return editor
        current = current.parentElement
      }
      return document.querySelector(EDITOR_SELECTOR)
    }

    /**
     * Wait for an asynchronously rendered editor instead of failing: the
     * composer can still be mounting right after a Session switch.
     */
    function waitForEditor (timeoutMs) {      const found = document.querySelector(EDITOR_SELECTOR)
      if (found !== null) return Promise.resolve(found)
      return new Promise((resolve) => {
        let settled = false
        const finish = (value) => {
          if (settled) return
          settled = true
          observer.disconnect()
          clearTimeout(timer)
          resolve(value)
        }
        const observer = new MutationObserver(() => {
          const editor = document.querySelector(EDITOR_SELECTOR)
          if (editor !== null) finish(editor)
        })
        const timer = setTimeout(() => finish(null), timeoutMs)
        observer.observe(document.body, { childList: true, subtree: true })
      })
    }

    /**
     * Nearest ancestor of `node` that owns the composer editor — the input card
     * that also holds the panel. Clicks inside it keep the panel open so the
     * user can switch between composing in the draft and typing in the composer.
     */
    function composerCardOf (node) {
      let current = node
      while (current !== null && current !== undefined && current !== document.body) {
        if (current.querySelector(EDITOR_SELECTOR) !== null) return current
        current = current.parentElement
      }
      return null
    }

    /** Give the composer keyboard focus without scrolling it into view. */
    function focusEditor (editor) {
      if (editor === null || editor === undefined || document.activeElement === editor) return
      try {
        editor.focus({ preventScroll: true })
      } catch {
        editor.focus()
      }
    }

    /** Put the composer caret back inside the fresh placeholder. */
    function moveCaretLeft (editor, steps) {
      if (editor === null || editor === undefined || steps <= 0) return
      focusEditor(editor)
      for (let index = 0; index < steps; index += 1) {
        editor.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'ArrowLeft',
          code: 'ArrowLeft',
          bubbles: true,
          cancelable: true,
        }))
      }
    }

    /* ================================================================== *
     * Layer 3b — typeset preview (KaTeX + clickable argument slots)
     * ================================================================== */

    /** Class shared by every placeholder box in the rendered preview. */
    const SLOT_CLASS = 'dsh-mathkb-slot'
    /** Class carrying the placeholder index, so DOM order never matters. */
    const SLOT_INDEX_CLASS = 'dsh-mathkb-slot-'

    /**
     * Draft offsets of every empty `{}` group, in source order. An offset is
     * the index of the closing brace, i.e. the caret sits between `{` and `}`.
     */
    function scanPlaceholders (source) {
      const offsets = []
      for (let index = 0; index < source.length - 1; index += 1) {
        if (source[index] === '\\') {
          index += 1
          continue
        }
        if (source[index] === '{' && source[index + 1] === '}') {
          offsets.push(index + 1)
          index += 1
        }
      }
      return offsets
    }

    /**
     * KaTeX source for one empty group. The group keeps its braces — `\frac{}{}`
     * must stay brace-delimited — and only the empty content becomes a marker.
     */
    function slotMark (index) {
      return '\\htmlClass{' + SLOT_CLASS + ' ' + SLOT_INDEX_CLASS + index + '}{\\phantom{00}}'
    }

    /**
     * Typeset the draft and tag every empty group with a clickable box.
     * @returns `{ html, slots }`, where `slots[i]` is the draft offset that the
     *          box carrying `dsh-mathkb-slot-i` stands for.
     */
    function renderPreview (source) {
      const slots = scanPlaceholders(source)
      let marked = ''
      let cursor = 0
      slots.forEach((offset, index) => {
        marked += source.slice(cursor, offset) + slotMark(index) + '}'
        cursor = offset + 1
      })
      marked += source.slice(cursor)
      const html = katex.renderToString(marked, {
        displayMode: true,
        throwOnError: false,
        strict: false,
        /* Only our own class marker may emit markup; links stay inert. */
        trust: (context) => context.command === '\\htmlClass',
      })
      return { html, slots }
    }

    /* ================================================================== *
     * Layer 4 — styles (self-contained, theme tokens only)
     * ================================================================== */

    const STYLES = `
.dsh-mathkb-root{position:relative;display:inline-flex;align-items:center}
.dsh-mathkb-toggle{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:15px;font-weight:600;line-height:1;cursor:pointer}
.dsh-mathkb-toggle:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dsh-mathkb-toggle[aria-expanded="true"]{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary)}
.dsh-mathkb-panel{position:absolute;right:0;bottom:calc(100% + 8px);z-index:40;display:flex;flex-direction:column;width:388px;max-width:calc(100vw - 24px);max-height:min(80vh,640px);overflow:hidden;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 12px 32px color-mix(in srgb, var(--dsw-alias-label-primary) 18%, transparent)}
.dsh-mathkb-tabs{display:flex;flex-wrap:wrap;gap:4px;padding:8px 8px 6px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dsh-mathkb-tab{flex:0 0 auto;padding:5px 8px;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:1.2;white-space:nowrap;cursor:pointer}
.dsh-mathkb-tab:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dsh-mathkb-tab[aria-selected="true"]{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 45%, transparent)}
.dsh-mathkb-grid{display:grid;flex:1 1 auto;grid-template-columns:repeat(6,minmax(0,1fr));gap:4px;min-height:0;padding:10px;overflow-y:auto}
.dsh-mathkb-key{display:flex;align-items:center;justify-content:center;height:36px;min-width:0;padding:0;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:17px;line-height:1;cursor:pointer}
.dsh-mathkb-key:hover{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l1)}
.dsh-mathkb-key:active{background:var(--dsw-alias-bg-layer-1)}
.dsh-mathkb-key-glyph{display:inline-flex;align-items:center;justify-content:center;color:var(--dsw-alias-label-primary);pointer-events:none}
.dsh-mathkb-key-glyph svg{display:block}
.dsh-mathkb-sep{grid-column:1 / -1;display:flex;align-items:center;gap:8px;height:18px;margin-top:2px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:1;letter-spacing:.02em}
.dsh-mathkb-sep::after{content:"";flex:1 1 auto;height:1px;background:var(--dsw-alias-border-l1)}
.dsh-mathkb-sep-label{flex:0 0 auto}
.dsh-mathkb-stack{display:inline-block;white-space:nowrap}
.dsh-mathkb-stack sup,.dsh-mathkb-stack sub{font-size:.58em;line-height:0}
.dsh-mathkb-key[data-kind="template"] .dsh-mathkb-key-glyph{font-size:15px}
.dsh-mathkb-preview{display:flex;flex-direction:column;gap:6px;padding:8px 10px 6px;border-top:1px solid var(--dsw-alias-border-l1)}
.dsh-mathkb-preview-body{display:flex;align-items:safe center;justify-content:safe center;min-height:112px;max-height:248px;overflow:auto;padding:16px 8px;color:var(--dsw-alias-label-primary);font-size:15px}
.dsh-mathkb-preview-body .katex-display{flex:0 0 auto;margin:0}
.dsh-mathkb-preview-body .katex{font-size:1.05em}
.dsh-mathkb-preview-hint{flex:1 1 auto;display:block;padding:16px 0;text-align:center;color:var(--dsw-alias-label-secondary);font-size:12px}
.dsh-mathkb-preview-count{font-size:11px;color:var(--dsw-alias-label-secondary)}
.dsh-mathkb-preview .dsh-mathkb-slot{display:inline-block;min-width:1.15em;height:1.1em;border:1px dashed var(--dsw-alias-label-secondary);border-radius:3px;background:color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, transparent);vertical-align:-0.12em;cursor:text}
.dsh-mathkb-preview .dsh-mathkb-slot:hover{border-color:var(--dsw-alias-brand-primary);background:color-mix(in srgb, var(--dsw-alias-brand-primary) 18%, transparent)}
.dsh-mathkb-draft{display:flex;flex-direction:column;gap:6px;padding:8px 10px 10px;border-top:1px solid var(--dsw-alias-border-l1)}
.dsh-mathkb-draft-head{display:flex;align-items:center;justify-content:space-between;min-height:20px}
.dsh-mathkb-draft-title{font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary)}
.dsh-mathkb-draft-clear{padding:2px 6px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:1.4;cursor:pointer}
.dsh-mathkb-draft-clear:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dsh-mathkb-draft-clear:disabled{opacity:.45;cursor:default}
.dsh-mathkb-draft-input{box-sizing:border-box;width:100%;min-height:54px;max-height:112px;padding:7px 8px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;line-height:1.45;outline:none;resize:none}
.dsh-mathkb-draft-input::placeholder{color:var(--dsw-alias-label-secondary);opacity:.85}
.dsh-mathkb-draft-input:focus{border-color:var(--dsw-alias-brand-primary)}
.dsh-mathkb-draft-actions{display:flex;align-items:center;gap:8px;min-height:26px;font-size:12px;color:var(--dsw-alias-label-secondary)}
.dsh-mathkb-foot-name{flex:0 0 auto;color:var(--dsw-alias-label-secondary)}
.dsh-mathkb-foot-code{overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;color:var(--dsw-alias-label-primary);text-overflow:ellipsis;white-space:nowrap}
.dsh-mathkb-hint{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-mathkb-notice{flex:1 1 auto;min-width:0;color:var(--dsw-alias-state-warn-primary)}
.dsh-mathkb-insert{flex:0 0 auto;margin-left:auto;padding:5px 14px;border:0;border-radius:8px;background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-overlay);font:inherit;font-size:12px;font-weight:600;line-height:1.4;cursor:pointer}
.dsh-mathkb-insert:hover:not(:disabled){opacity:.88}
.dsh-mathkb-insert:disabled{opacity:.45;cursor:default}
.dsh-mathkb-switch{flex:0 0 auto;display:inline-flex;align-items:center;gap:5px;padding:2px 4px 2px 2px;border:0;border-radius:999px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;line-height:1;cursor:pointer}
.dsh-mathkb-switch:hover{color:var(--dsw-alias-label-primary)}
.dsh-mathkb-switch-track{position:relative;flex:0 0 auto;width:24px;height:14px;border-radius:999px;background:var(--dsw-alias-border-l2);box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l1);transition:background .12s ease}
.dsh-mathkb-switch-thumb{position:absolute;top:2px;left:2px;width:10px;height:10px;border-radius:50%;background:var(--dsw-alias-bg-base);transition:transform .12s ease}
.dsh-mathkb-switch[aria-checked="true"]{color:var(--dsw-alias-label-primary)}
.dsh-mathkb-switch[aria-checked="true"] .dsh-mathkb-switch-track{background:var(--dsw-alias-brand-primary);box-shadow:none}
.dsh-mathkb-switch[aria-checked="true"] .dsh-mathkb-switch-thumb{transform:translateX(10px)}
.dsh-mathkb-switch:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dsh-mathkb-toggle:focus-visible,.dsh-mathkb-tab:focus-visible,.dsh-mathkb-key:focus-visible,.dsh-mathkb-insert:focus-visible,.dsh-mathkb-draft-clear:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
`

    /* ================================================================== *
     * Layer 5 — view
     * ================================================================== */

    function MathKeyboard ({ t, inputActions }) {
      const [open, setOpen] = React.useState(false)
      const [categoryId, setCategoryId] = React.useState(CATEGORIES[0].id)
      const [hovered, setHovered] = React.useState(null)
      const [notice, setNotice] = React.useState('')
      const [draft, setDraft] = React.useState('')
      const [draftActive, setDraftActive] = React.useState(false)
      const [unicodeMode, setUnicodeMode] = React.useState(DEFAULT_UNICODE_MODE)
      const rootRef = React.useRef(null)
      const draftRef = React.useRef(null)
      const pendingCaret = React.useRef(null)
      const noticeTimer = React.useRef(null)
      /* Composer caret remembered when the draft takes focus: the host clears
       * the editor selection on blur, so a later commit must reuse this span. */
      const savedSpan = React.useRef(null)

      const clearNotice = React.useCallback(() => {
        if (noticeTimer.current !== null) {
          clearTimeout(noticeTimer.current)
          noticeTimer.current = null
        }
        setNotice('')
      }, [])

      const flashNotice = React.useCallback((message) => {
        setNotice(message)
        if (noticeTimer.current !== null) clearTimeout(noticeTimer.current)
        noticeTimer.current = setTimeout(() => setNotice(''), 2400)
      }, [])

      React.useEffect(() => () => {
        if (noticeTimer.current !== null) clearTimeout(noticeTimer.current)
      }, [])

      /* Restore the caret of a symbol appended to the draft once React has
       * committed the new value. */
      React.useLayoutEffect(() => {
        const caret = pendingCaret.current
        if (caret === null) return
        pendingCaret.current = null
        const node = draftRef.current
        if (node === null) return
        node.focus()
        node.setSelectionRange(caret, caret)
      }, [draft])

      /* Opening the panel moves the caret into the draft, so symbols build the
       * formula there by default. Clicking back into the composer keeps the panel
       * open and switches symbol insertion back to the composer. */
      React.useEffect(() => {
        if (!open) return
        const node = draftRef.current
        if (node === null) return
        node.focus({ preventScroll: true })
        const end = node.value.length
        node.setSelectionRange(end, end)
      }, [open])

      /* Click outside and Escape close the panel; insertion keeps it open. */
      React.useEffect(() => {
        if (!open) return undefined
        const onPointerDown = (event) => {
          const root = rootRef.current
          if (root !== null && root.contains(event.target)) return
          const card = root === null ? null : composerCardOf(root)
          if (card !== null && card.contains(event.target)) return
          setOpen(false)
        }
        const onKeyDown = (event) => {
          if (event.key === 'Escape') setOpen(false)
        }
        document.addEventListener('pointerdown', onPointerDown, true)
        document.addEventListener('keydown', onKeyDown, true)
        return () => {
          document.removeEventListener('pointerdown', onPointerDown, true)
          document.removeEventListener('keydown', onKeyDown, true)
        }
      }, [open])

      /* One undoable edit in the composer. `preferred` is the caret captured
       * before the editor lost focus; when the draft revision moved on, the
       * edit is retried against the live caret instead. */
      const insertToComposer = React.useCallback((text, preferred) => {
        if (inputActions === undefined) {
          flashNotice(t('insertFailed'))
          return false
        }
        try {
          const span = preferred !== undefined && preferred !== null ? preferred : inputActions.captureInsertion()
          if (inputActions.insertText(text, span) === true) {
            clearNotice()
            return true
          }
          if (preferred !== undefined && preferred !== null &&
              inputActions.insertText(text, inputActions.captureInsertion()) === true) {
            clearNotice()
            return true
          }
          flashNotice(t('insertFailed'))
          return false
        } catch {
          flashNotice(t('insertFailed'))
          return false
        }
      }, [inputActions, t, clearNotice, flashNotice])

      /** Remember the composer caret just before the draft steals focus. */
      const rememberComposerSpan = React.useCallback(() => {
        if (inputActions === undefined) return
        /* Only a focused editor has a caret worth remembering: a second click
         * inside the draft must not overwrite the span captured earlier. */
        const editor = findEditor(rootRef.current)
        if (editor === null || editor === undefined) return
        const active = document.activeElement
        if (active !== editor && !editor.contains(active)) return
        try {
          savedSpan.current = inputActions.captureInsertion()
        } catch {
          savedSpan.current = null
        }
      }, [inputActions])

      /* Append a symbol at the draft's own selection, keeping its caret there. */
      const appendToDraft = React.useCallback((item) => {
        const node = draftRef.current
        const text = textOf(item, unicodeMode)
        const start = node !== null && node.selectionStart !== null ? node.selectionStart : draft.length
        const end = node !== null && node.selectionEnd !== null ? node.selectionEnd : start
        const caret = start + (item.caretIndex >= 0 ? item.caretIndex : text.length)
        pendingCaret.current = caret
        setDraft(draft.slice(0, start) + text + draft.slice(end))
        clearNotice()
      }, [draft, clearNotice, unicodeMode])

      const onSymbol = React.useCallback((item) => {
        if (draftActive) {
          appendToDraft(item)
          return
        }
        const text = textOf(item, unicodeMode)
        if (!insertToComposer(text)) return
        const editor = findEditor(rootRef.current)
        if (item.caretIndex >= 0 && item.caretIndex < text.length) {
          const steps = text.length - item.caretIndex
          if (editor !== null) moveCaretLeft(editor, steps)
          else void waitForEditor(600).then((late) => moveCaretLeft(late, steps))
        } else {
          focusEditor(editor)
        }
      }, [draftActive, appendToDraft, insertToComposer, unicodeMode])

      /* Commit the whole draft as one edit, then hand the composer back. */
      const commitDraft = React.useCallback(() => {
        const text = draft.replace(/\s*\n\s*/g, ' ').trim()
        if (text === '') return
        if (!insertToComposer(text, savedSpan.current)) return
        savedSpan.current = null
        setDraft('')
        setOpen(false)
        focusEditor(findEditor(rootRef.current))
      }, [draft, insertToComposer])

      const clearDraft = React.useCallback(() => {
        setDraft('')
        clearNotice()
        const node = draftRef.current
        if (node !== null) node.focus()
      }, [clearNotice])

      const active = CATEGORIES.find((entry) => entry.id === categoryId) ?? CATEGORIES[0]

      /* Typeset the draft on every edit; KaTeX is fast enough for keystrokes. */
      const preview = React.useMemo(() => {
        if (draft.trim() === '') return { html: '', slots: [], failed: false }
        try {
          return { ...renderPreview(draft), failed: false }
        } catch {
          return { html: '', slots: [], failed: true }
        }
      }, [draft])

      const focusDraftAt = React.useCallback((offset) => {
        const node = draftRef.current
        if (node === null) return
        node.focus()
        node.setSelectionRange(offset, offset)
      }, [])

      /* A click on a rendered placeholder box jumps to its braces in the draft. */
      const onPreviewClick = React.useCallback((event) => {
        const target = event.target
        if (target === null || target === undefined || typeof target.closest !== 'function') return
        const marker = target.closest('.' + SLOT_CLASS)
        if (marker === null) return
        const className = typeof marker.className === 'string' ? marker.className : ''
        const tag = className.split(/\s+/).find((name) => name.startsWith(SLOT_INDEX_CLASS))
        if (tag === undefined) return
        const offset = preview.slots[Number(tag.slice(SLOT_INDEX_CLASS.length))]
        if (offset !== undefined) focusDraftAt(offset)
      }, [preview, focusDraftAt])

      const status = notice !== ''
        ? h('span', { className: 'dsh-mathkb-notice', role: 'status' }, notice)
        : hovered !== null
          ? [
              h('span', { key: 'name', className: 'dsh-mathkb-foot-name' }, hovered.name),
              h('code', { key: 'code', className: 'dsh-mathkb-foot-code' }, textOf(hovered, unicodeMode)),
            ]
          : h('span', { className: 'dsh-mathkb-hint' }, draftActive ? t('draft.hintDraft') : t('draft.hintComposer'))

      return h(React.Fragment, null,
        h('style', { key: 'styles' }, STYLES),
        h('div', { key: 'root', ref: rootRef, className: 'dsh-mathkb-root' },
          h('button', {
            type: 'button',
            className: 'dsh-mathkb-toggle',
            title: open ? t('close') : t('open'),
            'aria-label': open ? t('close') : t('open'),
            'aria-haspopup': 'dialog',
            'aria-expanded': open ? 'true' : 'false',
            /* Keep the composer caret: the button must never take focus. */
            onMouseDown: (event) => event.preventDefault(),
            onClick: () => {
              /* Capture the composer caret before the panel moves focus into the
               * draft, so a later commit still lands where the user was typing. */
              if (!open) rememberComposerSpan()
              setOpen((value) => !value)
              setHovered(null)
              clearNotice()
            },
          }, h('span', { 'aria-hidden': 'true' }, '∑')),
          open && h('div', {
            className: 'dsh-mathkb-panel',
            role: 'dialog',
            'aria-label': t('panel'),
          },
          h('div', { className: 'dsh-mathkb-tabs', role: 'tablist', 'aria-label': t('panel') },
            CATEGORIES.map((entry) => h('button', {
              key: entry.id,
              type: 'button',
              role: 'tab',
              className: 'dsh-mathkb-tab',
              title: t(entry.labelKey),
              'aria-selected': entry.id === active.id ? 'true' : 'false',
              onMouseDown: (event) => event.preventDefault(),
              onMouseEnter: () => setHovered(null),
              onClick: () => {
                setCategoryId(entry.id)
                setHovered(null)
              },
            }, t(entry.labelKey)))),
          h('div', {
            className: 'dsh-mathkb-grid',
            role: 'tabpanel',
            'aria-label': t(active.labelKey),
            onMouseLeave: () => setHovered(null),
          },
            active.items.map((item, index) => item.kind === 'group'
              ? h('div', {
                  key: `${active.id}-group-${index}`,
                  className: 'dsh-mathkb-sep',
                  role: 'separator',
                  'aria-label': t(item.labelKey),
                }, h('span', { className: 'dsh-mathkb-sep-label' }, t(item.labelKey)))
              : h('button', {
                  key: `${active.id}-${index}`,
                  type: 'button',
                  className: 'dsh-mathkb-key',
                  'data-kind': item.kind,
                  title: `${item.name} · ${textOf(item, unicodeMode)}`,
                  'aria-label': `${item.name}: ${textOf(item, unicodeMode)}`,
                  onMouseDown: (event) => event.preventDefault(),
                  onMouseEnter: () => setHovered(item),
                  onFocus: () => setHovered(item),
                  onClick: () => onSymbol(item),
                }, h('span', { className: 'dsh-mathkb-key-glyph', 'aria-hidden': 'true' }, item.glyph)))),
          h('div', { className: 'dsh-mathkb-preview' },
            h('div', { className: 'dsh-mathkb-draft-head' },
              h('span', { className: 'dsh-mathkb-draft-title' }, t('preview.title')),
              preview.slots.length > 0
                ? h('span', { className: 'dsh-mathkb-preview-count' }, t('preview.slots', { count: String(preview.slots.length) }))
                : null),
            preview.html === ''
              ? h('div', { className: 'dsh-mathkb-preview-body' },
                  h('span', { className: 'dsh-mathkb-preview-hint' }, preview.failed ? t('preview.error') : t('preview.empty')))
              : h('div', {
                  className: 'dsh-mathkb-preview-body',
                  onClick: onPreviewClick,
                  dangerouslySetInnerHTML: { __html: preview.html },
                })),
          h('div', { className: 'dsh-mathkb-draft' },
            h('div', { className: 'dsh-mathkb-draft-head' },
              h('span', { className: 'dsh-mathkb-draft-title' }, t('draft.title')),
              h('button', {
                type: 'button',
                className: 'dsh-mathkb-draft-clear',
                disabled: draft === '',
                onMouseDown: (event) => event.preventDefault(),
                onClick: clearDraft,
              }, t('draft.clear'))),
            h('textarea', {
              ref: draftRef,
              className: 'dsh-mathkb-draft-input',
              value: draft,
              rows: 2,
              spellCheck: false,
              autoCapitalize: 'off',
              autoCorrect: 'off',
              placeholder: t('draft.placeholder'),
              'aria-label': t('draft.title'),
              onMouseDown: rememberComposerSpan,
              onChange: (event) => {
                setDraft(event.target.value)
                clearNotice()
              },
              onFocus: () => setDraftActive(true),
              onBlur: () => setDraftActive(false),
              onKeyDown: (event) => {
                if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                  event.preventDefault()
                  commitDraft()
                  return
                }
                /* Keep host shortcut bindings out of this text field. */
                event.stopPropagation()
              },
            }),
            h('div', { className: 'dsh-mathkb-draft-actions' },
              status,
              h('button', {
                type: 'button',
                className: 'dsh-mathkb-switch',
                role: 'switch',
                'aria-checked': unicodeMode ? 'true' : 'false',
                'aria-label': t('mode.switch'),
                title: unicodeMode ? t('mode.on') : t('mode.hint'),
                onMouseDown: (event) => event.preventDefault(),
                onClick: () => {
                  setUnicodeMode((value) => !value)
                  clearNotice()
                },
              },
                h('span', { className: 'dsh-mathkb-switch-track', 'aria-hidden': 'true' },
                  h('span', { className: 'dsh-mathkb-switch-thumb' })),
                h('span', { className: 'dsh-mathkb-switch-label', 'aria-hidden': 'true' }, t('mode.unicode'))),
              h('button', {
                type: 'button',
                className: 'dsh-mathkb-insert',
                disabled: draft.trim() === '',
                title: t('draft.insert'),
                onMouseDown: (event) => event.preventDefault(),
                onClick: commitDraft,
              }, t('draft.insert')))))
        )
      )
    }

    /* ================================================================== *
     * Layer 6 — mount
     * ================================================================== */

    function apply (ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }))
      /* The compact control seat immediately before the composer's submit
       * action. Swap this key to move the keyboard elsewhere (see README). */
      ctx.slots.inject('conversation.input.right', () => ctx.slots.register({
        name: 'conversation.input.right',
        id: 'math-keyboard',
        order: 36,
        locale: NS,
      }, MathKeyboard))
    }

    return { inject: ['slots', 'locale'], apply }
  },
})
