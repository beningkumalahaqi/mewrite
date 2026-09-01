import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'

export const editorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    codeBlock: {
      HTMLAttributes: {
        class: 'editor-code-block',
      },
    },
    code: {
      HTMLAttributes: {
        class: 'editor-inline-code',
      },
    },
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true,
    HTMLAttributes: {
      class: 'editor-link',
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),
  Placeholder.configure({
    placeholder: 'Begin writing…',
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
    defaultAlignment: 'left',
  }),
  Highlight.configure({
    multicolor: false,
  }),
  Typography,
]
