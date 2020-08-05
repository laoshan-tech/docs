module.exports = (ctx) => ({
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  locales: {
    "/": {
      lang: "zh-CN",
      title: "崂山科技",
      description: "研究穿墙技术 架构解决方案",
    },
    "/en/": {
      lang: "en-US",
      title: "LaoShan Tech",
      description: "VPN technology research and solution architecture",
    },
  },
  themeConfig: {
    repo: "laoshan-tech/docs",
    smoothScroll: true,
    editLinks: true,
    docsDir: "docs",
    locales: {
      "/": {
        label: "简体中文",
        selectText: "选择语言",
        ariaLabel: "选择语言",
        editLinkText: "在 GitHub 上编辑此页",
        lastUpdated: "上次更新",
        nav: require("./nav/zh"),
        sidebar: {},
      },
      "/en/": {
        label: "English",
        selectText: "Languages",
        ariaLabel: "Select language",
        editLinkText: "Edit this page on GitHub",
        lastUpdated: "Last Updated",
        nav: require("./nav/en"),
        sidebar: {},
      },
    },
  },
  extraWatchFiles: [".vuepress/nav/en.js", ".vuepress/nav/zh.js"],
  plugins: [
    [
      "vuepress-plugin-clean-urls",
      {
        normalSuffix: "/",
        indexSuffix: "/",
        notFoundPath: "/404.html",
      },
    ],
    ["vuepress-plugin-mathjax", { target: "svg", macros: { "*": "\\times" } }],
    "vuepress-plugin-nprogress",
    [
      "vuepress-plugin-medium-zoom",
      {
        selector: ".my-wrapper .my-img",
        delay: 1000,
      },
    ],
  ],
});
