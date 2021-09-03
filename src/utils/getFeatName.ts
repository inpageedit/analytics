export const featMap: Record<string, string> = {
  find_replace: '查找替换',
  plugin_setting: '插件商店',
  preview_edit: '快速预览(编辑时)',
  quick_diff: '快速差异',
  quick_diff_edit: '快速差异(编辑时)',
  quick_diff_history_page: '快速差异(页面历史)',
  quick_diff_modalclick: '快速差异(上下文)',
  quick_diff_recentchanges: '快速差异(最近更改)',
  quick_edit: '快速编辑',
  quick_edit_pagedetail: '页面详情',
  quick_edit_pagedetail_edit_template: '页面详情(模板)',
  quick_edit_pagedetail_view_image: '页面详情(文件)',
  quick_edit_save: '快速编辑(保存)',
  quick_move: '快速移动',
  quick_redirect: '快速重定向',
  tool_box: '工具盒®',
}

export const getFeatName = (id: string) => featMap[id] || id
