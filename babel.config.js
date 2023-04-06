module.exports = {
  presets: [
    '@vue/app'
  ],

  // 引入prismjs
  plugins: [
    ["prismjs", {
      // 配置语言
      "languages": [
        "javascript", "css", "markup", 
        "c", "cpp", "csharp", 
        "java", "python", "go",
        "git", "yaml"
      ],
      // 配置插件
      "plugins": [
        // 显示行号
        "line-numbers", 
        // 显示语言
        "show-language", 
        // 样式预览
        "previewers",    
        // 括号匹配  
        "match-braces",
        // 工具栏
        "toolbar",
        // 下载按钮
        "download-button", 
        // 复制剪贴板按钮    
        "copy-to-clipboard"
      ], 
      // 主题风格
      "theme": "okaidia", 
      "css": true
    }]
  ],
}
