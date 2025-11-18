declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  
  export interface AutoTableOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    theme?: 'striped' | 'grid' | 'plain';
    styles?: any;
    headStyles?: any;
  }
  
  export default function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}
