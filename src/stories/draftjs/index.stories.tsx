import React, { useState, Fragment } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import {Editor, EditorState} from 'draft-js';

export default {
  title: 'react-demos/draftjs',
  component: Editor,
} as Meta;

const Template: Story<any> = (args) => {
  const [editorState, setEditorState]= useState(EditorState.createEmpty());
  const handleEditorState = (editorState) => {
    console.log(editorState.toJS());
    setEditorState(editorState);
  };

  return (
    <div className="editor">
      <Editor
        editorState={editorState}
        onChange={handleEditorState}
      />
    </div>
  )
};

export const Generic = Template.bind({});
Generic.args = {
};
Generic.storyName = 'generic';