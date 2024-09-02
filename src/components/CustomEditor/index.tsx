import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import EditorCode from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import TemplateSlider from './TemplateSlider';
import { Button } from 'react-bootstrap';
import CustomImageUpload from './CustomImageUpload';

interface CustomEditorProps {
  content: string;
  setContent: (content: string) => void;
  templateType?: string;
  height?: number;
}

const CustomEditor: React.FC<CustomEditorProps> = ({
  content,
  setContent,
  templateType = null,
  height = 500,
}) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [viewMode, setViewMode] = useState<'editor' | 'html'>('editor');
  const [htmlContent, setHtmlContent] = useState(content);

  useEffect(() => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
    setHtmlContent(htmlContent);
    setContent(htmlContent);
  }, [editorState, setContent]);

  const handleApplyChanges = () => {
    const contentBlock = htmlToDraft(htmlContent);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, contentBlock.entityMap);
    setEditorState(EditorState.createWithContent(contentState));
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => setViewMode(viewMode === 'editor' ? 'html' : 'editor')} size='sm'>
          {viewMode === 'editor' ? 'Ver HTML' : 'Ver Editor'}
        </Button>
        {viewMode === 'html' && (
          <Button variant="success" onClick={handleApplyChanges} size='sm'>
            Aplicar Cambios
          </Button>
        )}
      </div>

      {viewMode === 'editor' ? (
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={setEditorState}
          toolbarCustomButtons={[<CustomImageUpload editorState={editorState} onEditorStateChange={setEditorState} />]}
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'link', 'image', 'emoji', 'history'],
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            image: {
              urlEnabled: false,
              uploadEnabled: false,
              alignmentEnabled: true,
              inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
              alt: { present: true, mandatory: false },
              defaultSize: {
                height: 'auto',
                width: 'auto',
              },
            },
          }}
          editorStyle={{ height: `${height}px`, border: "1px solid #F1F1F1", padding: "10px" }}
        />
      ) : (
        <EditorCode
          value={htmlContent}
          onValueChange={setHtmlContent}
          highlight={code => Prism.highlight(code, Prism.languages.html, 'html')}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            border: "1px solid #F1F1F1",
            borderRadius: "4px",
            height: `${height}px`,
            overflow: 'auto',
            backgroundColor: "#f5f5f5"
          }}
        />
      )}
      <TemplateSlider 
        templateType={templateType || ''} 
        onTemplateClick={(templateContent: string) => {
          const contentBlock = htmlToDraft(templateContent);
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, contentBlock.entityMap);
          setEditorState(EditorState.createWithContent(contentState));
        }} 
      />
    </>
  );
};

export default CustomEditor;
