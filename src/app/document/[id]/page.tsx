import ClientDocumentPage from './client-page';

// Generate static params for all possible document IDs
export async function generateStaticParams() {
  // Return some dummy params to satisfy Next.js static export requirements
  return [
    { id: 'placeholder' },
    { id: 'example' },
    { id: 'default' }
  ];
}

export default function DocumentPage() {
  return <ClientDocumentPage />;
}