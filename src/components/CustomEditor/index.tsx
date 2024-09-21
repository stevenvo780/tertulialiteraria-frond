import React, { useEffect, useState, useRef } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import EditorCode from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import TemplateSlider from './TemplateSlider';
import { Button } from 'react-bootstrap';

interface CustomEditorProps {
  content: string;
  setContent: (content: string) => void;
  templateType?: string;
  height?: number;
}

interface BlobInfo {
  filename(): string;
  blob(): Blob;
  base64(): string;
  id(): string;
  uri(): string;
}

const CustomEditor: React.FC<CustomEditorProps> = ({
  content,
  setContent,
  templateType = '',
  height = 500,
}) => {
  const [editorContent, setEditorContent] = useState(content);
  const [viewMode, setViewMode] = useState<'editor' | 'html'>('editor');

  const editorRef = useRef<any>(null);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setContent(content);
  };

  const handleApplyChanges = () => {
    setContent(editorContent);
  };

  const getCSSVariable = (variable: string): string => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  };

  const colorPalette = [
    getCSSVariable('--primary-color'),
    getCSSVariable('--primary-hover'),
    getCSSVariable('--primary-border'),
    getCSSVariable('--primary-text'),
    getCSSVariable('--secondary-color'),
    getCSSVariable('--secondary-hover'),
    getCSSVariable('--secondary-border'),
    getCSSVariable('--secondary-text'),
    getCSSVariable('--info-color'),
    getCSSVariable('--info-hover'),
    getCSSVariable('--info-border'),
    getCSSVariable('--info-text'),
    getCSSVariable('--success-color'),
    getCSSVariable('--success-hover'),
    getCSSVariable('--success-border'),
    getCSSVariable('--success-text'),
    getCSSVariable('--warning-color'),
    getCSSVariable('--warning-hover'),
    getCSSVariable('--warning-border'),
    getCSSVariable('--warning-text'),
    getCSSVariable('--danger-color'),
    getCSSVariable('--danger-hover'),
    getCSSVariable('--danger-border'),
    getCSSVariable('--danger-text'),
    getCSSVariable('--link-color'),
    getCSSVariable('--link-hover'),
    getCSSVariable('--link-border'),
    getCSSVariable('--link-text'),
    getCSSVariable('--discord-color'),
    getCSSVariable('--discord-text'),
    getCSSVariable('--online-color'),
    getCSSVariable('--white-color'),
    getCSSVariable('--font-color'),
    getCSSVariable('--bg-color'),
    getCSSVariable('--border-color'),
    getCSSVariable('--card-color'),
    getCSSVariable('--card-hover'),
    getCSSVariable('--card-border'),
    getCSSVariable('--card-text'),
  ];

  const tinyMCEInit: Record<string, any> = {
    height: height,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount',
    ],
    toolbar:
      'undo redo | formatselect | bold italic forecolor backcolor | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | removeformat | image | code',
    content_style: `body { 
      font-family:Helvetica,Arial,sans-serif; 
      font-size:14px; 
      color: ${getCSSVariable('--font-color')}; 
      background-color: ${getCSSVariable('--white-color')}; 
    }`,
    color_map: colorPalette.flatMap((color) => [color, color]),
    images_upload_handler: (
      blobInfo: BlobInfo,
      success: (url: string) => void,
      failure: (err: string) => void,
      progress?: (percent: number) => void
    ) => {
      success('data:' + blobInfo.blob().type + ';base64,' + blobInfo.base64());
    },
    setup: (editor: any) => {
      editor.ui.registry.addButton('customImageButton', {
        text: 'Insert Image',
        onAction: () => {
          editor.execCommand('mceImage');
        },
      });
    },
  };

  return (
    <>
      {viewMode === 'editor' ? (
        <TinyMCEEditor
          apiKey='ide9bzali9973f0fmbzusywuxlpp3mxmigqoa07eddfltlrj'
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={editorContent}
          onEditorChange={handleEditorChange}
          init={tinyMCEInit}
        />
      ) : (
        <EditorCode
          value={editorContent}
          onValueChange={(code) => setEditorContent(code)}
          highlight={(code) => Prism.highlight(code, Prism.languages.html, 'html')}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            border: `1px solid ${getCSSVariable('--border-color')}`,
            borderRadius: '4px',
            height: `${height}px`,
            overflow: 'auto',
            backgroundColor: getCSSVariable('--white-color'),
            color: getCSSVariable('--font-color'),
          }}
        />
      )}
      <br />
      <div className="d-flex justify-content-between mb-3">
        <Button
          variant="primary"
          onClick={() => setViewMode(viewMode === 'editor' ? 'html' : 'editor')}
          size="sm"
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = getCSSVariable('--primary-hover');
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = getCSSVariable('--primary-color');
          }}
        >
          {viewMode === 'editor' ? 'Ver HTML' : 'Ver Editor'}
        </Button>
        {viewMode === 'html' && (
          <Button
            variant="success"
            onClick={handleApplyChanges}
            size="sm"
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = getCSSVariable('--success-hover');
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = getCSSVariable('--success-color');
            }}
          >
            Aplicar Cambios
          </Button>
        )}
      </div>
      <TemplateSlider
        templateType={templateType || ''}
        onTemplateClick={(templateContent: string) => {
          setEditorContent(templateContent);
          setContent(templateContent);
        }}
      />
    </>
  );
};

export default CustomEditor;
