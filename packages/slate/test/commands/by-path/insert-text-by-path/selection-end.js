/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertTextByPath([0, 0], 3, 'x')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">
          w<anchor />or<focus />d
        </text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w<anchor />orx<focus />d
      </paragraph>
    </document>
  </value>
)