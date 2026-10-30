# dsh-workspace-flow

DSH Desktop 工作区目录选择流：路径输入、C/D/E/F 盘符快捷、系统文件夹选择对话框。

Workspace directory flow for DSH Desktop: path input, drive shortcuts, native folder dialog.

## Install

```powershell
dsh plugin --profile desktop add dsh-workspace-flow
```

Or from GitHub:

```powershell
dsh plugin --profile desktop add file:C:/path/to/dsh-workspace-flow
```

## Files

- `lib/index.js` — host side
- `lib/client.js` — web client side (if present)
- `cordis.patch.yml` — bundle patch

## License

MIT © 2026 wang678678
