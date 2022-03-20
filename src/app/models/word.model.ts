export type orientation =
  | 'ltr'
  | 'rtl'
  | 'ttb'
  | 'btt'
  | 'dttbltr'
  | 'dbttrtl'
  | 'dbttltr'
  | 'dttbrtl';

export class Word {
  public word: string;
  public orientation: orientation;
  public length: number;
  public completed: boolean = false;

  constructor(word: string, orientation?: orientation) {
    this.word = word;
    this.orientation = orientation || this.getRandOrientation();
    this.length = word.length;
  }

  getRandOrientation(): orientation {
    const orientations = [
      'ltr',
      'rtl',
      'ttb',
      'btt',
      'dttbltr',
      'dbttrtl',
      'dbttltr',
      'dttbrtl',
    ];
    return <orientation>(
      orientations[Math.floor(Math.random() * orientations.length)]
    );
  }

  changeOrientation(): void {
    let randOrientation: orientation;
    do {
      randOrientation = this.getRandOrientation();
    } while (this.orientation === randOrientation);
    this.orientation = randOrientation;
  }
}
