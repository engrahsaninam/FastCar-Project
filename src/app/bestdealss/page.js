'use client';

import AppBar from '@/components/AppBar2'
import BestDealsPage from '@/components/bestdealss/bestdealspage'
import React, { Suspense } from 'react'

const BestDealsPageWrapper = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <BestDealsPage />
    </Suspense>
  );
};

const BestDeals = () => {
  return (
    <div>
      <AppBar />
      <BestDealsPageWrapper/>
    </div>
  )
}

export default BestDeals