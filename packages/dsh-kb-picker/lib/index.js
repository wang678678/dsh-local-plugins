export const name = 'dsh-kb-picker'

export const inject = ['systemPrompt']

// Host half: teach every agent how to read the composer's compact scope token.
// The token is inserted by the client half; keeping the rule here means the five
// project presets do not need their persona text edited.
export function apply(ctx) {
  ctx.effect(() => ctx.systemPrompt.section({
    name: 'kb-picker-scope',
    order: 400,
    text: '当用户消息中出现 @知识库:<名称> 时，表示本轮只在该知识库内检索：先调用 knowledge_list_bases 找到与 <名称> 匹配的 baseId，再用 knowledge_search 并带上该 baseId；不要跨库检索。没有该标记时按正常方式处理。'
  }), 'dsh-kb-picker: scope instruction')
}
