export declare abstract class AstHtmlBase {
    abstract type: string;
    abstract toString(): string;
    parent?: AstElement;
    isRemove: boolean;
    remove(): void;
    replaceWith(ast: AstHtmlBase): boolean;
}
export declare class AstDoctype extends AstHtmlBase {
    value: string;
    parent?: AstElement | undefined;
    type: string;
    constructor(value: string, parent?: AstElement | undefined);
    toString(): string;
}
export declare class AstComment extends AstHtmlBase {
    value: string;
    parent?: AstElement | undefined;
    type: string;
    constructor(value: string, parent?: AstElement | undefined);
    toString(): string;
}
export declare class ClassList implements ArrayLike<string> {
    private element;
    private _cs;
    private _classAttr?;
    constructor(element: AstElement);
    [n: number]: string;
    length: number;
    get value(): string;
    add(str: string): void;
    remove(str: string): void;
    toggle(str: string): void;
    contains(str: string): boolean;
    [Symbol.iterator](): {
        next: () => {
            done: boolean;
            value: string;
        } | {
            done: boolean;
            value?: undefined;
        };
    };
}
export declare class AstElement extends AstHtmlBase {
    name: string;
    attrbutes: AstAttrbute[];
    children: AstHtmlBase[];
    type: string;
    classList: ClassList;
    constructor(name: string, attrbutes?: AstAttrbute[], children?: AstHtmlBase[]);
    get isSelfClosing(): boolean;
    setAttr(name: string, value: string): void;
    toString(): string;
}
export declare class AstAttrbute extends AstHtmlBase {
    name: string;
    value: string;
    parent?: AstElement | undefined;
    type: string;
    constructor(name: string, value: string, parent?: AstElement | undefined);
    replaceWith(ast: AstHtmlBase): boolean;
    toString(): string;
}
export declare class AstText extends AstHtmlBase {
    value: string;
    type: string;
    constructor(value: string);
    toString(): string;
}
export declare function htmlAst(html: string): AstElement;
export declare function traverse(ast: AstElement, hookOptions?: {
    comment?: (comment: AstComment) => void;
    doctype?: (doctype: AstDoctype) => void;
    element?: (node: AstElement) => void;
    text?: (text: AstText) => void;
    attr?: (attr: AstAttrbute) => void;
    [propName: string]: any;
}): Promise<AstElement>;
//# sourceMappingURL=html-static.d.ts.map