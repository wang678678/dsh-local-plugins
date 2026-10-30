# dsh-doc-routing-guard

全局文档路由提示：PDF/图片先 ocr_read，Office 用 office 技能，知识库引用标注来源。

Global document-routing prompt for DSH: ocr_read for PDF/images, office skills for Office files, cited knowledge snippets.

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
