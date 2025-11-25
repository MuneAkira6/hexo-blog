/**
 * japan_credit_card.md 专用 FAQ Schema 生成器
 * 这个脚本会为该文章自动生成FAQ类型的结构化数据
 */

"use strict";

hexo.extend.injector.register("head_end", function () {
  return `<!-- FAQ Schema will be injected via script -->`;
});

hexo.extend.filter.register("after_render:html", function (str, data) {
  // 仅为japan_credit_card文章添加FAQ schema
  if (!data.page || data.page.path !== "japan_credit_card.html") {
    return str;
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "未满半年能在日本开银行账户吗？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "能。虽然未满6个月属于非居住者会有部分限制，但有稳定工作和在职证明的外国人完全可以开户。这是在日工作者成功开户的核心要素。",
        },
      },
      {
        "@type": "Question",
        name: "外国人申请日本信用卡被拒的主要原因是什么？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "主要原因包括：来日时间过短、没有工作证明、频繁申请被拒导致征信受影响。建议先申请容易通过的卡（楽天、Amazon Prime），再逐步申请高端卡。",
        },
      },
      {
        "@type": "Question",
        name: "日本各大银行（三菱、三井、邮储）有什么区别？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "主要区别在手续费、ATM可用性和App体验。三井住友App最好、返点最高（便利店7%）；三菱UFJ作为大行ATM较多；邮储最容易开户但手续费较贵。",
        },
      },
      {
        "@type": "Question",
        name: "没有日本信用卡可以用什么替代方案？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "可使用虚拟信用卡（Kyash、ANA Pay）进行网购，线下使用PayPay或Suica。这些方案可以满足大部分日常支付需求，不需要信用审批。",
        },
      },
      {
        "@type": "Question",
        name: "应该申请哪些日本信用卡？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "推荐顺序：第一步申楽天卡和Amazon Prime Card（高通过率），第二步申bic camera view card（Suica自动充值），第三步申高端卡（JCB、三井住友）。先易后难，避免频繁被拒。",
        },
      },
      {
        "@type": "Question",
        name: "这篇文章与其他日本银行教程有什么区别？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "本文专门针对持工作签证的在日职工，而非留学生或旅游者。涵盖银行开户实战经验、各行对比、手续费分析、信用卡申卡策略等职场人士关心的实际问题。",
        },
      },
    ],
  };

  const schemaScript = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;

  // 在</article>之前插入FAQ schema
  return str.replace("</article>", schemaScript + "\n</article>");
});
