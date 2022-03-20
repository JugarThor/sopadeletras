import { Component, Input, OnInit } from '@angular/core';
import { ApiWordResponseI } from '@models/api-word.model';
import { Cell } from '@models/cell.model';
import { orientation, Word } from '@models/word.model';
import { WordsService } from '@services/words.service';

@Component({
  selector: 'app-sopadeletras',
  templateUrl: './sopadeletras.component.html',
  styleUrls: ['./sopadeletras.component.scss'],
})
export class SopadeletrasComponent implements OnInit {
  @Input() rows: number = 20;
  @Input() cols: number = 20;
  @Input() numberMaxOfWords: number = 10;

  public matrix: Cell[][] = [];
  public wordsSetted: Word[] = [];
  public pointsSelected: { start: Cell | null; end: Cell | null } = {
    start: null,
    end: null,
  };

  public gameCompleted: boolean = false;

  constructor(private wordService: WordsService) {}

  ngOnInit(): void {
    this.generateVoidMatrix();
    // this.setWordsInMatrix([
    //   'casa',
    //   'avion',
    //   'conductor',
    //   'teclado',
    //   'raton',
    //   'pescado',
    //   'mesa',
    //   'lampara',
    //   'poster',
    //   'enfermedad',
    // ]);

    this.setWordMatrix(this.numberMaxOfWords);
  }

  setWordMatrix(nwords: number): void {
    let promises = [];
    let words: string[] = [];
    for (let i = 0; i < nwords; i++) {
      promises.push(
        new Promise((resolve, reject) => {
          this.wordService
            .getRamdomWord()
            .subscribe((res: ApiWordResponseI) => {
              if (res.body.Word.length <= this.cols) {
                resolve(res.body.Word);
              } else {
                reject(false);
              }
            });
        })
      );
    }

    Promise.all(promises).then((res) => {
      console.log(res);
      res.map((element) => {
        let word = <string>element;
        words.push(word.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
      });
      this.setWordsInMatrix(words);
    });
  }

  generateVoidMatrix(): void {
    for (let i = 0; i < this.rows; i++) {
      // filas
      let row: Cell[] = [];
      for (let j = 0; j < this.cols; j++) {
        // columnas
        row.push(new Cell(i, j));
      }
      this.matrix.push(row);
    }
  }

  setWordsInMatrix(words: string[]): void {
    const MAX_ATTEMPTS: number = 10;
    for (let i = 0; i < words.length; i++) {
      let setted: boolean;
      let attempts: number = 0;
      let word = new Word(words[i]);
      do {
        setted = this.setWordInMatrix(word);
        if (!setted) word.changeOrientation();
        attempts++;
      } while (!setted && attempts <= MAX_ATTEMPTS);
      if (setted) {
        this.wordsSetted.push(word);
        console.log(`Palabra: ${word.word} insertada con éxito!`);
      } else {
        console.error(`Palabra: ${word.word} no se pudo insertar.`);
      }
    }
  }

  private setWordInMatrix(word: Word): boolean {
    const MAX_ATTEMPTS: number = 100;
    if (word.length > this.cols) {
      console.error(
        `La palabra ${word} es demasiado larga para esta sopa de letras. El tamaño máximo de palabra es de ${this.cols} `
      );
      return false;
    }

    let randomRow, randomCol;
    let attempts: number = 0;
    let canSetWord: boolean = true;

    switch (word.orientation) {
      case 'ltr':
        do {
          randomRow = Math.floor(Math.random() * (this.rows - word.length));
          randomCol = Math.floor(Math.random() * (this.cols - word.length));
          // can set word ?
          for (let i = 0; i < word.length; i++) {
            const cell = this.matrix[randomRow][randomCol + i];
            if (cell.used && cell.letter != word.word[i]) canSetWord = false;
          }
          attempts++;
        } while (attempts <= MAX_ATTEMPTS && !canSetWord);

        if (canSetWord) {
          for (let i = 0; i < word.length; i++) {
            this.matrix[randomRow][randomCol + i].setLetter(word.word[i]);
          }
        }
        break;
      case 'rtl':
        do {
          randomRow = this.randomInteger(word.length, this.rows - 1);
          randomCol = this.randomInteger(word.length, this.cols - 1);
          // can set word ?
          for (let i = 0; i < word.length; i++) {
            const cell = this.matrix[randomRow][randomCol - i];
            if (cell.used && cell.letter != word.word[i]) canSetWord = false;
          }
          attempts++;
        } while (attempts <= MAX_ATTEMPTS && !canSetWord);
        if (canSetWord) {
          for (let i = 0; i < word.length; i++) {
            this.matrix[randomRow][randomCol - i].setLetter(word.word[i]);
          }
        }
        break;
      case 'ttb':
        do {
          randomRow = Math.floor(Math.random() * (this.rows - word.length));
          randomCol = Math.floor(Math.random() * (this.cols - word.length));
          // can set word ?
          for (let i = 0; i < word.length; i++) {
            const cell = this.matrix[randomRow + i][randomCol];
            if (cell.used && cell.letter != word.word[i]) canSetWord = false;
          }
          attempts++;
        } while (attempts <= MAX_ATTEMPTS && !canSetWord);

        if (canSetWord) {
          for (let i = 0; i < word.length; i++) {
            this.matrix[randomRow + i][randomCol].setLetter(word.word[i]);
          }
        }
        break;
      case 'btt':
        do {
          randomRow = this.randomInteger(word.length, this.rows - 1);
          randomCol = this.randomInteger(word.length, this.cols - 1);
          for (let i = 0; i < word.length; i++) {
            const cell = this.matrix[randomRow - i][randomCol];
            if (cell.used && cell.letter != word.word[i]) canSetWord = false;
          }
          attempts++;
        } while (attempts <= MAX_ATTEMPTS && !canSetWord);
        if (canSetWord) {
          for (let i = 0; i < word.length; i++) {
            this.matrix[randomRow - i][randomCol].setLetter(word.word[i]);
          }
        }
        break;
      case 'dttbltr':
        do {
          randomRow = this.randomInteger(0, this.rows - word.length);
          randomCol = this.randomInteger(0, this.cols - word.length);
          for (let i = 0; i < word.length; i++) {
            const cell = this.matrix[randomRow + i][randomCol + i];
            if (cell.used && cell.letter != word.word[i]) canSetWord = false;
          }
          attempts++;
        } while (attempts <= MAX_ATTEMPTS && !canSetWord);
        if (canSetWord) {
          for (let i = 0; i < word.length; i++) {
            this.matrix[randomRow + i][randomCol + i].setLetter(word.word[i]);
          }
        }
        break;
      case 'dbttrtl':
        do {
          randomRow = this.randomInteger(word.length, this.rows - 1);
          randomCol = this.randomInteger(word.length, this.cols - 1);
          for (let i = 0; i < word.length; i++) {
            const cell = this.matrix[randomRow - i][randomCol - i];
            if (cell.used && cell.letter != word.word[i]) canSetWord = false;
          }
          attempts++;
        } while (attempts <= MAX_ATTEMPTS && !canSetWord);
        if (canSetWord) {
          for (let i = 0; i < word.length; i++) {
            this.matrix[randomRow - i][randomCol - i].setLetter(word.word[i]);
          }
        }
        break;
      case 'dbttltr':
        do {
          randomRow = this.randomInteger(word.length, this.rows - 1);
          randomCol = this.randomInteger(0, this.cols - word.length);
          for (let i = 0; i < word.length; i++) {
            const cell = this.matrix[randomRow - i][randomCol + i];
            if (cell.used && cell.letter != word.word[i]) canSetWord = false;
          }
          attempts++;
        } while (attempts <= MAX_ATTEMPTS && !canSetWord);
        if (canSetWord) {
          for (let i = 0; i < word.length; i++) {
            this.matrix[randomRow - i][randomCol + i].setLetter(word.word[i]);
          }
        }
        break;
      case 'dttbrtl':
        do {
          randomRow = this.randomInteger(0, this.rows - word.length);
          randomCol = this.randomInteger(word.length, this.cols - 1);
          for (let i = 0; i < word.length; i++) {
            const cell = this.matrix[randomRow + i][randomCol - i];
            if (cell.used && cell.letter != word.word[i]) canSetWord = false;
          }
          attempts++;
        } while (attempts <= MAX_ATTEMPTS && !canSetWord);
        if (canSetWord) {
          for (let i = 0; i < word.length; i++) {
            this.matrix[randomRow + i][randomCol - i].setLetter(word.word[i]);
          }
        }
        break;
      default:
        break;
    }

    return canSetWord;
  }

  randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  toggleCell(cell: Cell) {
    if (this.pointsSelected.start != null && this.pointsSelected.end != null) {
      this.pointsSelected.start.deactivate();
      this.pointsSelected.end.deactivate();
      this.pointsSelected = { start: null, end: null };
    }
    cell.toggleActive();
    if (this.pointsSelected.start === null) {
      this.pointsSelected.start = cell;
    } else {
      this.pointsSelected.end = cell;
      this.checkWord(this.pointsSelected.start, this.pointsSelected.end);
    }
  }

  checkWord(startCell: Cell, endCell: Cell): boolean {
    console.log(startCell, endCell);

    // get the vector point
    const vectorPoint = new Cell(
      endCell.row - startCell.row,
      endCell.col - startCell.col,
      true
    );
    const { col: x, row: y } = vectorPoint;

    // get the orientation
    let vector: orientation | null = null;
    if (x === 0) {
      if (y > 0) {
        vector = 'ttb';
      } else {
        vector = 'btt';
      }
    }
    if (y === 0) {
      if (x > 0) {
        vector = 'ltr';
      } else {
        vector = 'rtl';
      }
    }
    if (x > 0 && y > 0) {
      vector = 'dttbltr';
    }
    if (x > 0 && y < 0) {
      vector = 'dbttltr';
    }
    if (x < 0 && y > 0) {
      vector = 'dttbrtl';
    }
    if (x < 0 && y < 0) {
      vector = 'dbttrtl';
    }

    console.log(vector);

    let affectedCells: Cell[] = [];
    let wordToFind = '';
    let j = 0;
    switch (vector) {
      case 'ltr':
        for (let i = startCell.col; i <= endCell.col; i++) {
          const cell = this.matrix[startCell.row][i];
          wordToFind += cell.letter;
          affectedCells.push(cell);
        }
        break;
      case 'rtl':
        for (let i = startCell.col; i >= endCell.col; i--) {
          const cell = this.matrix[startCell.row][i];
          wordToFind += cell.letter;
          affectedCells.push(cell);
        }
        break;
      case 'ttb':
        for (let i = startCell.row; i <= endCell.row; i++) {
          const cell = this.matrix[i][startCell.col];
          wordToFind += cell.letter;
          affectedCells.push(cell);
        }
        break;
      case 'btt':
        for (let i = startCell.row; i >= endCell.row; i--) {
          const cell = this.matrix[i][startCell.col];
          wordToFind += cell.letter;
          affectedCells.push(cell);
        }
        break;
      case 'dttbltr':
        j = 0;
        for (let i = startCell.row; i <= endCell.row; i++) {
          const cell = this.matrix[startCell.row + j][startCell.col + j];
          wordToFind += cell.letter;
          affectedCells.push(cell);
          j++;
        }
        break;
      case 'dbttltr':
        j = 0;
        for (let i = startCell.row; i >= endCell.row; i--) {
          const cell = this.matrix[startCell.row - j][startCell.col + j];
          console.log(cell);

          wordToFind += cell.letter;
          affectedCells.push(cell);
          j++;
        }
        break;
      case 'dttbrtl':
        j = 0;
        for (let i = startCell.row; i <= endCell.row; i++) {
          const cell = this.matrix[startCell.row + j][startCell.col - j];
          console.log(cell);
          wordToFind += cell.letter;
          affectedCells.push(cell);
          j++;
        }
        break;
      case 'dbttrtl':
        j = 0;
        for (let i = startCell.row; i >= endCell.row; i--) {
          const cell = this.matrix[startCell.row - j][startCell.col - j];
          console.log(cell);
          wordToFind += cell.letter;
          affectedCells.push(cell);
          j++;
        }
        break;
      default:
        break;
    }
    console.log(wordToFind);

    const reverseWord = this.reverseString(wordToFind);

    this.wordsSetted.map((word: Word) => {
      if (word.word === wordToFind || word.word === reverseWord) {
        word.completed = true;
        affectedCells.map((cell: Cell) => {
          cell.setSuccess();
        });
        if (this.wordsSetted.filter((word) => !word.completed).length === 0) {
          this.gameCompleted = true;
        }
      }
    });

    return true;
  }

  reverseString(str: string): string {
    if (str === '')
      // This is the terminal case that will end the recursion
      return '';
    else return this.reverseString(str.substr(1)) + str.charAt(0);
  }
}
