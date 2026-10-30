export const name = 'dsh-doc-routing-guard'

export const inject = ['systemPrompt']

const TEXT = `处理文档时按下面的默认路径，不要靠文件名猜内容：
- PDF：先调用 ocr_read（若工具存在）。电子版读文字层，扫描件自动 OCR；不要用 read 直接读 PDF，也不要逐页 read_image。
- 图片/截图：需要文字时先 ocr_read；需要看版式、颜色、界面状态时才 read_image。
- docx / xlsx / pptx：用 office 技能（python-docx / openpyxl / python-pptx）或 read_document（若存在）；不要手工解压 XML。
- 上传文件或工作区文件：先确认类型，再选上面的路径；没有合适工具时明确说明限制，不要假装读到了内容。
- 引用 OCR 结果时提醒用户校对数字、邮箱、上下标（OCR 常在这些地方出错）。
- 使用 knowledge_search 检索后，回答里引用事实时在句末标注来源：（来源：<文档名> · chunk <chunkIndex>）；没有检索到依据就直说，不要编。`

export function apply(ctx) {
  ctx.effect(() => ctx.systemPrompt.section({
    name: 'doc-routing',
    order: 350,
    text: TEXT
  }), 'dsh-doc-router: document routing')
}

