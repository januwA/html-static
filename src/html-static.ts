import {
  attributeExp,
  doctype,
  endTagExp,
  htmlCommentExp,
  script_styleElementExp,
  startTagExp,
} from "./exp";

export abstract class AstHtmlBase {
  abstract type: string;
  abstract toString(): string;

  parent?: AstElement;
  isRemove: boolean = false;
  remove() {
    this.isRemove = true;
  }
  replaceWith(ast: AstHtmlBase) {
    if (this.parent) {
      const index = this.parent.children.findIndex((it) => it === this);
      ast.parent = this.parent;
      this.parent.children.splice(index, 1, ast);
      return true;
    }
    return false;
  }
}

export class AstDoctype extends AstHtmlBase {
  type = "doctype";

  constructor(public value: string, public parent?: AstElement) {
    super();
  }

  toString(): string {
    return this.isRemove ? "" : `<!DOCTYPE ${this.value}>`;
  }
}

export class AstComment extends AstHtmlBase {
  type = "comment";
  constructor(public value: string, public parent?: AstElement) {
    super();
  }

  toString(): string {
    return this.isRemove ? "" : `<!--${this.value}-->`;
  }
}

const SELFCLOSING = [
  "br",
  "hr",
  "area",
  "base",
  "img",
  "input",
  "link",
  "meta",
  "basefont",
  "param",
  "col",
  "frame",
  "embed",
  "keygen",
  "source",
  "command",
  "track",
  "wbr",
];

export class ClassList implements ArrayLike<string> {
  private _cs: string[] = [];
  private _classAttr?: AstAttrbute;

  constructor(private element: AstElement) {
    this._classAttr = element.attrbutes.find((it) => it.name === "class");
    if (this._classAttr) {
      this._cs = this._classAttr.value.split(/\s+/);
      for (let i = 0; i < this._cs.length; i++) this[i] = this._cs[i];
      this.length = this._cs.length;
    }
  }

  [n: number]: string;

  length: number = 0;

  get value() {
    return this._classAttr?.value ?? "";
  }

  /**
   * add class item
   * @param str
   */
  add(str: string) {
    this[this.length] = str;
    this.length = this._cs.push(str);
    if (this._classAttr) {
      this._classAttr.value = this._cs.join(" ");
    } else {
      this._classAttr = new AstAttrbute("class", str, this.element);
      this.element.attrbutes.push(this._classAttr);
    }
  }

  /**
   * remove class item
   * @param str
   */
  remove(str: string) {
    if (this._cs.includes(str)) {
      delete this[this.length];
      this._cs = this._cs.filter((it) => it !== str);
      this._classAttr!.value = this._cs.join(" ");
      this.length = this._cs.length;
    }
  }

  toggle(str: string) {
    if (this._cs.includes(str)) {
      this.remove(str);
    } else {
      this.add(str);
    }
  }

  contains(str: string) {
    return this._cs.includes(str);
  }

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.length) {
          return {
            done: false,
            value: this[index++],
          };
        } else {
          return {
            done: true,
          };
        }
      },
    };
  }
}

export class AstElement extends AstHtmlBase {
  type = "element";
  classList: ClassList;
  constructor(
    public name: string,
    public attrbutes: AstAttrbute[] = [],
    public children: AstHtmlBase[] = []
  ) {
    super();
    this.classList = new ClassList(this);
  }

  /**
   * 判断是否为自闭和标签
   */
  get isSelfClosing() {
    return SELFCLOSING.indexOf(this.name) !== -1;
  }

  setAttr(name: string, value: string) {
    this.attrbutes.push(new AstAttrbute(name, value, this));
    if (name === "class") this.classList = new ClassList(this);
  }

  toString() {
    let htmlString = ``;
    if (this.isRemove) return htmlString;

    if (this.name === "document") {
      return this.children.map((e) => e.toString()).join("");
    }

    let attrs = this.attrbutes.reduce(
      (acc, item) => (acc += ` ${item.toString()}`),
      ""
    );

    if (this.isSelfClosing) {
      htmlString = `<${this.name}${attrs}>`;
    } else {
      htmlString = `<${this.name}${attrs}>${this.children
        .map((e) => e.toString())
        .join("")}</${this.name}>`;
    }
    return htmlString;
  }
}

export class AstAttrbute extends AstHtmlBase {
  type = "attr";

  /**
   *
   * `<h1 class="a">My First Heading</h1>`
   *
   * @param name class
   * @param value a
   * @param parent h1
   */
  constructor(
    public name: string,
    public value: string,
    public parent?: AstElement
  ) {
    super();
  }

  replaceWith(ast: AstHtmlBase): boolean {
    if (ast instanceof AstAttrbute) return super.replaceWith(ast);
    return false;
  }

  toString() {
    return this.isRemove ? "" : `${this.name}="${this.value}"`;
  }
}

export class AstText extends AstHtmlBase {
  type = "text";
  constructor(public value: string) {
    super();
  }

  toString() {
    return this.isRemove ? "" : `${this.value}`;
  }
}

/**
 * 将html字符串转化为ast
 * https://astexplorer.net/
 */
export function htmlAst(html: string): AstElement {
  const _root = new AstElement("document");

  /**
   * 存储未匹配完成的起始标签
   * 如：<div><span></span></div>
   * 那么: div,span会被添加到[bufArray]
   * 当开始标签匹配完后，就开始匹配结束标签[parseEndTag]: </span></div>
   */
  const startTagBuffer: AstElement[] = [];
  let isChars: boolean; // 是不是文本内容
  let match: RegExpMatchArray | null;
  let last;

  while (html && last != html) {
    last = html;
    isChars = true;

    match = html.match(doctype);
    if (match) {
      isChars = false;
      stepHtml();
      pushChild(new AstDoctype(match[1]));
    } else {
      isChars = true;
    }

    match = html.match(htmlCommentExp);
    if (match) {
      isChars = false;
      stepHtml();
      pushChild(new AstComment(match[1]));
    } else {
      isChars = true;
    }

    // 在匹配标签之前先匹配style和script
    match = html.match(script_styleElementExp);
    if (match && match.groups) {
      isChars = false;
      stepHtml();
      const style = new AstElement(match.groups.name!);
      style.children.push(new AstText(match.groups.text!));
      pushChild(style);
    }

    match = html.match(endTagExp); // 匹配结束tag
    if (match) {
      isChars = false;
      stepHtml();
      parseEndTag(match[1]);
    } else {
      isChars = true;
    }

    match = html.match(startTagExp); // 匹配起始tag
    if (match) {
      isChars = false;
      stepHtml();
      parseStartTag({
        tagName: match.groups!.tagName.toLowerCase(),
        attrs: match.groups!.attributes || "",
        unary: !!match.groups!.unary,
      });
    } else {
      isChars = true;
    }

    if (isChars) {
      // 直到下一个标签或注释，都当作文本处理
      let index = html.indexOf("<");
      let text;
      if (index < 0) {
        // 就是纯文本
        text = html;
        html = "";
      } else {
        text = html.substring(0, index);
        html = html.substring(index);
      }

      // 过滤空文本
      if (text.trim()) pushChild(new AstText(text));
    }
  }

  function stepHtml() {
    if (!match) return;
    html = html.substring(match[0].length + match.index! || 0);
  }

  function pushChild(child: AstHtmlBase) {
    // 如果为0， 则一个根元素被解析完毕
    // 或则是最顶层原始，doctype,html
    if (startTagBuffer.length === 0) {
      child.parent = _root;
      _root.children.push(child);
    } else {
      const parent: AstElement = startTagBuffer[startTagBuffer.length - 1];
      if (!html.trim()) throw `pushChild error: 标签(${parent.name})未正确闭合`;
      child.parent = parent;
      parent.children.push(child);
    }
  }

  function parseStartTag({
    tagName,
    attrs,
    unary,
  }: {
    tagName: string;
    attrs: string;

    /**
     * 是否为自闭和标签,最后那个匹配(\/?)的分组
     */
    unary: boolean;
  }) {
    const astElement: AstElement = new AstElement(tagName);
    // 解析所有的attributes
    while (attrs.trim()) {
      const attrMatch = attrs.match(attributeExp);
      if (attrMatch) {
        const name = attrMatch.groups!.name;
        const value =
          attrMatch.groups!.v1 ??
          attrMatch.groups!.v2 ??
          attrMatch.groups!.v3 ??
          "";
        astElement.setAttr(name, value);
        attrs = attrs.substring(attrMatch[0].length);
      } else {
        break;
      }
    }

    if (unary || astElement.isSelfClosing) {
      pushChild(astElement);
    } else {
      // 非自关闭标签，将被缓存到[startTagBuffer]
      startTagBuffer.push(astElement);
    }
  }

  function parseEndTag(endtagName: string) {
    const last: undefined | AstElement = startTagBuffer.pop();
    if (!last) {
      console.log(html.slice(0, 100));

      throw new Error(`parseEndTag error: endtagName: ${endtagName}`);
    }

    if (last.name.toLowerCase() !== endtagName.toLowerCase()) {
      console.log(html);
      throw `parseEndTag Error: The start tag (${last.name.toLowerCase()}) and the end tag (${endtagName.toLowerCase()}) do not match`;
    }
    pushChild(last);
  }

  return _root;
}

async function callHook(f?: Function, arg?: any) {
  if (f) await f(arg);
}

/**
 * transform html ast
 * @param ast
 * @param hookOptions
 */
export async function traverse(
  ast: AstElement,
  hookOptions?: {
    // Hook all comments
    comment?: (comment: AstComment) => void;

    // Hook all doctype
    doctype?: (doctype: AstDoctype) => void;

    // Hook all element
    element?: (node: AstElement) => void;

    // Hook all textContent
    text?: (text: AstText) => void;

    // Hook all attrburte
    attr?: (attr: AstAttrbute) => void;

    /**
     * element_<node name>: (node: AstElement) => void;
     * attr_<attr name>: (node: AstTextAttrbute) => void;
     * id_<id value>: (node: AstElement) => void;
     * class_<class value>: (node: AstElement) => void;
     *
     * Hook all divs
     * element_div: (node: AstElement) => void;
     *
     * Hook all title attributes
     * attr_title: (node: AstTextAttrbute) => void;
     *
     * Hook all elements with id="app"
     * id_app: (node: AstElement) => void;
     *
     * Hook all the elements that contain app in the class attribute
     * class_app: (node: AstElement) => void;
     */
    [propName: string]: any;
  }
) {
  if (!hookOptions) hookOptions = {};
  for (const node of ast.children) {
    if (node instanceof AstComment) {
      await callHook(hookOptions.comment, node);
    } else if (node instanceof AstDoctype) {
      await callHook(hookOptions.doctype, node);
    } else if (node instanceof AstElement) {
      // class_*
      for (const str of node.classList)
        await callHook(hookOptions[`class_${str}`], node);

      // id_*
      const id_attr = node.attrbutes.find((atrr) => atrr.name === "id");
      if (id_attr) await callHook(hookOptions[`id_${id_attr.value}`], node);

      for (const attr of node.attrbutes) {
        // attr_*
        await callHook(hookOptions[`attr_${attr.name}`], attr);

        // attr
        await callHook(hookOptions.attr, attr);
      }

      // element_*
      await callHook(hookOptions[`element_${node.name}`], node);
      // element
      await callHook(hookOptions.element, node);
      await traverse(node, hookOptions);
    } else if (node instanceof AstText) {
      await callHook(hookOptions.text, node);
    }
  }
  return ast;
}