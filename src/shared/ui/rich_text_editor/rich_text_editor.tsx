import ReactQuill from 'react-quill-new';
import { AlertCircle } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block', 'link', 'image'],
    ['clean'],
  ],
};

export function RichTextEditor({ label, value, onChange, error, hint, placeholder }: RichTextEditorProps) {
  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm font-medium text-ink-700">{label}</label>}
      <div
        className={`rounded-xl border overflow-hidden [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[240px] [&_.ql-editor]:text-sm [&_.ql-toolbar]:bg-ink-50 ${
          error ? 'border-red-400' : 'border-ink-200'
        }`}
      >
        <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} placeholder={placeholder} />
      </div>
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}
