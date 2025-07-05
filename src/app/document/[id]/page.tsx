'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SimpleDocumentReader } from '@/components/documents/SimpleDocumentReader';
import { DocumentService, SimpleDocument } from '@/lib/document-service';
import { AppLayout } from '@/components/layout/AppLayout';

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<SimpleDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const documentId = params.id as string;

  useEffect(() => {
    async function loadDocument() {
      if (!documentId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const documentService = DocumentService.getInstance();
        await documentService.initialize();
        
        const doc = await documentService.getDocument(documentId);
        setDocument(doc);
        
        if (!doc) {
          setError('Document not found');
        }
      } catch (err) {
        console.error('Failed to load document:', err);
        setError('Failed to load document');
      } finally {
        setIsLoading(false);
      }
    }

    loadDocument();
  }, [documentId]);

  const handleBack = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
            <p className="mt-4 text-white/70">Loading document...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || (!document && !isLoading)) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <DocumentTextIcon className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">
                  {error || 'Document Not Found'}
                </h1>
                <p className="text-white/70 mb-6">
                  {error === 'Document not found' 
                    ? "The document you're looking for doesn't exist."
                    : 'There was an error loading the document.'}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!document) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
            <p className="mt-4 text-white/70">Loading document...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return <SimpleDocumentReader document={document} onBack={handleBack} />;
}