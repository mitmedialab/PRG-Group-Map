export const toAttr = (text) => {
    return text
    //   var urlRegex = /(https?:\/\/[^\s]+)/g;
    //   text = typeof text === "object" ? JSON.stringify(text) : text;
    //   return text.toString().replace(urlRegex, '<a href="$1">$1</a>');
};

export const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};