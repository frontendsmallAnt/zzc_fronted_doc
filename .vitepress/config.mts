import { defineConfig } from 'vitepress'
import { set_sidebar } from './utils/auto-gen-sidebar.mjs';
// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/docs-demo/",
  head: [["link", { rel: "icon", href: "./logo.png" }]],
  title: "zzc的博客",
  description: "A VitePress Site",
  themeConfig: {
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
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', 
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ]
      },
      { text: 'react', link: '/front-end/react/react1' },
      { text: 'vue', link: '/front-end/vue/vue1' },
    ],
    sidebar: {
      "/front-end/react": set_sidebar("front-end/react"),
      "/front-end/vue": set_sidebar("front-end/vue"),
    },

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' },
    //       { text: '两边栏演示', link: '/two-sidebar' },
    //     ]
    //   },
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present zhuzhichao'
    }
  }
})
