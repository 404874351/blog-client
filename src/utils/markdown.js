var MarkdownIt = require('markdown-it')
var md = new MarkdownIt({
  // 转换段落里的 '\n' 到 <br>。
  breaks: true,
})
    
/**
 * markdown转html
 */
const markdownToHtml = (markdown) => {
  return md.render(markdown)
}



export {
  markdownToHtml,
};
