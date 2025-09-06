
export interface Chapter {
  title: string;
  content: string;
}

export interface Book {
  title:string;
  author: string;
  introduction: string;
  chapters: Chapter[];
  conclusion: string;
  tableOfContents: string[];
  references: string;
}

// Type for the initial outline received from Gemini
export interface BookOutline {
    title: string;
    chapters: { title: string }[];
}
