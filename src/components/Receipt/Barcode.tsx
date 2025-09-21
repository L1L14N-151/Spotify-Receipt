import React from 'react';

interface BarcodeProps {
  value?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const Barcode: React.FC<BarcodeProps> = ({
  value = '4897654321098', // Default rickroll barcode
  width = 200,
  height = 50,
  className = ''
}) => {
  // Generate Code-128 barcode pattern
  const generateBarcodePattern = (input: string): number[] => {
    // Simple barcode pattern generation (not a real Code-128 implementation)
    // Real barcodes would need proper encoding, but this creates a visually convincing pattern
    const pattern: number[] = [];

    // Start guard
    pattern.push(1, 0, 1);

    // Generate bars based on character codes
    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i);
      // Create pattern based on character (simplified)
      pattern.push(
        (charCode & 1) ? 1 : 0,
        (charCode & 2) ? 0 : 1,
        (charCode & 4) ? 1 : 0,
        (charCode & 8) ? 1 : 0,
        (charCode & 16) ? 0 : 1,
        (charCode & 32) ? 1 : 0,
        0 // separator
      );
    }

    // End guard
    pattern.push(1, 0, 1);

    return pattern;
  };

  const barcodePattern = generateBarcodePattern(value);
  const barWidth = width / barcodePattern.length;

  return (
    <div className={className} style={{ display: 'inline-block' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block' }}
      >
        {/* White background */}
        <rect x="0" y="0" width={width} height={height} fill="white" />

        {/* Generate bars */}
        {barcodePattern.map((bar, index) => (
          bar === 1 && (
            <rect
              key={index}
              x={index * barWidth}
              y="0"
              width={barWidth}
              height={height}
              fill="black"
            />
          )
        ))}
      </svg>

      {/* Barcode number below */}
      <div style={{
        textAlign: 'center',
        fontSize: '10px',
        fontFamily: 'monospace',
        marginTop: '2px',
        letterSpacing: '2px'
      }}>
        {value}
      </div>
    </div>
  );
};

// Special rickroll barcode component
export const RickrollBarcode: React.FC<{ className?: string }> = ({ className }) => {
  // This would encode the rickroll URL if it were a real scannable barcode
  // Using a fake product code that looks legitimate
  return <Barcode value="9780393356250" className={className} />;
};