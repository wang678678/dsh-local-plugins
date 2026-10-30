window.__ModuleLoader__.load({ id: 'dsh-kb-picker', factory: (require) => {
  var module = { exports: {} };
  var exports = module.exports;
  var React = require('react');
  var h = React.createElement;

  var BORDER = '1px solid var(--dsh-border, rgba(127,127,127,.35))';
  var TOKEN_PREFIX = '@知识库:';
  var POP_WIDTH = 300;

  function tokenOf(b) { return TOKEN_PREFIX + b.name; }
  function stripTokens(s) {
    return String(s || '').replace(/@知识库:[^\s]+/g, '').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  }

  function iconPaperclip() {
    return h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' },
      h('path', { d: 'M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48' }));
  }
  function iconFileSearch(size, color) {
    size = size || 17;
    return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color || 'currentColor', strokeWidth: size <= 14 ? 1.9 : 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' },
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('path', { d: 'M14 2v6h6' }),
      h('circle', { cx: 8.7, cy: 16.7, r: 3.2 }),
      h('path', { d: 'M10.9 18.9 13.4 21.4' }));
  }

  var btnStyle = {
    width: 24, height: 24, padding: 0, borderRadius: 6, border: 0,
    background: 'transparent', color: 'var(--dsh-text-tertiary, #8a8a8a)',
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
  };

  function useDraft(props) {
    var state = typeof props.useInput === 'function' ? props.useInput(function (s) { return s; }) : null;
    if (state && typeof state.draft === 'string') return state.draft;
    if (props.input && typeof props.input.draft === 'string') return props.input.draft;
    return '';
  }

  var pluginCtx = null;

  function AttachButton(props) {
    var ref = React.useRef(null);
    var sessionId = props.sessionId || (props.session && props.session.sessionId);
    function openPicker() { if (ref.current) ref.current.click(); }
    function onChange(e) {
      var files = Array.prototype.slice.call((e.target && e.target.files) || []);
      if (e.target) e.target.value = '';
      if (!files.length) return;
      try {
        var conv = pluginCtx && pluginCtx.get('conversation');
        if (!conv || !sessionId) return;
        var shell = conv.input.shell(sessionId);
        var drafts = conv.createDrafts(sessionId, files);
        var ids = drafts.map(function (d) { return d.id; });
        if (!shell.addAttachments(ids)) {
          drafts.forEach(function (d) { try { conv.releaseDraftAttachment(d.id); } catch (err) {} });
        }
      } catch (err) {
        if (typeof console !== 'undefined') console.warn('dsh-kb-picker attach failed', err);
      }
    }
    return h('span', { style: { display: 'inline-flex', alignItems: 'center' } },
      h('input', { ref: ref, type: 'file', multiple: true, style: { display: 'none' }, onChange: onChange }),
      h('button', { type: 'button', className: 'dsh-kb-picker-btn', title: '上传文件', 'aria-label': '上传文件', onClick: openPicker, style: btnStyle }, iconPaperclip())
    );
  }

  function KbButton(props) {
    var useState = React.useState;
    var useEffect = React.useEffect;
    var useRef = React.useRef;

    var draft = useDraft(props);
    var draftRef = useRef(draft);
    draftRef.current = draft;
    var actions = props.inputActions || {};

    var anchorRef = useRef(null);
    var popRef = useRef(null);
    var basesRef = useRef(null);
    var selectedRef = useRef(null);
    var lastDraftRef = useRef('');

    var openPair = useState(false);
    var open = openPair[0], setOpen = openPair[1];
    var selPair = useState(null);
    var selected = selPair[0], setSelectedState = selPair[1];
    var errPair = useState('');
    var err = errPair[0], setErr = errPair[1];

    useEffect(function () { selectedRef.current = selected; }, [selected]);

    function setSelected(b) {
      selectedRef.current = b;
      setSelectedState(b);
    }

    function fill() {
      var el = popRef.current;
      if (!el) return;
      while (el.firstChild) el.removeChild(el.firstChild);
      var title = document.createElement('div');
      title.textContent = '选择知识库';
      title.style.cssText = 'padding:4px 8px 6px;font-size:12px;opacity:.65';
      el.appendChild(title);

      if (basesRef.current === null) {
        var loading = document.createElement('div');
        loading.textContent = err ? ('加载失败：' + err) : '加载中…';
        loading.style.cssText = 'padding:8px;font-size:12px;opacity:.6';
        el.appendChild(loading);
        return;
      }
      if (!basesRef.current.length) {
        var empty = document.createElement('div');
        empty.textContent = '没有知识库';
        empty.style.cssText = 'padding:8px;font-size:12px;opacity:.6';
        el.appendChild(empty);
        return;
      }
      basesRef.current.forEach(function (b) {
        var row = document.createElement('button');
        row.type = 'button';
        row.style.cssText = 'display:flex;width:100%;align-items:center;justify-content:space-between;gap:8px;padding:8px;border:0;border-radius:6px;background:transparent;color:inherit;cursor:pointer;font-size:13px;text-align:left';
        row.onmouseenter = function () { row.style.background = 'var(--dsh-hover, rgba(127,127,127,.12))'; };
        row.onmouseleave = function () { row.style.background = 'transparent'; };
        var name = document.createElement('span');
        name.textContent = b.name;
        var count = document.createElement('span');
        count.textContent = (b.count || 0) + ' 文档';
        count.style.cssText = 'font-size:12px;opacity:.6';
        row.appendChild(name);
        row.appendChild(count);
        row.onclick = function () { pick(b); };
        el.appendChild(row);
      });
    }

    function position() {
      var el = popRef.current, anchor = anchorRef.current;
      if (!el || !anchor) return;
      var r = anchor.getBoundingClientRect();
      el.style.left = Math.max(8, Math.min(r.left, window.innerWidth - POP_WIDTH - 8)) + 'px';
      el.style.bottom = Math.max(8, window.innerHeight - r.top + 8) + 'px';
    }

    function close() {
      if (popRef.current) {
        var el = popRef.current;
        popRef.current = null;
        if (el.parentNode) el.parentNode.removeChild(el);
      }
      document.removeEventListener('mousedown', onDocDown, true);
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close, true);
      setOpen(false);
    }

    function onDocDown(e) {
      if (popRef.current && !popRef.current.contains(e.target) && !(anchorRef.current && anchorRef.current.contains(e.target))) close();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    function ensureBases() {
      if (basesRef.current !== null) return;
      fetch('/knowledge/bases').then(function (r) { return r.json(); }).then(function (j) {
        var list = (j && j.value) || [];
        basesRef.current = list.map(function (b) {
          return { id: b.id, name: b.name, count: (b.documentCount != null ? b.documentCount : b.storedDocCount) || 0 };
        });
        fill();
      }).catch(function (e) {
        setErr(String((e && e.message) || e));
        basesRef.current = [];
        fill();
      });
    }

    function openPopover() {
      if (popRef.current) { close(); return; }
      var el = document.createElement('div');
      el.style.cssText = 'position:fixed;z-index:2147483647;width:' + POP_WIDTH + 'px;max-height:360px;overflow:auto;padding:6px;border-radius:10px;border:' + BORDER + ';background:var(--dsh-surface,#fff);box-shadow:0 8px 28px rgba(0,0,0,.22);font-size:13px;color:var(--dsh-text,inherit)';
      document.body.appendChild(el);
      popRef.current = el;
      position();
      setOpen(true);
      fill();
      ensureBases();
      document.addEventListener('mousedown', onDocDown, true);
      document.addEventListener('keydown', onKey, true);
      window.addEventListener('scroll', close, true);
      window.addEventListener('resize', close, true);
    }

    function pick(b) {
      var cur = stripTokens(draftRef.current);
      var next = (cur ? cur + (/\s$/.test(cur) ? '' : ' ') : '') + tokenOf(b);
      if (typeof actions.setDraft === 'function') actions.setDraft(next);
      setSelected(b);
      close();
    }

    function clear() {
      var next = stripTokens(draftRef.current);
      if (typeof actions.setDraft === 'function') actions.setDraft(next);
      setSelected(null);
    }

    useEffect(function () {
      var d = String(draft || '');
      var prev = lastDraftRef.current;
      lastDraftRef.current = d;
      if (!selected) return;
      var tok = tokenOf(selected);
      if (d.indexOf(tok) >= 0) return;
      if (d.trim() === '') return;
      if (prev.indexOf(tok) >= 0) { setSelected(null); return; }
      if (typeof actions.setDraft === 'function') actions.setDraft(tok + ' ' + d);
    }, [draft, selected && selected.id]);

    useEffect(function () { return function () { close(); }; }, []);

    var chip = selected ? h('span', {
      title: '检索范围：' + selected.name + '（发送后仍保留，点 × 取消）',
      style: {
        display: 'inline-flex', alignItems: 'center', gap: 4, maxWidth: 160,
        padding: '2px 6px', borderRadius: 999, border: BORDER, fontSize: 12,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        background: 'var(--dsh-hover, rgba(127,127,127,.10))'
      }
    }, iconFileSearch(13, '#00B96B'), selected.name, h('button', {
      type: 'button', title: '取消知识库', 'aria-label': '取消知识库',
      onClick: clear,
      style: { border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 12, opacity: 0.7 }
    }, '×')) : null;

    return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 4 } },
      h('button', {
        ref: anchorRef, type: 'button', className: 'dsh-kb-picker-btn', title: '选择知识库', 'aria-label': '选择知识库',
        onClick: openPopover, style: btnStyle
      }, iconFileSearch(17, selected ? '#00B96B' : undefined)),
      chip
    );
  }

  var hoverStyleId = 'dsh-kb-picker-style';
  function ensureStyle() {
    if (typeof document === 'undefined' || document.getElementById(hoverStyleId)) return;
    var st = document.createElement('style');
    st.id = hoverStyleId;
    st.textContent = '.dsh-kb-picker-btn:hover{background:var(--dsh-hover,rgba(127,127,127,.10))}';
    document.head.appendChild(st);
  }

  function apply(ctx) {
    pluginCtx = ctx;
    ensureStyle();
    ctx.effect(function () {
      var d1 = ctx.slots.inject('conversation.input.left', function () {
        return ctx.slots.register(
          { name: 'conversation.input.left', id: 'kb-attach', order: 90, label: '上传文件' },
          AttachButton
        );
      });
      var d2 = ctx.slots.inject('conversation.input.left', function () {
        return ctx.slots.register(
          { name: 'conversation.input.left', id: 'kb-picker', order: 100, label: '知识库' },
          KbButton
        );
      });
      return function () { d1(); d2(); };
    }, 'dsh-kb-picker: composer slots');
  }

  module.exports = { apply: apply, inject: ['slots'] };
  return module.exports;
} });
