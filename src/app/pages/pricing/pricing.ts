import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../shared/logo/logo';

interface PricingPlan {
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  features: string[];
  cta: string;
  highlight?: boolean;
}

interface Faq {
  question: string;
  answer: string;
}

@Component({
  selector: 'ltz-pricing',
  imports: [RouterLink, Logo],
  templateUrl: './pricing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingComponent {
  yearly = signal(false);

  plans: PricingPlan[] = [
    {
      name: 'Starter',
      tagline: 'For trying things out.',
      monthly: 0,
      yearly: 0,
      cta: 'Start for free',
      features: ['20 credits / month', 'Basic templates', 'Standard exports', 'Community support'],
    },
    {
      name: 'Pro',
      tagline: 'For growing Etsy sellers.',
      monthly: 19,
      yearly: 15,
      cta: 'Choose Pro',
      highlight: true,
      features: [
        '100 credits / month',
        'All templates & mockups',
        'HD exports',
        'AI captions & SEO',
        'Priority support',
      ],
    },
    {
      name: 'Studio',
      tagline: 'For teams & power users.',
      monthly: 49,
      yearly: 39,
      cta: 'Choose Studio',
      features: [
        'Unlimited credits',
        'Brand kit & team seats',
        '4K exports',
        'API access',
        'Dedicated support',
      ],
    },
  ];

  faqs: Faq[] = [
    {
      question: 'Can I change plans later?',
      answer: 'Yes — upgrade or downgrade at any time. Changes are prorated automatically.',
    },
    {
      question: 'What is a credit?',
      answer: 'One credit generates one set of listing assets — captions, SEO, and a mockup.',
    },
    {
      question: 'Do unused credits roll over?',
      answer: 'Credits reset each billing cycle. Studio plans include unlimited generations.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'The Starter plan is free forever. No credit card required to get started.',
    },
  ];

  toggleBilling(): void {
    this.yearly.update((v) => !v);
  }

  priceFor(plan: PricingPlan): number {
    return this.yearly() ? plan.yearly : plan.monthly;
  }
}
