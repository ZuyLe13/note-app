/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import { debounce } from '@mui/material'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import { useLoaderData, useLocation, useSubmit } from 'react-router-dom'

export default function Note() {
  const { note } = useLoaderData()
  const submit = useSubmit()
  const location = useLocation()
  const [editorState, setEditorState] = useState(() => {
    return EditorState.createEmpty()
  })
  const [rawHTML, setRawHTML] = useState(note.content)

  useEffect(() => {
    const blocksFromHTML = convertFromHTML(note.content)
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    )
    setEditorState(EditorState.createWithContent(state))
  }, [note.id])

  useEffect(() => {
    debounceMemorized(rawHTML, note, location.pathname)
  }, [rawHTML, location.pathname])

  // Kỹ thuật debounce
  const debounceMemorized = useMemo(() => {
    return debounce((rawHTML, note, pathname) => {
      if (rawHTML === note.content) return

      submit({ ...note, content: rawHTML }, {
        method: 'POST',
        action: pathname
      })
    }, 1000)
  }, [])

  useEffect(() => {
    setRawHTML(note.content)
  }, [note.content])

  const handleOnChange = (e) => {
    setEditorState(e)
    setRawHTML(draftToHtml(convertToRaw(e.getCurrentContent())))
  }

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={handleOnChange}
      placeholder='Write something!!!'
    />
  )
}