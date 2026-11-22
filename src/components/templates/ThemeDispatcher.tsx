'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import { getThemeComponent } from './registry';
import VerifiedProfileStats from './VerifiedProfileStats';

interface Props {
  data: PortfolioData;
}

export default function ThemeDispatcher({ data }: Props) {
  const ThemeComponent = getThemeComponent(data.templateId);

  return (
    <div className="relative">
      <ThemeComponent data={data} />
      <VerifiedProfileStats data={data} />
    </div>
  );
}
