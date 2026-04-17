"use client";

import { useMemo } from 'react';
import type { Saving, SavingType } from '@/types';

interface SavingsBalance {
  pokok: number;
  wajib: number;
  sukarela: number;
  total: number;
}

export function useSavingsBalance(savings: Saving[]): SavingsBalance {
  return useMemo(() => {
    const calcBalance = (type: SavingType | 'all') => {
      return savings
        .filter((s) => (type === 'all' || s.type === type) && s.status === 'completed')
        .reduce((sum, s) => {
          if (s.transactionType === 'deposit') return sum + s.amount;
          if (s.transactionType === 'withdrawal') return sum - s.amount;
          return sum;
        }, 0);
    };

    return {
      pokok: calcBalance('pokok'),
      wajib: calcBalance('wajib'),
      sukarela: calcBalance('sukarela'),
      total: calcBalance('all'),
    };
  }, [savings]);
}
