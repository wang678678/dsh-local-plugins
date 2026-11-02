# dsh-doc-routing-guard

全局文档路由提示：ocr_read/doc_route 可用时优先，Office 用 office 技能，缺失时退到内置 read_document/office-render。

Global document-routing prompt for DSH: prefer ocr_read/doc_route when available, fall back to built-in read_document/office-render.

## Install

```powershell
dsh plugin --profile desktop add dsh-doc-routing-guard
```

Or from GitHub:

```powershell
dsh plugin --profile desktop add file:C:/path/to/dsh-doc-routing-guard
```

## Files

- `lib/index.js` — host side
- `lib/client.js` — web client side (if present)
- `cordis.patch.yml` — bundle patch

## License

MIT © 2026 wang678678
