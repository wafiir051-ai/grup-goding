import { createContext } from 'react';

// MotionValue kemiringan (derajat) dari kecepatan scroll, dibagi semua kartu.
// null = efek mati (reduced motion atau di luar provider).
export const SkewContext = createContext(null);
