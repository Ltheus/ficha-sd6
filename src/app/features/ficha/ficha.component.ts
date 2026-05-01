import { Component, inject, viewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { Divider } from 'primeng/divider';
import { Card } from 'primeng/card';
import { Rating } from 'primeng/rating';
import { JsonService } from '../../data/services/json.service';
import { Ficha } from '../../core/models/ficha.model';

@Component({
  selector: 'app-ficha',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Button,
    InputText,
    InputNumber,
    Textarea,
    Divider,
    Card,
    Rating,
  ],
  templateUrl: './ficha.component.html',
  styleUrl: './ficha.component.css',
})
export class FichaComponent {
  private fb = inject(FormBuilder);
  private jsonService = inject(JsonService);

  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  // ── Limites de array ──────────────────────────────────────────────────
  readonly MAX_EQUIPAMENTO = 10;
  readonly MAX_EQUIPAMENTOS_CAVALO = 15;

  // ── FormGroup principal ───────────────────────────────────────────────
  fichaForm: FormGroup = this.fb.group({
    personagem: this.fb.group({
      nome:       [''],
      nivel:      [null, [Validators.min(0), Validators.max(6)]],
      vida:       [null],
      defesa:     [null],
      iniciativa: [null],
      acoes:      [null],
      tormento:   [''],
      recompensa: [null],
      reputacao:  [''],
      dinheiro:   [null],
      atributos: this.fb.group({
        fisico:    [0, [Validators.min(0), Validators.max(5)]],
        agilidade: [0, [Validators.min(0), Validators.max(5)]],
        intelecto: [0, [Validators.min(0), Validators.max(5)]],
        coragem:   [0, [Validators.min(0), Validators.max(5)]],
      }),
      antecedentes: this.fb.group({
        combate:    [0, [Validators.min(0), Validators.max(5)]],
        negocios:   [0, [Validators.min(0), Validators.max(5)]],
        montaria:   [0, [Validators.min(0), Validators.max(5)]],
        tradicao:   [0, [Validators.min(0), Validators.max(5)]],
        labuta:     [0, [Validators.min(0), Validators.max(5)]],
        exploracao: [0, [Validators.min(0), Validators.max(5)]],
        roubo:      [0, [Validators.min(0), Validators.max(5)]],
        medicina:   [0, [Validators.min(0), Validators.max(5)]],
      }),
      habilidades: this.fb.array([]),
      equipamento: this.fb.array([]),
    }),
    cavalo: this.fb.group({
      nome:       [''],
      fidelidade: [null, [Validators.min(0), Validators.max(4)]],
      potencia:   [0, [Validators.min(0), Validators.max(5)]],
      vigor:      [0, [Validators.min(0), Validators.max(5)]],
      vida:       [null],
      defesa:     [null],
      dano:       [null],
      equipamentos: this.fb.array([]),
    }),
  });

  // ── Getters de FormArray ──────────────────────────────────────────────
  get habilidades(): FormArray {
    return this.fichaForm.get('personagem.habilidades') as FormArray;
  }

  get equipamento(): FormArray {
    return this.fichaForm.get('personagem.equipamento') as FormArray;
  }

  get equipamentosCavalo(): FormArray {
    return this.fichaForm.get('cavalo.equipamentos') as FormArray;
  }

  // ── Helpers de FormArray: Habilidades ─────────────────────────────────
  addHabilidade(): void {
    this.habilidades.push(this.fb.group({ nome: [''], descricao: [''] }));
  }

  removeHabilidade(i: number): void {
    this.habilidades.removeAt(i);
  }

  // ── Helpers de FormArray: Equipamento (Personagem) ────────────────────
  addEquipamento(): void {
    if (this.equipamento.length >= this.MAX_EQUIPAMENTO) return;
    this.equipamento.push(this.fb.group({ nome: [''], dano: [''] }));
  }

  removeEquipamento(i: number): void {
    this.equipamento.removeAt(i);
  }

  // ── Helpers de FormArray: Equipamentos (Cavalo) ───────────────────────
  addEquipamentoCavalo(): void {
    if (this.equipamentosCavalo.length >= this.MAX_EQUIPAMENTOS_CAVALO) return;
    this.equipamentosCavalo.push(this.fb.control(''));
  }

  removeEquipamentoCavalo(i: number): void {
    this.equipamentosCavalo.removeAt(i);
  }

  // ── Exportar ─────────────────────────────────────────────────────────
  exportarFicha(): void {
    const ficha = this.fichaForm.getRawValue() as Ficha;
    this.jsonService.exportToJson(ficha);
  }

  // ── Importar ─────────────────────────────────────────────────────────
  triggerFileInput(): void {
    this.fileInput()?.nativeElement.click();
  }

  async importarFicha(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const ficha: Ficha = await this.jsonService.importFromJson(file);
      this.populateForm(ficha);
    } catch (err) {
      console.error('Erro ao importar ficha:', err);
    } finally {
      // Limpa o input para permitir reimportar o mesmo arquivo
      input.value = '';
    }
  }

  // ── Preencher formulário com dados importados ─────────────────────────
  private populateForm(ficha: Ficha): void {
    // Reconstruir FormArrays antes de patchValue
    this.habilidades.clear();
    (ficha.personagem?.habilidades ?? []).forEach(() =>
      this.habilidades.push(this.fb.group({ nome: [''], descricao: [''] }))
    );

    this.equipamento.clear();
    (ficha.personagem?.equipamento ?? []).forEach(() =>
      this.equipamento.push(this.fb.group({ nome: [''], dano: [''] }))
    );

    this.equipamentosCavalo.clear();
    (ficha.cavalo?.equipamentos ?? []).forEach(() =>
      this.equipamentosCavalo.push(this.fb.control(''))
    );

    this.fichaForm.patchValue(ficha);
  }
}
