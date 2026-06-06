import { NgFor, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MonthData, DayData, BackendResponse } from '../models/Absenteeism.model';

@Component({
  selector: 'ltz-calendar-heatmap',
  templateUrl: './calendar-heatmap.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarHeatMap implements OnInit {
  selectedYear = 2026;
  months: MonthData[] = [];
  currentMonth: MonthData | null = null;
  currentMonthIndex = 0;
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hoveredDay: DayData | null = null;
  tooltipPosition: { x: number; y: number } | null = null;
  isExpanded = false;

  private data: { [key: string]: BackendResponse } = {};

  ngOnInit() {
    this.generateCalendar();

    this.loadDataFromBackend([
      {
        date: '2026-01-15',
        departmentId: 'DEPT-001',
        absenteeism: {
          sick: 33,
          holiday: 2,
          other: 1,
        },
        total: 36,
      },
      {
        date: '2026-01-16',
        departmentId: 'DEPT-001',
        absenteeism: {
          sick: 1,
          holiday: 24,
          other: 0,
        },
        total: 25,
      },
    ]);
    this.currentMonth = this.months[this.currentMonthIndex];
  }

  loadDataFromBackend(backendData: BackendResponse[]) {
    this.data = {};
    backendData.forEach((item) => {
      this.data[item.date] = item;
    });
    this.months = [];
    this.generateCalendar();
    this.currentMonth = this.months[this.currentMonthIndex];
  }

  private generateCalendar() {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Helper to create empty day
    const createEmptyDay = (): DayData => ({
      day: null,
      date: null,
      departmentId: '',
      absenteeism: { sick: 0, holiday: 0, other: 0 },
      total: 0,
    });

    const createDay = (dayCounter: number, month: number): DayData => {
      const date = new Date(this.selectedYear, month, dayCounter);
      const dateStr = this.formatDate(date);
      const dayInfo = this.data[dateStr];

      return {
        day: dayCounter,
        date: dateStr,
        departmentId: dayInfo?.departmentId || '',
        absenteeism: dayInfo?.absenteeism || { sick: 0, holiday: 0, other: 0 },
        total: dayInfo?.total || 0,
      };
    };

    for (let month = 0; month < 12; month++) {
      const firstDay = new Date(this.selectedYear, month, 1);
      const daysInMonth = new Date(this.selectedYear, month + 1, 0).getDate();
      const startDayOfWeek = firstDay.getDay();

      const weeks: DayData[][] = [];
      let dayCounter = 1;

      // Create all weeks
      while (dayCounter <= daysInMonth) {
        const week: DayData[] = [];

        for (let i = 0; i < 7; i++) {
          // First week: add empty days before start
          if (weeks.length === 0 && i < startDayOfWeek) {
            week.push(createEmptyDay());
          }
          // Add day if within month
          else if (dayCounter <= daysInMonth) {
            week.push(createDay(dayCounter, month));
            dayCounter++;
          }
          // Fill remaining days with empty
          else {
            week.push(createEmptyDay());
          }
        }

        weeks.push(week);
      }

      this.months.push({
        name: monthNames[month],
        monthIndex: month,
        weeks,
      });
    }
  }
  nextMonth() {
    if (this.currentMonthIndex < 11) {
      this.currentMonthIndex++;
      this.currentMonth = this.months[this.currentMonthIndex];
    }
  }

  previousMonth() {
    if (this.currentMonthIndex > 0) {
      this.currentMonthIndex--;
      this.currentMonth = this.months[this.currentMonthIndex];
    }
  }

  goToMonth(index: number) {
    this.currentMonthIndex = index;
    this.currentMonth = this.months[this.currentMonthIndex];
  }

  getMonthTotal(): number {
    if (!this.currentMonth) return 0;
    return this.currentMonth.weeks
      .flat()
      .filter((day) => day.day !== null)
      .reduce((sum, day) => sum + day.total, 0);
  }

  getMonthAverage(): number {
    if (!this.currentMonth) return 0;
    const days = this.currentMonth.weeks.flat().filter((day) => day.day !== null);
    const total = days.reduce((sum, day) => sum + day.total, 0);
    return Math.round(total / days.length);
  }

  getMonthSickTotal(): number {
    if (!this.currentMonth) return 0;
    return this.currentMonth.weeks
      .flat()
      .filter((day) => day.day !== null)
      .reduce((sum, day) => sum + day.absenteeism.sick, 0);
  }

  getMonthHolidayTotal(): number {
    if (!this.currentMonth) return 0;
    return this.currentMonth.weeks
      .flat()
      .filter((day) => day.day !== null)
      .reduce((sum, day) => sum + day.absenteeism.holiday, 0);
  }

  getMonthOtherTotal(): number {
    if (!this.currentMonth) return 0;
    return this.currentMonth.weeks
      .flat()
      .filter((day) => day.day !== null)
      .reduce((sum, day) => sum + day.absenteeism.other, 0);
  }

  getColor(value: number): string {
    if (value === 0) return '#eff6ff';
    if (value <= 2) return '#bfdbfe';
    if (value <= 5) return '#60a5fa';
    if (value <= 10) return '#3b82f6';
    return '#1e40af';
  }

  onDayHover(dayData: DayData, event: MouseEvent, dayIndex: number) {
    if (dayData.day !== null && !this.isWeekend(dayIndex)) {
      this.hoveredDay = dayData;
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      this.tooltipPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top,
      };
    }
  }

  onDayLeave() {
    this.hoveredDay = null;
    this.tooltipPosition = null;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  toggleSize() {
    this.isExpanded = !this.isExpanded;
  }

  isWeekend(dayIndex: number): boolean {
    return dayIndex === 0 || dayIndex === 6;
  }
}
