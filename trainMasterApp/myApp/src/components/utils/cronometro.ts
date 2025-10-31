export class Cronometro {
  private inicio: number | null = null;
  private fim: number | null = null;

  iniciar() {
    this.inicio = Date.now();
  }

  parar() {
    this.fim = Date.now();
  }

  getSegundos(): number {
    if (!this.inicio) return 0;
    const fim = this.fim ?? Date.now();
    return Math.round((fim - this.inicio) / 1000);
  }

  resetar() {
    this.inicio = null;
    this.fim = null;
  }
}