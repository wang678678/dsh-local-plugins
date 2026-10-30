window.__ModuleLoader__.load({
  id: 'dsh-workspace-flow',
  factory: function (require) {
    var React = require('react');

    var OVERLAY = { position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
    var PANEL = { width: 'min(560px, 92vw)', background: 'var(--dsh-surface, #1f1f22)', color: 'var(--dsh-text, #e8e8e8)', border: '1px solid var(--dsh-border, rgba(127,127,127,.35))', borderRadius: 12, boxShadow: '0 24px 64px rgba(0,0,0,.45)', padding: 18, boxSizing: 'border-box' };
    var TITLE = { margin: '0 0 12px', fontSize: 15, fontWeight: 600 };
    var INPUT = { width: '100%', boxSizing: 'border-box', padding: '9px 10px', borderRadius: 8, border: '1px solid var(--dsh-border, rgba(127,127,127,.35))', background: 'var(--dsh-bg, rgba(0,0,0,.20))', color: 'inherit', fontSize: 13, outline: 'none' };
    var ROW = { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 };
    var CHIP = { padding: '5px 10px', borderRadius: 999, border: '1px solid var(--dsh-border, rgba(127,127,127,.35))', background: 'transparent', color: 'inherit', cursor: 'pointer', fontSize: 12 };
    var FOOTER = { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 };
    var BTN = { padding: '7px 16px', borderRadius: 8, border: '1px solid var(--dsh-border, rgba(127,127,127,.35))', background: 'transparent', color: 'inherit', cursor: 'pointer', fontSize: 13 };
    var PRIMARY = { padding: '7px 18px', borderRadius: 8, border: 0, background: '#4f7cff', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 };

    function Flow(props) {
      var open = !!props.open;
      var busy = !!props.busy;
      var state = React.useState('');
      var path = state[0];
      var setPath = state[1];

      React.useEffect(function () {
        if (open) setPath('');
      }, [open]);

      if (!open) return null;

      function commit() {
        var p = String(path || '').trim();
        if (p === '' || busy) return;
        if (typeof props.onPicked === 'function') props.onPicked(p);
      }
      function cancel() {
        if (typeof props.onCancel === 'function') props.onCancel();
      }
      function nativePick() {
        var api = window.__DSH_DIRECTORY_PICKER__;
        if (api && typeof api.pick === 'function') {
          api.pick().then(function (picked) { if (picked) setPath(picked); });
        }
      }

      return React.createElement('div', {
        style: OVERLAY,
        onMouseDown: function (event) { if (event.target === event.currentTarget) cancel(); }
      }, React.createElement('div', { style: PANEL },
        React.createElement('h2', { style: TITLE }, '选择工作区目录'),
        React.createElement('input', {
          style: INPUT,
          value: path,
          autoFocus: true,
          placeholder: '输入绝对路径，如 E:\\office文档\\论文、专利\\小论文',
          disabled: busy,
          onChange: function (event) { setPath(event.target.value); },
          onKeyDown: function (event) {
            if (event.key === 'Enter') commit();
            if (event.key === 'Escape') cancel();
          }
        }),
        React.createElement('div', { style: ROW },
          ['C:\\', 'D:\\', 'E:\\', 'F:\\'].map(function (drive) {
            return React.createElement('button', {
              key: drive, type: 'button', style: CHIP, disabled: busy,
              onClick: function () { setPath(drive); }
            }, drive);
          }),
          window.__DSH_DIRECTORY_PICKER__ ? React.createElement('button', {
            type: 'button', style: CHIP, disabled: busy, onClick: nativePick
          }, '系统选择…') : null
        ),
        React.createElement('div', { style: { marginTop: 10, fontSize: 12, opacity: 0.6 } },
          '提示：可以直接粘贴资源管理器地址栏里的路径；回车打开。'),
        React.createElement('div', { style: FOOTER },
          React.createElement('button', { type: 'button', style: BTN, disabled: busy, onClick: cancel }, '取消'),
          React.createElement('button', { type: 'button', style: PRIMARY, disabled: busy, onClick: commit }, '打开')
        )
      ));
    }

    var SLOTS = ['sidebar.workspaces.directoryFlow', 'conversation.hero.workspace.directoryFlow'];

    function apply(ctx) {
      var injected = {
        listDirectory: function (path, signal) {
          var w = workspaceService();
          return w && w.listDirectory ? w.listDirectory(path, signal) : Promise.reject(new Error('not available'));
        },
        createDirectory: function (path, name) {
          var w = workspaceService();
          return w && w.createDirectory ? w.createDirectory(path, name) : Promise.reject(new Error('not available'));
        },
        t: function (key) { return key; }
      };
      ctx.effect(function () {
        var disposers = SLOTS.map(function (slot) {
          return ctx.slots.inject(slot, function () {
            return ctx.slots.register({ name: slot, inject: function () { return injected; }, priority: -10 }, Flow);
          });
        });
        return function () { disposers.forEach(function (dispose) { if (typeof dispose === 'function') dispose(); }); };
      }, 'dsh-workspace-flow');
    }

    return { apply: apply, inject: ['slots'], name: 'dsh-workspace-flow' };
  }
});
