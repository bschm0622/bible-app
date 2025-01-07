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
        return { method: 'chapters' };
      }
    
      if (targetVersesPerDay > averageVersesPerChapter) {
        return { method: 'mixed' };
      }
    
      return { method: 'verses' };
    }
    
    
    // Function to generate the reading plan based on user input
    export const generateReadingPlan = (
      method: string,
      selectedBooks: BibleBook[],
      totalDays: number,
      startDate: Date,
      endDate: Date
    ): PlanEntry[] => {
      const plan: PlanEntry[] = [];
      const currentDate = new Date(startDate);
    
      // Calculate the total chapters
      const totalChapters = selectedBooks.length;
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
    
      // Distribute chapters per day
      const baseChaptersPerDay = Math.floor(totalChapters / totalDays);
      const remainingChapters = totalChapters % totalDays;
    
      const dailyChaptersArray = new Array(totalDays).fill(baseChaptersPerDay);
      for (let i = 0; i < remainingChapters; i++) {
        dailyChaptersArray[i]++;
      }
    
      let chapterIndex = 0;
    
      // Generate the reading plan based on the date range
      for (let i = 0; i < totalDays; i++) {
        // Ensure we don't go past the end date
        if (currentDate > endDate) break;
    
        const chaptersForToday = dailyChaptersArray[i];
        const dailyReadings: string[] = [];
    
        for (let j = 0; j < chaptersForToday; j++) {
          if (chapterIndex >= totalChapters) break;
    
          const chapter = selectedBooks[chapterIndex];
          dailyReadings.push(`${chapter.book_name} ${chapter.chapter}`);
          chapterIndex++;
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
    