/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, [{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      <anchor />w<focus />
      ord
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">
        <anchor />w<focus />
      </mark>
      ord
    </block>
  </value>
)