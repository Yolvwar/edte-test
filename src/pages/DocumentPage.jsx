import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DocumentDetail from '../components/document/DocumentDetail';
import { DocumentContext } from '../contexts/DocumentContext';

export default function DocumentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents } = useContext(DocumentContext);
  
  // Vérifier si le document existe
  const documentExists = documents.some(doc => doc.id === id);
  
  // Rediriger vers la page des documents si l'ID n'existe pas
  useEffect(() => {
    if (!documentExists && id) {
      navigate('/documents');
    }
  }, [documentExists, id, navigate]);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/documents')}
        >
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-3xl font-bold">Détails du Document</h1>
      </div>
      
      {documentExists ? (
        <DocumentDetail documentId={id} />
      ) : (
        <div>Chargement...</div>
      )}
    </div>
  );
}