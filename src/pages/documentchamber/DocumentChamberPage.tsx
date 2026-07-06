import React, { useState, useRef } from 'react';
import { FileText, Upload, PenTool, CheckCircle, Clock, FileEdit, X } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

type DocStatus = 'draft' | 'in_review' | 'signed';

interface DealDocument {
  id: string;
  name: string;
  status: DocStatus;
  uploadedOn: string;
  signed: boolean;
}

const statusConfig: Record<DocStatus, { label: string; variant: 'gray' | 'warning' | 'success' }> = {
  draft: { label: 'Draft', variant: 'gray' },
  in_review: { label: 'In Review', variant: 'warning' },
  signed: { label: 'Signed', variant: 'success' },
};

export const DocumentChamberPage: React.FC = () => {
  const [documents, setDocuments] = useState<DealDocument[]>([
    { id: '1', name: 'Investment Agreement.pdf', status: 'signed', uploadedOn: '2026-06-20', signed: true },
    { id: '2', name: 'Term Sheet.pdf', status: 'in_review', uploadedOn: '2026-07-01', signed: false },
    { id: '3', name: 'NDA Draft.docx', status: 'draft', uploadedOn: '2026-07-04', signed: false },
  ]);
  const [selectedDoc, setSelectedDoc] = useState<DealDocument | null>(null);
  const [showSignPad, setShowSignPad] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newDoc: DealDocument = {
      id: Date.now().toString(),
      name: file.name,
      status: 'draft',
      uploadedOn: new Date().toISOString().split('T')[0],
      signed: false,
    };
    setDocuments([newDoc, ...documents]);
    e.target.value = '';
  };

  const updateStatus = (id: string, status: DocStatus) => {
    setDocuments(documents.map(doc => (doc.id === id ? { ...doc, status } : doc)));
  };

  const openSignPad = (doc: DealDocument) => {
    setSelectedDoc(doc);
    setShowSignPad(true);
  };

  const confirmSignature = () => {
    if (selectedDoc) {
      setDocuments(documents.map(doc =>
        doc.id === selectedDoc.id ? { ...doc, status: 'signed', signed: true } : doc
      ));
    }
    setShowSignPad(false);
    setSelectedDoc(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-600">Manage deal contracts, review status, and e-signatures</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
        <Button variant="highlight" leftIcon={<Upload size={18} />} onClick={handleUploadClick}>
          Upload Contract
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Deal Documents</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-highlight-50 rounded-lg">
                    <FileText size={22} className="text-highlight-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500">Uploaded {doc.uploadedOn}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={statusConfig[doc.status].variant}>
                    {statusConfig[doc.status].label}
                  </Badge>

                  {doc.status === 'draft' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(doc.id, 'in_review')}>
                      <FileEdit size={14} className="mr-1" /> Send for Review
                    </Button>
                  )}

                  {doc.status === 'in_review' && !doc.signed && (
                    <Button size="sm" variant="highlight" onClick={() => openSignPad(doc)}>
                      <PenTool size={14} className="mr-1" /> Sign
                    </Button>
                  )}

                  {doc.status === 'signed' && (
                    <span className="flex items-center text-success-600 text-sm">
                      <CheckCircle size={16} className="mr-1" /> Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* E-Signature Modal */}
      {showSignPad && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Sign Document</h3>
              <button onClick={() => setShowSignPad(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-sm text-gray-600">
                Signing: <span className="font-medium text-gray-900">{selectedDoc.name}</span>
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <PenTool size={28} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 italic">Sign here (signature pad mockup)</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock size={14} className="mr-1" />
                {new Date().toLocaleString()}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setShowSignPad(false)}>
                  Cancel
                </Button>
                <Button variant="highlight" fullWidth onClick={confirmSignature}>
                  Confirm Signature
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};