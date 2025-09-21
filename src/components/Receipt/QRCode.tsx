import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value?: string;
  size?: number;
  className?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({
  value = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  size = 100,
  className = ''
}) => {
  return (
    <div className={className} style={{ display: 'inline-block' }}>
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        bgColor="white"
        fgColor="black"
        style={{ display: 'block' }}
      />
    </div>
  );
};

// Special rickroll QR code component
export const RickrollQRCode: React.FC<{
  className?: string;
  size?: number;
  inverted?: boolean;
}> = ({
  className,
  size = 100,
  inverted = false
}) => {
  // Direct link to Rick Astley - Never Gonna Give You Up
  return (
    <div className={className} style={{ display: 'inline-block' }}>
      <div style={{
        background: inverted ? 'transparent' : 'white',
        padding: inverted ? '0' : '8px',
        borderRadius: '4px',
        display: 'inline-block'
      }}>
        <QRCodeSVG
          value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          size={size}
          level="M"
          bgColor={inverted ? "black" : "white"}
          fgColor={inverted ? "white" : "black"}
          style={{ display: 'block' }}
        />
      </div>
    </div>
  );
};