# dsh-local-plugins

A small monorepo of local DeepSeek Harness plugins.

| Package | Description | npm |
|---|---|---|
| `dsh-kb-picker` | Composer knowledge-base picker + native attachment paperclip | `npm i dsh-kb-picker` |
| `dsh-workspace-flow` | Workspace directory flow: path input, drive chips, native folder dialog | `npm i dsh-workspace-flow` |
| `dsh-doc-routing-guard` | Global document-routing system prompt | `npm i dsh-doc-routing-guard` |
| `dsh-market-autogroup` | Auto-group installed plugins in dshmarket | `npm i dsh-market-autogroup` |

## Install

```powershell
dsh plugin --profile desktop add dsh-kb-picker
dsh plugin --profile desktop add dsh-workspace-flow
dsh plugin --profile desktop add dsh-doc-routing-guard
dsh plugin --profile desktop add dsh-market-autogroup
```

## Development

Each package lives in `packages/<name>` and declares `dsh.bundle.patch` in its `package.json`.

## License

MIT © 2026 wang678678
