import React from 'react';
import { alpha } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { useThemeColor } from '../utils/colors';

export interface PercentagePieProps {
  percentage: number;
  size?: number;
  color?: string;
  backgroundAlpha?: number;
  backgroundColor?: string;
  offsetPercentage?: number;
}

const PercentagePie: React.FC<PercentagePieProps> = ({
  percentage,
  size = 20,
  color = 'info',
  backgroundAlpha = 0.2,
  offsetPercentage = 0,
  backgroundColor,
}) => {
  const fillColor = useThemeColor(color);
  const bgColor = useThemeColor(backgroundColor || color);

  const radius = size / 2;

  const startAngle = -90 + 360 * offsetPercentage;
  const endAngle = startAngle + 360 * percentage;

  const x1 = radius + radius * Math.cos((startAngle * Math.PI) / 180);
  const y1 = radius + radius * Math.sin((startAngle * Math.PI) / 180);
  const x2 = radius + radius * Math.cos((endAngle * Math.PI) / 180);
  const y2 = radius + radius * Math.sin((endAngle * Math.PI) / 180);

  const largeArcFlag = percentage > 0.5 ? 1 : 0;

  backgroundAlpha = percentage === 1 ? 1 : backgroundAlpha;

  return (
    <Tooltip title={`${(percentage * 100).toFixed(2)}%`} arrow>
      <svg
        width={size}
        height={size}
        style={{ marginLeft: 4, marginRight: 4 }}
        aria-label={`${percentage * 100}%`}
      >
        <circle
          cx={radius}
          cy={radius}
          r={radius}
          fill={alpha(bgColor, backgroundAlpha)}
        />
        {0 < percentage && percentage < 1 && (
          <path
            d={`M ${radius},${radius} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`}
            fill={fillColor}
          />
        )}
      </svg>
    </Tooltip>
  );
};

export default PercentagePie;
