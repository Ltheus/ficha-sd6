export interface Personagem {
  nome: string;
  nivel: number;
  vida: number;
  defesa: number;
  iniciativa: number;
  acoes: number;
  tormento: string;
  recompensa: number;
  reputacao: string;
  dinheiro: number;
  atributos: {
    fisico: number;
    agilidade: number;
    intelecto: number;
    coragem: number;
  };
  antecedentes: {
    combate: number;
    negocios: number;
    montaria: number;
    tradicao: number;
    labuta: number;
    exploracao: number;
    roubo: number;
    medicina: number;
  };
  habilidades: [
    {
      nome: string;
      descricao: string;
    },
  ];
  equipamento: [
    {
      nome: string;
      dano: string;
    },
  ];
}
