<br/>
<p align="center"><strong>Previous:</strong><br/><a href="./adding-event-handlers.md">Adding Event Handlers</a></p>
<br/>

# Defining Custom Block Nodes

In our previous example, we started with a paragraph, but we never actually told Slate anything about the `paragraph` block type. We just let it use its internal default renderer, which uses a plain old `<div>`.

But that's not all you can do. Slate lets you define any type of custom blocks you want, like block quotes, code blocks, list items, etc.

We'll show you how. Let's start with our app from earlier:

```js
const App = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Editable
      editor={editor}
      value={value}
      onChange={newValue => setValue(newValue)}
      onKeyDown={event => {
        if (event.key === '&') {
          event.preventDefault()
          editor.exec({ type: 'insert_text', text: 'and' })
        }
      }}
    />
  )
}
```

Now let's add "code blocks" to our editor.

The problem is, code blocks won't just be rendered as a plain paragraph, they'll need to be rendered differently. To make that happen, we need to define a "renderer" for `code` element nodes.

Element renderers are just simple React components, like so:

```js
// Define a React component renderer for our code blocks.
const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}
```

Easy enough.

See the `props.attributes` reference? Slate passes attributes that should be rendered on the top-most element of your blocks, so that you don't have to build them up yourself. You **must** mix the attributes into your component.

And see that `props.children` reference? Slate will automatically render all of the children of a block for you, and then pass them to you just like any other React component would, via `props.children`. That way you don't have to muck around with rendering the proper text nodes or anything like that. You **must** render the children as the lowest leaf in your component.

And here's a component for the "default" elements:

```js
const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}
```

Now, let's add that renderer to our `Editor`:

```js
const App = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  return (
    <Editable
      editor={editor}
      value={value}
      // Pass in the `renderElement` function.
      renderElement={renderElement}
      onChange={newValue => setValue(newValue)}
      onKeyDown={event => {
        if (event.key === '&') {
          event.preventDefault()
          editor.exec({ type: 'insert_text', text: 'and' })
        }
      }}
    />
  )
}

const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}
```

Okay, but now we'll need a way for the user to actually turn a block into a code block. So let's change our `onKeyDown` function to add a `Ctrl-\`` shortcut that does just that:

```js
// Import the `Editor` helpers from Slate.
import { Editor } from 'slate'

const App = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  return (
    <Editable
      editor={editor}
      value={value}
      renderElement={renderElement}
      onChange={newValue => setValue(newValue)}
      onKeyDown={event => {
        if (event.key === '`' && event.ctrlKey) {
          // Prevent the "`" from being inserted by default.
          event.preventDefault()
          // Otherwise, set the currently selected blocks type to "code".
          Editor.setNodes(editor, { type: 'code' }, { match: 'block' })
        }
      }}
    />
  )
}

const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}
```

Now, if you press `Ctrl-\`` the block your cursor is in should turn into a code block! Magic!

But we forgot one thing. When you hit `Ctrl-\`` again, it should change the code block back into a paragraph. To do that, we'll need to add a bit of logic to change the type we set based on whether any of the currently selected blocks are already a code block:

```js
const App = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  return (
    <Editable
      editor={editor}
      value={value}
      renderElement={renderElement}
      onChange={newValue => setValue(newValue)}
      onKeyDown={event => {
        if (event.key === '`' && event.ctrlKey) {
          event.preventDefault()
          // Determine whether any of the currently selected blocks are code blocks.
          const { selection } = editor.value
          const isCode = selection
            ? Editor.match(editor, selection, { type: 'code' })
            : false

          // Toggle the block type depending on `isCode`.
          Editor.setNodes(
            editor,
            { type: isCode ? 'paragraph' : 'code' },
            { match: 'block' }
          )
        }
      }}
    />
  )
}
```

And there you have it! If you press `Ctrl-\`` while inside a code block, it should turn back into a paragraph!

<br/>
<p align="center"><strong>Next:</strong><br/><a href="./applying-custom-formatting.md">Applying Custom Formatting</a></p>
<br/>