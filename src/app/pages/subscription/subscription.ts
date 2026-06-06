import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  current?: boolean;
  highlight?: boolean;
}

interface Invoice {
  date: string;
  amount: string;
  status: string;
}

@Component({
  selector: 'ltz-subscription',
  imports: [RouterLink],
  templateUrl: './subscription.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionComponent {
  creditsUsed = 46;
  creditsTotal = 100;

  plans: Plan[] = [
    {
      name: 'Starter',
      price: '€0',
      period: '/mo',
      features: ['20 credits / month', 'Basic templates', 'Standard exports'],
    },
    {
      name: 'Pro',
      price: '€19',
      period: '/mo',
      features: ['100 credits / month', 'All templates', 'HD exports', 'Priority support'],
      current: true,
      highlight: true,
    },
    {
      name: 'Studio',
      price: '€49',
      period: '/mo',
      features: ['Unlimited credits', 'Brand kit & teams', '4K exports', 'Dedicated support'],
    },
  ];

  invoices: Invoice[] = [
    { date: 'May 1, 2026', amount: '€19.00', status: 'Paid' },
    { date: 'Apr 1, 2026', amount: '€19.00', status: 'Paid' },
    { date: 'Mar 1, 2026', amount: '€19.00', status: 'Paid' },
  ];

  get creditsPercent(): number {
    return Math.round((this.creditsUsed / this.creditsTotal) * 100);
  }
}
