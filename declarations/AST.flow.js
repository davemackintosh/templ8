// @flow

declare type AST = {
  type: string,
  tagName?: string,
  attrs?: Object,
  style?: Object,
  children?: Array<AST>,
  text?: string
}
