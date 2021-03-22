export default {
  lengthFilter(content, count) {
    content = content.replace(/(^\s*)/g, '');
    if (content.replace(/[^\x00-\xff]/g, '**').length <= count) {
      return content;
    }

    let result = '';
    for (var i = 0, j = 0; i < content.length; i++) {
      (/[\x00-\xff]/.test(content.charAt(i))) ? j++ : j += 2;

      if (j <= count) {
        result += content.charAt(i);
      } else {
        return result;
      }
    }
  },

  all(content, count) {
    return (count != null) ? this.lengthFilter(content, count) : content;
  },

  getContentLength(content) {
    const length = content.replace(/[^\x00-\xff]/g, '**').length;
    return length;
  }
};

