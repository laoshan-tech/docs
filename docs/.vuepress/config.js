module.exports = {
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    [
      "meta",
      {
        name: "keywords",
        contents:
          "vuepress,docs,文档,翻墙,科学上网,网络,运营商,互联网,Shadowsocks,ShadowsocksR,v2ray,trojan,Clash,Surge,免费节点,机场,sspanel,v2board,wireguard,gost,中转,隧道,节点,后端,iptables,bbr,锐速",
      },
    ],
  ],
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
        sidebar: {
          "/server/": getServerSidebar("服务端", "Web 面板", "中转与隧道", "节点"),
        },
      },
      "/en/": {
        label: "English",
        selectText: "Languages",
        ariaLabel: "Select language",
        editLinkText: "Edit this page on GitHub",
        lastUpdated: "Last Updated",
        nav: require("./nav/en"),
        sidebar: {
          "/en/server/": getServerSidebar("Server", "Web Panel", "Redirect and Tunnel", "Node"),
        },
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
    "@vuepress/nprogress",
    "@vuepress/medium-zoom",
    "@vuepress/back-to-top",
    ["@vuepress/google-analytics", { ga: "UA-150419494-2" }],
    ["sitemap", { hostname: "https://docs.laoshan-tech.com" }],
    [
      "@vuepress/last-updated",
      {
        transformer: (timestamp) => {
          return new Date(timestamp).toISOString();
        },
      },
    ],
  ],
};

function getServerSidebar(groupA, groupB, groupC, groupD) {
  return [
    {
      title: groupA,
      collapsable: false,
      children: ["", "linux"],
    },
    {
      title: groupB,
      collapsable: false,
      children: ["panel/sspanel", "panel/v2board", "panel/django-sspanel"],
    },
    {
      title: groupC,
      collapsable: false,
      children: ["redir", "tunnel"],
    },
    {
      title: groupD,
      collapsable: false,
      children: ["node"],
    },
  ];
}
