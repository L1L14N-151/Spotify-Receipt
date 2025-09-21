import React from 'react';
import { SpotifyReceipt as ReceiptModel } from '../../models/SpotifyReceipt';
import CVSReceipt from './CVSReceipt';
import CasinoReceipt from './CasinoReceipt';
import BreakingBadReceipt from './BreakingBadReceipt';
import NASAReceipt from './NASAReceipt';
import CarrefourReceipt from './CarrefourReceipt';
import MatrixReceipt from './MatrixReceipt';
import { McDonaldsReceipt } from './McDonaldsReceipt';
import { GamingReceipt } from './GamingReceipt';
import { PolaroidReceipt } from './PolaroidReceipt';
import { GitHubReceipt } from './GitHubReceipt';

interface ThemedReceiptProps {
  receipt: ReceiptModel;
  theme: string;
}

const ThemedReceipt: React.FC<ThemedReceiptProps> = ({ receipt, theme }) => {
  switch (theme) {
    case 'cvs':
      return <CVSReceipt receipt={receipt} />;
    case 'casino':
      return <CasinoReceipt receipt={receipt} />;
    case 'breakingbad':
      return <BreakingBadReceipt receipt={receipt} />;
    case 'nasa':
      return <NASAReceipt receipt={receipt} />;
    case 'carrefour':
      return <CarrefourReceipt receipt={receipt} />;
    case 'matrix':
      return <MatrixReceipt receipt={receipt} />;
    case 'mcdonalds':
      return <McDonaldsReceipt receipt={receipt} />;
    case 'gaming':
      return <GamingReceipt receipt={receipt} />;
    case 'polaroid':
      return <PolaroidReceipt receipt={receipt} />;
    case 'github':
      return <GitHubReceipt receipt={receipt} />;
    default:
      return <CVSReceipt receipt={receipt} />;
  }
};

export default ThemedReceipt;