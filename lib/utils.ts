import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountFromMilliunits(amount: number) {
  // TODO: check the user currency to improve the reverse conversion
  const taux = 1 // 1000
  return amount / taux;
}

export function convertAmountToMilliunits(amount: number) {
  // TODO: check the user currency to improve conversion
  const taux = 1 // 1000
  return Math.round(amount * taux);
}

export function formatCurrency(value: number) {
  // TODO: get locale dynamically // DOC:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#digit_options
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF", // also supports XOF | USD | EUR | JPY  read ISO 4217 currency names
    // minimumFractionDigits: 2,
  }).format(value)

  return formatted;
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = { addPrefix: false },
) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(value/100)


  if (options.addPrefix && value > 0) {
    return `+${formatted}`;
  }

  return formatted;
}

export function calculatePercentageChange(
  current: number,
  previous: number
) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;

};

export function fillMissingDays(activeDays: {
  date: Date,
  income: number,
  expenses: number
}[],
  startDate: Date,
  endDate: Date) {
  if (activeDays.length === 0) return [];
  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));
    if (found) {
      return found;
    } else {
      return {
        date: day,
        income: 0,
        expenses: 0
      }
    }
  });

  return transactionsByDay;
}


const formatDate = (date: string | number | Date)=>{
  date = new Date(date);
  const month = date.getMonth() + 1; // Add 1 because month values are zero-based
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

 return(formattedDate);
}



type Period = {
  to: string | Date | undefined;
  from: string | Date | undefined;
}

export function formatDateRange(period: Period) {
  const DATEFORMAT = "LLL dd";
  const DATEFORMATYEAR = "LLL dd, y";
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    if (isSameYear(defaultFrom, defaultTo)){
      return `${format(defaultFrom, DATEFORMAT)} - ${format(defaultTo, DATEFORMATYEAR)}`
    }
     
    return `${format(defaultFrom, DATEFORMATYEAR)} - ${format(defaultTo, DATEFORMATYEAR)}`  
  }

  if (period.to) {
    if (isSameYear(new Date(period.from), new Date(period.to))){
      return `${format(period.from, DATEFORMAT)} - ${format(period.to, DATEFORMATYEAR)}`
    }
    return `${format(period.from, DATEFORMATYEAR)} - ${format(period.to, DATEFORMATYEAR)}`
  }

  return format(period.from, DATEFORMATYEAR);

}

export function isSameYear(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear();
}
