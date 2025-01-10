// BibleBook type definition
export interface BibleBook {
    book_name: string;
    testament: string;
    type: string;
    chapter: number;  // A single chapter
    verses: number;   // Verses in that chapter
  }