import { defineConfig } from 'vitepress'
import { set_sidebar } from './utils/auto-gen-sidebar.mjs';
import { nav } from './nav'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/zzc_fronted_doc/",
  head: [["link", { rel: "icon", href: "./narotu.svg" }]],
  title: "看云的前端之路",
  description: "A VitePress Site",
  themeConfig: {
      logo: '/narotu.svg',
      siteTitle: '看云的前端小屋',
       // 设置搜索框的样式
       search: {
        provider: "local",
        options: {
          translations: {
            button: {
              buttonText: "搜索文档",
              buttonAriaLabel: "搜索文档",
            },
            modal: {
              noResultsText: "无法找到相关结果",
              resetButtonTitle: "清除查询条件",
              footer: {
                selectText: "选择",
                navigateText: "切换",
              },
            },
          },
        },
      },
    outlineTitle: '目录',
    outline: [2,6],
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar: {
      "/frontEndEngineering/": set_sidebar("frontEndEngineering"),
      "/essay/": set_sidebar("essay"),
      "/javascriptBasics/": set_sidebar("javascriptBasics")
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present zhuzhichao'
    }
  }
})