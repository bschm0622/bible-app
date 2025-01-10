import {PlanEntry } from '../../types/planTypes';
import { BibleBook } from '../../types/bibleBook';

// Function to calculate books based on selection
export function calculateBooks(
  selectedOptions: string[],
  selectionType: string,
  bibleData: BibleBook[]
): BibleBook[] {
  console.log("Selection Type:", selectionType);
  console.log("Selected Options:", selectedOptions);
  console.log("Bible Data:", bibleData);

  if (selectionType === "books") {
    return bibleData.filter(book => selectedOptions.includes(book.book_name));
  } else if (selectionType === "testament") {
    return bibleData.filter(book => selectedOptions.includes(book.testament));
  } else if (selectionType === "type") {
    return bibleData.filter(book => selectedOptions.includes(book.type));
  }
  return [];
}

// Assume decideDistribution is like this:
export function decideDistribution(totalChapters: number, totalVerses: number, days: number): { method: string } {
  const averageVersesPerChapter = totalVerses / totalChapters;
  const targetVersesPerDay = totalVerses / days;

  if (totalChapters > days) {
    return { method: 'chapter' };
  }

  if (targetVersesPerDay > averageVersesPerChapter) {
    return { method: 'mixed' };
  }

  return { method: 'verse' };
}

// Helper function to parse a Bible reference (works for both chapters and verses)
function parseBibleReference(input: string): { book: string; chapter: string; verse?: string } {
  console.log(`Parsing Bible reference: ${input}`);

  // Match a format like "Book Name 1:1" (chapter:verse) or "Book Name 1" (chapter only)
  const match = input.match(/(.+?)\s(\d+)(?::(\d+))?$/);

  if (!match) {
    console.error(`Invalid input format: ${input}`);
    throw new Error("Invalid input format. Expected format: 'Book Chapter' or 'Book Chapter:Verse'");
  }

  const book = match[1].trim(); // Book name
  const chapter = match[2]; // Chapter number
  const verse = match[3]; // Optional verse number

  console.log(`Parsed result - Book: "${book}", Chapter: "${chapter}", Verse: "${verse || ""}"`);
  return { book, chapter, verse };
}


// Helper function to format readings for chapters
// Helper function to format readings for chapters
const formatReading = (reading: string[]) => {
  console.log(`Formatting chapter reading for input: ${JSON.stringify(reading)}`);

  let formattedReading = "";
  let lastBook = "";
  let chapterStart = "";
  let chapterEnd = "";

  reading.forEach((entry) => {
    console.log(`Processing chapter: ${entry}`);

    // Parse the current entry into book and chapter
    const { book, chapter } = parseBibleReference(entry);

    if (book === lastBook) {
      // If the book is the same, extend the chapter range
      chapterEnd = chapter;
    } else {
      // Finalize the previous book's range
      if (lastBook) {
        formattedReading += `${lastBook} ${chapterStart}`;
        if (chapterStart !== chapterEnd) {
          formattedReading += `-${chapterEnd}`;
        }
        formattedReading += ", ";
      }

      // Start a new range
      lastBook = book;
      chapterStart = chapter;
      chapterEnd = chapter;
    }
  });

  // Add the last range
  if (lastBook) {
    formattedReading += `${lastBook} ${chapterStart}`;
    if (chapterStart !== chapterEnd) {
      formattedReading += `-${chapterEnd}`;
    }
  }

  console.log(`Formatted result: "${formattedReading}"`);
  return formattedReading.trim(); // Trim trailing commas or spaces
};

// Helper function to format readings for verses
const formatVerseReading = (reading: string[]) => {
  console.log(`Formatting verse reading for input: ${JSON.stringify(reading)}`);

  let formattedReading = ""; // The final human-readable format
  let lastBook = ""; // The last book being processed
  let lastChapter = ""; // The last chapter being processed
  let lastVerse = ""; // The last verse number being processed
  let startBook = ""; // The start book of the current range
  let startChapter = ""; // The start chapter of the current range
  let startVerse = ""; // The start verse of the current range

  reading.forEach((verse) => {
    console.log(`Processing verse: ${verse}`);

    // Use the updated parseBibleReference to get book, chapter, and verse
    const { book, chapter, verse: verseNum } = parseBibleReference(verse);

    if (!verseNum) {
      console.error(`Invalid verse format: ${verse}`);
      throw new Error("Verse number is required for formatting.");
    }

    // Initialize the start of the range if necessary
    if (!startBook) {
      startBook = book;
      startChapter = chapter;
      startVerse = verseNum;
    }

    // Check if this is a new book or chapter
    if (book !== lastBook || chapter !== lastChapter) {
      if (lastBook) {
        // Finalize the current range
        if (startBook === lastBook && startChapter === lastChapter) {
          // Same book and chapter, only display verses
          formattedReading += `${startBook} ${startChapter}:${startVerse}`;
          if (startVerse !== lastVerse) {
            formattedReading += `-${lastVerse}`;
          }
        } else if (startBook === lastBook) {
          // Same book but different chapters
          formattedReading += `${startBook} ${startChapter}:${startVerse}-${lastChapter}:${lastVerse}`;
        } else {
          // Different books
          formattedReading += `${startBook} ${startChapter}:${startVerse} - ${lastBook} ${lastChapter}:${lastVerse}`;
        }
        formattedReading += ", "; // Add a separator
      }

      // Start a new range
      startBook = book;
      startChapter = chapter;
      startVerse = verseNum;
    }

    // Update the last processed book, chapter, and verse
    lastBook = book;
    lastChapter = chapter;
    lastVerse = verseNum;
  });

  // Finalize the last range
  if (startBook) {
    if (startBook === lastBook && startChapter === lastChapter) {
      formattedReading += `${startBook} ${startChapter}:${startVerse}`;
      if (startVerse !== lastVerse) {
        formattedReading += `-${lastVerse}`;
      }
    } else if (startBook === lastBook) {
      formattedReading += `${startBook} ${startChapter}:${startVerse}-${lastChapter}:${lastVerse}`;
    } else {
      formattedReading += `${startBook} ${startChapter}:${startVerse} - ${lastBook} ${lastChapter}:${lastVerse}`;
    }
  }

  console.log(`Formatted result: "${formattedReading}"`);
  return formattedReading.trim(); // Trim any trailing commas or spaces
};

// Generate the reading plan based on the date range
export const generateReadingPlan = (
  method: string,
  selectedBooks: BibleBook[],
  totalDays: number,
  startDate: Date,
  endDate: Date
): PlanEntry[] => {
  const plan: PlanEntry[] = [];
  const currentDate = new Date(startDate);
  console.log("generateReadingPlan called");

  // Calculate the total chapters and verses
  const totalChapters = selectedBooks.length;
  const totalVerses = selectedBooks.reduce((sum, chapter) => sum + chapter.verses, 0);

  if (totalChapters === 0) {
    alert("No chapters available to distribute.");
    return [
      {
        date: "",
        reading: "Error: No chapters found in the selected books.",
      },
    ];
  }

  if (currentDate >= endDate) {
    alert("End date must be later than the start date.");
    return [
      {
        date: "",
        reading: "Error: Invalid date range.",
      },
    ];
  }

  const baseChaptersPerDay = Math.floor(totalChapters / totalDays);
  const remainingChapters = totalChapters % totalDays;
  const dailyChaptersArray = new Array(totalDays).fill(baseChaptersPerDay);
  for (let i = 0; i < remainingChapters; i++) {
    dailyChaptersArray[i]++;
  }

  const baseVersesPerDay = Math.floor(totalVerses / totalDays);
  const remainingVerses = totalVerses % totalDays;
  const dailyVersesArray = new Array(totalDays).fill(baseVersesPerDay);
  for (let i = 0; i < remainingVerses; i++) {
    dailyVersesArray[i]++;
  }


  // Generate the reading plan
  for (let i = 0; i < totalDays; i++) {
    if (currentDate > endDate) break;

    
    if (method === "chapter") {
      // Chapter-based logic
      const baseChaptersPerDay = Math.floor(totalChapters / totalDays); // Base chapters per day
      const remainingChapters = totalChapters % totalDays; // Remaining chapters after division
      const dailyChaptersArray = new Array(totalDays).fill(baseChaptersPerDay);
    
      // Distribute the remaining chapters across the days
      for (let i = 0; i < remainingChapters; i++) {
        dailyChaptersArray[i]++;
      }
    
      let chapterIndex = 0; // Track which chapter we are at
    
      // Generate the reading plan
      for (let i = 0; i < totalDays; i++) {
        const dailyReadings: string[] = [];
        const chaptersForToday = dailyChaptersArray[i]; // Number of chapters to include for the day
    
        // Add the chapters to today's readings
        for (let j = 0; j < chaptersForToday; j++) {
          if (chapterIndex >= totalChapters) break; // Ensure we don't exceed available chapters
    
          const chapter = selectedBooks[chapterIndex];
          dailyReadings.push(`${chapter.book_name} ${chapter.chapter}`);
          chapterIndex++;
        }
    
        // Format and add the reading for the day
        const reading = formatReading(dailyReadings);
        plan.push({
          date: currentDate.toISOString().split("T")[0], // Get the current date in 'YYYY-MM-DD' format
          reading,
        });
    
        // Move to the next date
        currentDate.setDate(currentDate.getDate() + 1); // Increment the current date
      }
    }

      else if (method === "verse") {
        // Verse-based logic
        const baseVersesPerDay = Math.floor(totalVerses / totalDays); // Base verses per day
        const remainingVerses = totalVerses % totalDays; // Remaining verses after division
        const dailyVersesArray = new Array(totalDays).fill(baseVersesPerDay);
      
        // Distribute the remaining verses across the days
        for (let i = 0; i < remainingVerses; i++) {
          dailyVersesArray[i]++;
        }
      
        let verseIndex = 0; // Track which verse we are at
        let chapterIndex = 0; // Track the chapter we are processing
      
        // Generate the reading plan
        for (let i = 0; i < totalDays; i++) {
          const dailyReadings: string[] = [];
          let versesForToday = dailyVersesArray[i]; // Number of verses to include for the day
      
          while (versesForToday > 0 && chapterIndex < totalChapters) {
            const chapter = selectedBooks[chapterIndex];
            const remainingVersesInChapter = chapter.verses - verseIndex;
      
            // If the current chapter can fulfill the verses for today
            if (remainingVersesInChapter <= versesForToday) {
              // Add all remaining verses in this chapter
              for (let v = verseIndex + 1; v <= chapter.verses; v++) {
                dailyReadings.push(`${chapter.book_name} ${chapter.chapter}:${v}`);
              }
              versesForToday -= remainingVersesInChapter; // Reduce the verses for today
              verseIndex = 0; // Reset verseIndex
              chapterIndex++; // Move to the next chapter
            } else {
              // If we can only include part of this chapter's verses
              for (let v = verseIndex + 1; v <= verseIndex + versesForToday; v++) {
                dailyReadings.push(`${chapter.book_name} ${chapter.chapter}:${v}`);
              }
              verseIndex += versesForToday; // Update verseIndex
              versesForToday = 0; // Mark the day as complete
            }
          }
      
          // Add the daily reading entry to the plan
          const reading = formatVerseReading(dailyReadings);
          plan.push({
            date: currentDate.toISOString().split("T")[0],
            reading,
          });
      
          // Move to the next date
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }      

  return plan;
};
