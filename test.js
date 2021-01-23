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

let ast = htmlAst(data);
const reverse = (str) => str.split("").reverse().join("");
traverse(ast, {
  text(text) {
    text.value = reverse(text.value);
  },
  attr_title(attr) {
    attr.value = reverse(attr.value);
  },
}).then((_) => {
  console.log(ast.toString());
});
