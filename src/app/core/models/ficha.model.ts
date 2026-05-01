import { Cavalo } from './cavalo.model';
import { Personagem } from './personagem.model';

export interface Ficha {
  personagem: Personagem;
  cavalo: Cavalo;
}
