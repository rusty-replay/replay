import { useParams } from 'next/navigation';
import React from 'react';

export function useGetErrorParams() {
  const { error_id: errorId } = useParams();

  return { errorId };
}
