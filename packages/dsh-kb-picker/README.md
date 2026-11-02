# dsh-kb-picker

DSH 输入框增强：知识库选择器（依赖 dsh-knowledge，未安装时会提示）+ 原生附件回形针。

Composer controls for DeepSeek Harness: knowledge-base picker (requires dsh-knowledge) and native-attachment paperclip.

## Install

```powershell
dsh plugin --profile desktop add dsh-kb-picker
```

Or from GitHub:

```powershell
dsh plugin --profile desktop add file:C:/path/to/dsh-kb-picker
```

## Files

- `lib/index.js` — host side
- `lib/client.js` — web client side (if present)
- `cordis.patch.yml` — bundle patch

## License

MIT © 2026 wang678678
