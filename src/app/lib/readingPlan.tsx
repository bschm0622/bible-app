import {PlanEntry } from '../../types/planTypes';
import { BibleBook } from '../../types/bibleBook';

// Function to calculate books based on selection criteria
export function calculateBooks(
  selectedOptions: string[],
  selectionType: string,
  bibleData: BibleBook[]
): BibleBook[] {
  console.log("Selection Type:", selectionType);
  console.log("Selected Options:", selectedOptions);
  console.log("Bible Data:", bibleData);

  switch (selectionType) {
    case "books":
      return bibleData.filter(book => selectedOptions.includes(book.book_name));
    case "testament":
      return bibleData.filter(book => selectedOptions.includes(book.testament));
    case "type":
      return bibleData.filter(book => selectedOptions.includes(book.type));
    default:
      return [];
  }
}

// Function to decide how to distribute readings across days (based on chapters, verses, or mixed)
export function decideDistribution(totalChapters: number, totalVerses: number, days: number): { method: string } {
  const averageVersesPerChapter = totalVerses / totalChapters;
  const targetVersesPerDay = totalVerses / days;

  if (totalChapters > days) return { method: 'chapter' }; // More chapters than days, use chapter-based distribution
  if (targetVersesPerDay > averageVersesPerChapter) return { method: 'mixed' }; // More verses per day than average per chapter, use mixed
  return { method: 'verse' }; // Otherwise, use verse-based distribution
}

// Helper function to parse Bible reference (works for both chapters and verses)
function parseBibleReference(input: string): { book: string; chapter: string; verse?: string } {
  console.log(`Parsing Bible reference: ${input}`);

  const match = input.match(/(.+?)\s(\d+)(?::(\d+))?$/); // Match Book Name, Chapter, and optional Verse

  if (!match) {
    console.error(`Invalid input format: ${input}`);
    throw new Error("Invalid input format. Expected format: 'Book Chapter' or 'Book Chapter:Verse'");
  }

  const book = match[1].trim();
  const chapter = match[2];
  const verse = match[3];

  console.log(`Parsed result - Book: "${book}", Chapter: "${chapter}", Verse: "${verse || ""}"`);
  return { book, chapter, verse };
}

// Helper function to format readings for chapters
const formatReading = (reading: string[]): string => {
  console.log(`Formatting chapter reading for input: ${JSON.stringify(reading)}`);

  let formattedReading = "";
  let lastBook = "";
  let chapterStart = "";
  let chapterEnd = "";

  reading.forEach((entry) => {
    console.log(`Processing chapter: ${entry}`);
    const { book, chapter } = parseBibleReference(entry);

    // If the book is the same, extend the chapter range, else finalize previous range
    if (book === lastBook) {
      chapterEnd = chapter;
    } else {
      if (lastBook) {
        formattedReading += `${lastBook} ${chapterStart}`;
        if (chapterStart !== chapterEnd) formattedReading += `-${chapterEnd}`;
        formattedReading += ", ";
      }

      lastBook = book;
      chapterStart = chapter;
      chapterEnd = chapter;
    }
  });

  // Add the final range
  if (lastBook) {
    formattedReading += `${lastBook} ${chapterStart}`;
    if (chapterStart !== chapterEnd) formattedReading += `-${chapterEnd}`;
  }

  console.log(`Formatted result: "${formattedReading}"`);
  return formattedReading.trim(); // Remove trailing commas or spaces
};

// Helper function to format readings for verses
const formatVerseReading = (reading: string[]): string => {
  console.log(`Formatting verse reading for input: ${JSON.stringify(reading)}`);

  let formattedReading = "";
  let lastBook = "";
  let lastChapter = "";
  let lastVerse = "";
  let startBook = "";
  let startChapter = "";
  let startVerse = "";

  reading.forEach((verse) => {
    console.log(`Processing verse: ${verse}`);
    const { book, chapter, verse: verseNum } = parseBibleReference(verse);

    if (!verseNum) {
      console.error(`Invalid verse format: ${verse}`);
      throw new Error("Verse number is required for formatting.");
    }

    if (!startBook) { // Initialize the range
      startBook = book;
      startChapter = chapter;
      startVerse = verseNum;
    }

    // Check if it's a new book or chapter, and finalize the previous range if needed
    if (book !== lastBook || chapter !== lastChapter) {
      if (lastBook) {
        if (startBook === lastBook && startChapter === lastChapter) {
          formattedReading += `${startBook} ${startChapter}:${startVerse}`;
          if (startVerse !== lastVerse) formattedReading += `-${lastVerse}`;
        } else if (startBook === lastBook) {
          formattedReading += `${startBook} ${startChapter}:${startVerse}-${lastChapter}:${lastVerse}`;
        } else {
          formattedReading += `${startBook} ${startChapter}:${startVerse} - ${lastBook} ${lastChapter}:${lastVerse}`;
        }
        formattedReading += ", "; // Separator for the range
      }

      startBook = book;
      startChapter = chapter;
      startVerse = verseNum;
    }

    lastBook = book;
    lastChapter = chapter;
    lastVerse = verseNum;
  });

  // Finalize the last range
  if (startBook) {
    if (startBook === lastBook && startChapter === lastChapter) {
      formattedReading += `${startBook} ${startChapter}:${startVerse}`;
      if (startVerse !== lastVerse) formattedReading += `-${lastVerse}`;
    } else if (startBook === lastBook) {
      formattedReading += `${startBook} ${startChapter}:${startVerse}-${lastChapter}:${lastVerse}`;
    } else {
      formattedReading += `${startBook} ${startChapter}:${startVerse} - ${lastBook} ${lastChapter}:${lastVerse}`;
    }
  }

  console.log(`Formatted result: "${formattedReading}"`);
  return formattedReading.trim(); // Remove trailing commas or spaces
};

// Helper function to calculate chapters or verses per day
const distributeReadings = (total: number, days: number): number[] => {
  const base = Math.floor(total / days);
  const remaining = total % days;
  const distribution = new Array(days).fill(base);

  for (let i = 0; i < remaining; i++) {
    distribution[i]++;
  }

  return distribution;
};

// Main function to generate the reading plan
export const generateReadingPlan = (
  method: string,
  selectedBooks: BibleBook[],
  totalDays: number,
  startDate: Date,
  endDate: Date
): PlanEntry[] => {
  const plan: PlanEntry[] = [];
  const currentDate = new Date(startDate);

  // Calculate the total chapters and verses
  const totalChapters = selectedBooks.length;
  const totalVerses = selectedBooks.reduce((sum, chapter) => sum + chapter.verses, 0);

  if (totalChapters === 0 || currentDate >= endDate) {
    alert("Invalid input: No chapters available or invalid date range.");
    return [{
      date: "",
      reading: "Error: Invalid input.",
    }];
  }

  const dailyChaptersArray = distributeReadings(totalChapters, totalDays);
  const dailyVersesArray = distributeReadings(totalVerses, totalDays);


  // Generate the reading plan based on the selected method
  for (let i = 0; i < totalDays; i++) {

    if (currentDate > endDate) break;

    const dailyReadings: string[] = [];
    const chaptersForToday = method === "chapter" ? dailyChaptersArray[i] : dailyVersesArray[i];

    if (method === "chapter") {
      for (let j = 0; j < chaptersForToday; j++) {
        if (chapterIndex >= totalChapters) break;
        const chapter = selectedBooks[chapterIndex];
        dailyReadings.push(`${chapter.book_name} ${chapter.chapter}`);
        chapterIndex++;
      }
      const reading = formatReading(dailyReadings);
      plan.push({ date: currentDate.toISOString().split("T")[0], reading });
    }

    else if (method === "verse") {
      let versesForToday = chaptersForToday;
      while (versesForToday > 0 && chapterIndex < totalChapters) {
        const chapter = selectedBooks[chapterIndex];
        const remainingVersesInChapter = chapter.verses - verseIndex;

        if (remainingVersesInChapter <= versesForToday) {
          for (let v = verseIndex + 1; v <= chapter.verses; v++) {
            dailyReadings.push(`${chapter.book_name} ${chapter.chapter}:${v}`);
          }
          versesForToday -= remainingVersesInChapter;
          verseIndex = 0;
          chapterIndex++;
        } else {
          for (let v = verseIndex + 1; v <= verseIndex + versesForToday; v++) {
            dailyReadings.push(`${chapter.book_name} ${chapter.chapter}:${v}`);
          }
          verseIndex += versesForToday;
          versesForToday = 0;
        }
      }
      const reading = formatVerseReading(dailyReadings);
      plan.push({ date: currentDate.toISOString().split("T")[0], reading });
    }

    // Increment the current date for the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return plan;
};
