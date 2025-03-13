
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, File } from 'lucide-react';
import { Document } from '@/lib/types';

interface FileUploadProps {
  onFilesSelected: (documents: Document[]) => void;
  existingDocuments?: Document[];
  className?: string;
}

export function FileUpload({ onFilesSelected, existingDocuments = [], className }: FileUploadProps) {
  const [documents, setDocuments] = useState<Document[]>(existingDocuments);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newDocuments: Document[] = [];
    
    Array.from(e.target.files).forEach(file => {
      // Create a document object for each file
      const document: Document = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString()
      };
      
      newDocuments.push(document);
    });
    
    // Update state and call the callback
    const updatedDocuments = [...documents, ...newDocuments];
    setDocuments(updatedDocuments);
    onFilesSelected(updatedDocuments);
  };

  const handleRemoveDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    onFilesSelected(updatedDocuments);
  };

  return (
    <div className={className}>
      <div className="flex flex-col space-y-4">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, PNG, JPG or GIF (max 10MB)
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.gif"
          />
        </div>

        {documents.length > 0 && (
          <div className="space-y-2 mt-2">
            <p className="text-sm font-medium">Uploaded documents</p>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div 
                  key={doc.id}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{doc.name}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveDocument(doc.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
