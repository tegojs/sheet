import { defineConfig } from 'rspress/config';

export default defineConfig({
  base: '/sheet/',
  root: 'docs',
  lang: 'zh',
  locales: [
    {
      lang: 'en',
      // 导航栏切换语言的标签
      label: 'English',
      title: 'Rspress',
      description: 'Static Site Generator',
    },
    {
      lang: 'zh',
      label: '简体中文',
      title: 'Rspress',
      description: '静态网站生成器',
    },
  ],
  themeConfig: {
    locales: [
      {
        lang: 'en',
        label: 'dd',
        outlineTitle: 'ON THIS Page',
      },
      {
        lang: 'zh',
        label: 'dd',
        outlineTitle: '大纲',
      },
    ],
  },
});
