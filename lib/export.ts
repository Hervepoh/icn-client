import axios from 'axios';
import { formatDate } from 'date-fns';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface BillingData {
  paymentDate: string;
  numberOfBills: number;
  totalAmount: number;
  customerName: string;
  transactions: Transaction[];
}

export interface Transaction {
  transaction_id: string;
  bill_account_number: string;
  customerName: string;
  bill_number: string;
  billingDate: string;
  voltageType: string;
  paid_amount: number;
  advancePayment: number;
}


export const exportToPDF = async (id: string) => {

  // Fetch data from the API
  const response = await axios.post('/api/requests/export', { id: id, accessToken: Cookies.get('access_token') });
  const data = response.data?.data || {};

  const doc = new jsPDF();

  // Add header
  doc.setFontSize(16);
  //doc.text('Billing Report', 14, 15);

  // Add summary
  doc.setFontSize(12);
  doc.text(`Payment Date : ${formatDate(data.paymentDate, 'dd/MM/yyyy')}`, 14, 25);
  doc.text(`Number of Bills : ${data.numberOfBills}`, 14, 32);
  doc.text(`Total Amount : ${data.totalAmount}`, 14, 39);
  doc.text(`Customer : ${data.customerName}`, 14, 46);

  // Add transactions table
  autoTable(doc, {
    startY: 55,
    head: [[
      'Transaction', 
      'Contract', 
      'Customer', 
      'Bill Number', 
      'Date', 
      //'Voltage', 
      'Amount', 
      'Advance'
    ]],
    body: data.transactions.map((t: { transaction_id: any; bill_account_number: any; customerName: any; bill_number: any; billingDate: any; voltageType: any; paid_amount: { toLocaleString: () => any; }; advancePayment: { toLocaleString: () => any; }; }) => [
      t.transaction_id,
      t.bill_account_number,
      t.customerName,
      t.bill_number,
      t.billingDate,
      //t.voltageType,
      t.paid_amount.toLocaleString(),
      t.advancePayment.toLocaleString()
    ]),
  });

  doc.save(`receipt-${id}.pdf`);
};

export const exportToExcel = async (id: string) => {

  // Fetch data from the API
  const response = await axios.post('/api/requests/export', { id: id, accessToken: Cookies.get('access_token') });
  const data = response.data?.data || {};

  const wb = XLSX.utils.book_new();

  // Create styles
  const styles = {
    title: {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: "4F81BD" }, patternType: 'solid' }
    },
    header: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" }, patternType: 'solid' },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    },
    summaryLabel: {
      font: { bold: true },
      fill: { fgColor: { rgb: "DCE6F1" }, patternType: 'solid' }
    },
    summaryValue: {
      alignment: { horizontal: 'left' },
      fill: { fgColor: { rgb: "DCE6F1" }, patternType: 'solid' }
    },
    cell: {
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    },
    blueText: {
      font: { color: { rgb: "0000FF" } }, // Bleu
      alignment: { horizontal: 'center', vertical: 'center' },
    },
    borderedCell: {
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  };

  // Prepare data data.status != 9 ? [] : 
  const allData = [
    ['Payment Date', '', formatDate(data?.paymentDate || new Date(), 'dd/MM/yyyy')],
    ['Number of Bills', '', data?.numberOfBills?.toLocaleString()],
    ['Total Amount', '', data?.totalAmount?.toLocaleString()],
    ['Customer/Regroup Name', '', data?.customerName],
    [''],
    ['Transaction', 'Contract', 'Customer', 'Bill Number', 'Date', 'Voltage Type', 'Paid Amount', 'Advance Payment'],
    ...data.transactions.map((t: { transaction_id: any; bill_account_number: any; customerName: any; bill_number: any; billingDate: any; voltageType: any; paid_amount: any; advancePayment: any; }) => [
      t.transaction_id,
      t.bill_account_number,
      t.customerName,
      t.bill_number,
      t.billingDate,
      t.voltageType,
      t.paid_amount,
      t.advancePayment
    ])
  ];

  // Create worksheet with data
  const ws = XLSX.utils.aoa_to_sheet(allData);

  // Set column widths
  ws['!cols'] = [
    { wch: 22 }, // Transaction
    { wch: 15 }, // Contract
    { wch: 20 }, // Customer
    { wch: 15 }, // Bill Number
    { wch: 12 }, // Date
    { wch: 20 }, // Voltage Type
    { wch: 12 }, // Paid Amount
    { wch: 15 }  // Advance Payment
  ];

  // Merge title cells
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, // A1:B1 merge
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } }, // A2:B2 merge
    { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } }, // A3:B3 merge
    { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } }  // A4:B4 merge
  ];

  // Apply cell styles
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:H1');

  // Style title
  // Apply cell styles
  ws.A1 = { ...ws.A1, s: styles.title };
  ws.A2 = { ...ws.A2, s: styles.title };
  ws.A3 = { ...ws.A3, s: styles.title };
  ws.A4 = { ...ws.A4, s: styles.title };

  // Style summary section
  for (let i = 3; i <= 6; i++) {
    ws[`A${i}`] = { ...ws[`A${i}`], s: styles.summaryLabel };
    ws[`C${i}`] = { ...ws[`C${i}`], s: styles.summaryValue };
  }

  // Style the row A6:H6 with blue text and borders
  for (let col = 0; col < 8; col++) { // A6 to H6
    const cellRef = XLSX.utils.encode_cell({ r: 5, c: col }); // Ligne 6 (index 5)
    ws[cellRef] = { ...ws[cellRef], s: { ...styles.blueText, ...styles.borderedCell } };
  }

  // Style transactions header row
  const headerRow = 9;
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: headerRow - 1, c: col });
    ws[cellRef] = { ...ws[cellRef], s: styles.header };
  }

  // Style data cells
  for (let r = headerRow; r <= range.e.r; r++) {
    const rowStyle = {
      ...styles.cell,
      fill: {
        fgColor: { rgb: (r - headerRow) % 2 === 0 ? "FFFFFF" : "F2F2F2" },
        patternType: 'solid'
      }
    };

    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      const alignStyle = c >= 6 ? { alignment: { horizontal: 'right' } } : { alignment: { horizontal: 'left' } };
      ws[cellRef] = {
        ...ws[cellRef],
        s: { ...rowStyle, ...alignStyle }
      };
    }
  }

  // Add worksheet to workbook and save
  XLSX.utils.book_append_sheet(wb, ws, 'Billing ');
  XLSX.writeFile(wb, `RECU_ACI_NUMERO_${data?.reference}.xlsx`);
};


interface ExportData {
  [key: string]: any;
}

export const exportToXLSX = async (data: ExportData[], filename: string): Promise<void> => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Convert data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, filename);

  // Export the workbook to a file 
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
