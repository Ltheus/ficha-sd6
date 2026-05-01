import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { JsonService } from './data/services/json.service';
import { Ficha } from './core/models/ficha.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ficha-sd6');
  private jsonService = inject(JsonService);

  async testDownload() {
    try {
      const response = await fetch('cobaia.json');
      const personagemData = await response.json();

      const fichaMock: Ficha = {
        personagem: personagemData,
        cavalo: {} as any,
      };

      this.jsonService.exportToJson(fichaMock);
    } catch (error) {
      console.error('Erro ao baixar ou exportar cobaia.json', error);
    }
  }

  async testUpload(event: any) {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      try {
        const fichaCarregada: Ficha = await this.jsonService.importFromJson(file);
        console.log('Ficha importada com sucesso:', fichaCarregada);
      } catch (error) {
        console.error('Falha ao importar o arquivo:', error);
      }
    }
  }
}
