import React, { useState, useEffect } from 'react';
import { 
  Editor, 
  EditorState, 
  RichUtils, 
  convertToRaw, 
  convertFromRaw,
  ContentState,
  KeyBindingUtil,
  getDefaultKeyBinding,
} from 'draft-js';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote,
  Heading1,
  Heading2 
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface RichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Enter content...",
  className = "" 
}: RichTextEditorProps) => {
  const [editorState, setEditorState] = useState(() => {
    if (value) {
      try {
        const contentState = convertFromRaw(JSON.parse(value));
        return EditorState.createWithContent(contentState);
      } catch {
        return EditorState.createWithContent(
          ContentState.createFromText(value)
        );
      }
    }
    return EditorState.createEmpty();
  });

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));
    onChange(rawContent);
  }, [editorState, onChange]);

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const keyBindingFn = (e: any) => {
    if (KeyBindingUtil.hasCommandModifier(e)) {
      switch (e.keyCode) {
        case 66: // B
          return 'bold';
        case 73: // I
          return 'italic';
        case 85: // U
          return 'underline';
      }
    }
    return getDefaultKeyBinding(e);
  };

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const getCurrentInlineStyles = () => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return {
      BOLD: currentStyle.has('BOLD'),
      ITALIC: currentStyle.has('ITALIC'),
      UNDERLINE: currentStyle.has('UNDERLINE'),
    };
  };

  const getCurrentBlockType = () => {
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
    return blockType;
  };

  const getBlockStyle = (block: any) => {
    switch (block.getType()) {
      case 'blockquote':
        return 'border-l-4 border-gray-300 pl-4 italic';
      case 'header-one':
        return 'text-2xl font-bold mb-4';
      case 'header-two':
        return 'text-xl font-bold mb-3';
      default:
        return '';
    }
  };

  const currentStyles = getCurrentInlineStyles();
  const currentBlockType = getCurrentBlockType();

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-2 border-b pb-2">
        <ToggleGroup type="multiple" className="justify-start">
          <ToggleGroupItem
            value="BOLD"
            onClick={() => toggleInlineStyle('BOLD')}
            aria-label="Bold"
            data-state={currentStyles.BOLD ? "on" : "off"}
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="ITALIC"
            onClick={() => toggleInlineStyle('ITALIC')}
            aria-label="Italic"
            data-state={currentStyles.ITALIC ? "on" : "off"}
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="UNDERLINE"
            onClick={() => toggleInlineStyle('UNDERLINE')}
            aria-label="Underline"
            data-state={currentStyles.UNDERLINE ? "on" : "off"}
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup type="single" className="justify-start">
          <ToggleGroupItem
            value="header-one"
            onClick={() => toggleBlockType('header-one')}
            aria-label="Heading 1"
            data-state={currentBlockType === 'header-one' ? "on" : "off"}
          >
            <Heading1 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="header-two"
            onClick={() => toggleBlockType('header-two')}
            aria-label="Heading 2"
            data-state={currentBlockType === 'header-two' ? "on" : "off"}
          >
            <Heading2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="blockquote"
            onClick={() => toggleBlockType('blockquote')}
            aria-label="Quote"
            data-state={currentBlockType === 'blockquote' ? "on" : "off"}
          >
            <Quote className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="unordered-list-item"
            onClick={() => toggleBlockType('unordered-list-item')}
            aria-label="Bullet List"
            data-state={currentBlockType === 'unordered-list-item' ? "on" : "off"}
          >
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="ordered-list-item"
            onClick={() => toggleBlockType('ordered-list-item')}
            aria-label="Numbered List"
            data-state={currentBlockType === 'ordered-list-item' ? "on" : "off"}
          >
            <ListOrdered className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className={`border rounded-md p-4 min-h-[200px] ${className}`}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFn}
          placeholder={placeholder}
          blockStyleFn={getBlockStyle}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;