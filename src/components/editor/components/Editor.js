import React, { Component } from 'react'
import PluginEditor, { composeDecorators } from 'draft-js-plugins-editor'
import addImageFn from '../plugins/image/addImage'
import Prism from 'prismjs'
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-swift';
/* Plugins */
import createFocusPlugin from 'draft-js-focus-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createSidebarPlugin from '../plugins/sidebar'
import createImagePlugin from '../plugins/image'
import createToolbarPlugin from '../plugins/toolbar'
import colorPicker from '../plugins/colorPicker'
import createPrismPlugin from '../plugins/prism'
import createCodeEditorPlugin from '../plugins/code'
import createMarkdownPlugin from 'draft-js-markdown-plugin'
import { renderLanguageSelect } from './LanguageSelect'
import createEmbedPlugin from '../plugins/embed'
import createDividerPlugin from '../plugins/divider'
import createLinkPlugin from '../plugins/link'
import createMentionPlugin from '../plugins/mentions'

/* Focus */
const focusPlugin = createFocusPlugin()

/* DnD */
const dndPlugin = createBlockDndPlugin();

/* Decorators */
const decorator = composeDecorators(
  focusPlugin.decorator,
  dndPlugin.decorator
);

/* Linkify */
const linkifyPlugin = createLinkifyPlugin({
  target: '_blank'
})

/* Sidebar */
const sidebarPlugin = createSidebarPlugin()
const { Sidebar } = sidebarPlugin

/* Image */
const imagePlugin = createImagePlugin({
  decorator
})

/* Toolbar */
const toolbarPlugin = createToolbarPlugin()
const { Toolbar } = toolbarPlugin

/* Prism */
const prismPlugin = createPrismPlugin({
  prism: Prism
})

/* Code editor */
const codePlugin = createCodeEditorPlugin()

/* Markdown */
const markdownPlugin = createMarkdownPlugin({
  renderLanguageSelect
})

/* Embed */
const embedPlugin = createEmbedPlugin()

/* Divider */
const dividerPlugin = createDividerPlugin()

/* Link */
const linkPlugin = createLinkPlugin()

/* Mention */
const mentionPlugin = createMentionPlugin()
const { MentionSuggestions } = mentionPlugin

/* All plugins */
const plugins = [
  linkPlugin,
  linkifyPlugin,
  sidebarPlugin,
  imagePlugin,
  toolbarPlugin,
  prismPlugin,
  codePlugin,
  markdownPlugin,
  focusPlugin,
  embedPlugin,
  dividerPlugin,
  mentionPlugin
]

type Props = {
  mentionSearchAsync: Function,
  editorState: any
}

type State = {
  suggestions: Array<Object>
}

class Editor extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.editor = React.createRef()
    this.state = {
      suggestions: []
    }
  }

  onChange = (editorState) => {
    this.props.onChange(editorState)
  }

  handleDroppedFiles = (selection, files) => {
    const { editorState, onChange } = this.props
    // Add images to editorState
    for (var i = 0, file; (file = files[i]); i++) {
      onChange(addImageFn(editorState, window.URL.createObjectURL(file), { file }));
    }
  };

  onSearchChange = ({ value }) => {
    const { mentionSearchAsync } = this.props
    if (mentionSearchAsync) {
      this.props.mentionSearchAsync(value)
        .then((data) => { this.setState({suggestions: data.suggestions}) })
    }
  }

  render () {
    const { state, mentionSearchAsync, onChange, readOnly, ...restProps } = this.props
    return (
      <div className='draftjs-web-editor'>
        <PluginEditor
          editorState={state}
          onChange={this.onChange}
          customStyleMap={colorPicker.colorStyleMap}
          handleDroppedFiles={this.handleDroppedFiles}
          plugins={plugins}
          ref={this.editor.current}
          readOnly={readOnly}
          {...restProps}
        />
        <Sidebar
          onChange={this.onChange}
          editorState={state}
          readOnly={readOnly}
        />
        <Toolbar />
        <MentionSuggestions
          onSearchChange={this.onSearchChange}
          suggestions={this.state.suggestions}
          onClose={() => this.setState({suggestions: []})}
        />
      </div>
    )
  }
}

export default Editor