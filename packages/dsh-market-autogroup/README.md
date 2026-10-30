# dsh-market-autogroup

启动时把已安装插件按类别补进 dshmarket 分组，保持分组完整。

Automatically group installed plugins in dshmarket on startup.

## Install

```powershell
dsh plugin --profile desktop add dsh-market-autogroup
```

Or from GitHub:

```powershell
dsh plugin --profile desktop add file:C:/path/to/dsh-market-autogroup
```

## Files

- `lib/index.js` — host side
- `lib/client.js` — web client side (if present)
- `cordis.patch.yml` — bundle patch

## License

MIT © 2026 wang678678
