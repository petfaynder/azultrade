'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEEditorProps {
  value: string;
  onEditorChange: (content: string, editor: any) => void;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ value, onEditorChange }) => {
  return (
    <Editor
      apiKey="y1a6t0pzt220sy2vms1hute5lgu2ofzy0h49jpdua6a36w5c" // Buraya TinyMCE API anahtarınızı ekleyin
      value={value}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
      onEditorChange={onEditorChange}
    />
  );
};

export default TinyMCEEditor;