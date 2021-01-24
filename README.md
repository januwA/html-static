## html-static

parse html string and transform

## install

```sh
$ npm install html-static
```

## Example
```js
const { htmlAst, traverse } = require("html-static");

let data = `
<!DOCTYPE html>
<html>
  <body title="hello">
    body
    <h1 id="app">abc</h1>
    <p class='foo'>def</p>
  </body>
</html>
`;

const ast = htmlAst(data);

const reverse = (str) => str.split("").reverse().join("");

traverse(ast, {
  text(text) {
    text.value = reverse(text.value);
  },
  attr_title(attr) {
    attr.value = reverse(attr.value);
  },
}).then((_) => {
  console.log(ast.toString()); // <!DOCTYPE html><html><body title="olleh"> ydob <h1 id="app">cba</h1><p class="foo">fed</p></body></html>
});
```

## traverse options
```ts
{
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
```