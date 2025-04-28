import React, { useContext } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DocumentContext } from '../../contexts/DocumentContext';
import { ProcessContext } from '../../contexts/ProcessContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';

export default function DocumentList({ onSelectDocument }) {
  const { documents, deleteDocument } = useContext(DocumentContext);
  const { processes } = useContext(ProcessContext);

  // Obtenir le nom du processus à partir de son ID
  const getProcessName = (processId) => {
    const process = processes.find(p => p.id === processId);
    return process ? process.name : 'Processus inconnu';
  };

  // Formater le statut pour l'affichage
  const getStatusBadge = (status) => {
    switch (status) {
      case 'brouillon':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'en cours':
        return <Badge variant="secondary">En cours</Badge>;
      case 'validé':
        return <Badge variant="success">Validé</Badge>;
      case 'rejeté':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Liste des documents</h2>
      
      {documents.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          Aucun document disponible. Créez votre premier document !
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Processus</TableHead>
              <TableHead>Date début</TableHead>
              <TableHead>Date fin</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{getProcessName(doc.processId)}</TableCell>
                <TableCell>{format(new Date(doc.startDate), 'dd MMM yyyy', { locale: fr })}</TableCell>
                <TableCell>{format(new Date(doc.endDate), 'dd MMM yyyy', { locale: fr })}</TableCell>
                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onSelectDocument(doc.id)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteDocument(doc.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}