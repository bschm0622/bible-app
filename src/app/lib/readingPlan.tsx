

  // BibleBook type definition
  export interface BibleBook {
    book_name: string;
    testament: string;
    type: string;
    chapter: number;  // A single chapter
    verses: number;   // Verses in that chapter
  }


    interface PlanEntry {
      date: string;
      reading: string;
    }
    
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
      
      if (totalChapters === 0) {
        alert("No chapters available to distribute.");
        return [
          {
            date: "",
            reading: "Error: No chapters found in the selected books.",
          },
        ];
      }
    
      // Ensure that the end date is later than the start date
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
    
      let chapterIndex = 0;
      let verseIndex = 0;
    
      for (let i = 0; i < totalDays; i++) {
        if (currentDate > endDate) break;
    
        const dailyReadings: string[] = [];
    
        if (method === "chapter") {
          const chaptersPerDay = Math.ceil(totalChapters / totalDays);
          for (let j = 0; j < chaptersPerDay; j++) {
            if (chapterIndex >= totalChapters) break;
            const chapter = selectedBooks[chapterIndex];
            dailyReadings.push(`${chapter.book_name} ${chapter.chapter}`);
            chapterIndex++;
          }
        } else if (method === "verse") {
          const versesPerDay = Math.ceil(totalVerses / totalDays);
          let versesForToday = 0;
    
          while (versesForToday < versesPerDay && chapterIndex < totalChapters) {
            const chapter = selectedBooks[chapterIndex];
            const remainingVerses = chapter.verses - verseIndex;
    
            if (versesForToday + remainingVerses <= versesPerDay) {
              // Include entire chapter
              dailyReadings.push(
                `${chapter.book_name} ${chapter.chapter}:${verseIndex + 1}-${chapter.verses}`
              );
              versesForToday += remainingVerses;
              verseIndex = 0; // Reset verse index for the next chapter
              chapterIndex++;
            } else {
              // Include partial chapter
              const endVerse = verseIndex + (versesPerDay - versesForToday);
              dailyReadings.push(
                `${chapter.book_name} ${chapter.chapter}:${verseIndex + 1}-${endVerse}`
              );
              versesForToday = versesPerDay;
              verseIndex = endVerse; // Move verse index to the next unprocessed verse
            }
          }
        } else if (method === "mixed") {
          const mixedChunksPerDay = Math.ceil((totalChapters + totalVerses) / totalDays);
          let mixedChunksForToday = 0;
    
          while (mixedChunksForToday < mixedChunksPerDay && chapterIndex < totalChapters) {
            const chapter = selectedBooks[chapterIndex];
    
            if (mixedChunksForToday + 1 <= mixedChunksPerDay) {
              // Add the full chapter
              dailyReadings.push(
                `${chapter.book_name} ${chapter.chapter}:${verseIndex + 1}-${chapter.verses}`
              );
              mixedChunksForToday += 1;
              verseIndex = 0;
              chapterIndex++;
            } else {
              // Add partial chapter
              const endVerse = verseIndex + (mixedChunksPerDay - mixedChunksForToday);
              dailyReadings.push(
                `${chapter.book_name} ${chapter.chapter}:${verseIndex + 1}-${endVerse}`
              );
              mixedChunksForToday = mixedChunksPerDay;
              verseIndex = endVerse;
            }
          }
        } else {
          alert("Invalid method selected. Please choose 'chapter', 'verse', or 'mixed'.");
          return [
            {
              date: "",
              reading: "Error: Invalid method.",
            },
          ];
        }
    
        const reading = dailyReadings.join(", ");
        plan.push({
          date: currentDate.toISOString().split("T")[0],
          reading,
        });
    
        // Move to the next date
        currentDate.setDate(currentDate.getDate() + 1);
      }
    
      // If the plan generated is shorter than expected, pad with error messages
      if (plan.length < totalDays) {
        plan.push({
          date: currentDate.toISOString().split("T")[0],
          reading: "No reading for this day.",
        });
      }
    
      return plan;
    };
    