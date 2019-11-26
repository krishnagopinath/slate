/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'anchor', reverse: true })
}

export const input = (
  <value>
    <block>
      one <anchor />
      tw
      <focus />o three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <anchor /> tw
      <focus />o three
    </block>
  </value>
)