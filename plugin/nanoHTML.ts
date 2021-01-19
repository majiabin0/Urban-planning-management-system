const { minify } = require("html-minifier");

export default (api: any) => {
  api.modifyProdHTMLContent((html: string) => {
    return minify(html, {
      removeComments: true,
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true
    });
  });
};
