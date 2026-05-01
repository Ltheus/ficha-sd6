import { Injectable } from '@angular/core';
import { Ficha } from '../../core/models/ficha.model';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor() { }

  exportToJson(ficha: Ficha): void {
    const jsonString = JSON.stringify(ficha, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Gerar o nome dinâmico
    const data = new Date();
    const dataFormatada = `${data.getFullYear()}${(data.getMonth() + 1).toString().padStart(2, '0')}${data.getDate().toString().padStart(2, '0')}-${data.getHours().toString().padStart(2, '0')}${data.getMinutes().toString().padStart(2, '0')}${data.getSeconds().toString().padStart(2, '0')}`;
    const nomePersonagem = ficha.personagem?.nome?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'sem-nome';
    const filename = `ficha-${nomePersonagem}-${dataFormatada}.json`;

    // Download do arquivo
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Limpeza
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importFromJson(file: File): Promise<Ficha> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const result = event.target?.result as string;
          const parsedData = JSON.parse(result) as Ficha;
          
          // Validação básica se as propriedades mínimas existem (opcional, pode ser estendido)
          if (!parsedData || !parsedData.personagem) {
            reject(new Error('Formato de arquivo JSON inválido ou incompatível.'));
            return;
          }

          resolve(parsedData);
        } catch (error) {
          reject(new Error('Erro ao fazer o parse do arquivo JSON.'));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  }
}
