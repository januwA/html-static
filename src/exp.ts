/**
 * 匹配html标签名
 *
 * app-home
 *
 * appHome
 */
export const ncname = "[a-zA-Z_][\\w\\-\\.]*";

// 打组
export const qnameCapture = `((?:${ncname}\\:)?${ncname})`;

/**
 * 匹配tag: <([a-zA-Z_][\w\-\.]*)
 * 匹配任意个属性: (?<attributes>(?:\s*(?:[^\s"'<>\/=]+)\s*(?:=\s*(?:"(?:[^"]*)"+|'(?:[^']*)'+|(?:[^\s"'=<>`]+)))?)*)
 * 结尾: \s*(?<unary>\/?)>
 *
 * 匹配属性可能会存在单个的，比如 checked autoplay，这时默认的值是boolean类型的，并且为true
 * 除非手动填写 checked=false 这种
 *
 * 关于属性是boolean值
 * https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
 *
 */
export const startTagExp = /^<(?<tagName>[a-zA-Z_][\w\-\.]*)(?<attributes>(?:\s*(?:[^\s"'<>\/=]+)\s*(?:=\s*(?:"(?:[^"]*)"+|'(?:[^']*)'+|(?:[^\s"'=<>`]+)))?)*)\s*(?<unary>\/?)>/;

/**
 * 匹配起始标签的属性
 * class="title"
 * class='title'
 * class=title
 * class=
 * #ref
 */
export const attributeExp = /\s*(?<name>[^\s"'<>\/=]+)\s*(?:=\s*(?:"(?<v1>[^"]*)"+|'(?<v2>[^']*)'+|(?<v3>[^\s"'=<>`]+)))?/;

// 匹配结束的tag
export const endTagExp = new RegExp(`^<\\/${qnameCapture}[^>]*>\\s*`);

// 匹配html注释
export const htmlCommentExp = /^<!--([^]*?)-->/;
export const doctype = /^<!\w+\s*([^>]*)>/i;

export const script_styleElementExp = /^<(?<name>script|style)[^>]*>(?<value>[^]*?)<\/(?:script|style)>/i;
