export interface CellI {
  row: number;
  col: number;
}
export class Cell {
  public row: number;
  public col: number;
  private characters: string = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  public letter: string = '';
  public used: boolean = false;
  public active: boolean = false;
  public success: boolean = false;

  constructor(row: number, col: number, vector?: boolean) {
    this.row = row;
    this.col = col;
    this.used = false;
    this.letter = !vector ? this.generateRandLetter() : '';
  }

  getCell(): CellI {
    return { row: this.row, col: this.col };
  }

  generateRandLetter(): string {
    return this.characters.charAt(
      Math.floor(Math.random() * this.characters.length)
    );
  }

  setLetter(letter: string): void {
    this.letter = letter;
    this.used = true;
  }

  toggleActive(): void {
    this.active = !this.active;
  }

  activate(): void {
    this.active = true;
  }

  deactivate(): void {
    this.active = false;
  }

  setSuccess(): void {
    this.success = true;
  }

  reset(): void {
    this.success = false;
  }
}
