import React, { useContext } from 'react';
import s from './styles.module.scss';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';

interface IProps {
  width?: number;
  height?: number;
  isLoaded?: boolean;
  fill?: boolean;
  className?: string;
}

const Skeleton: React.FC<IProps> = ({
  width,
  height,
  isLoaded,
  fill = false,
  className,
}) => {
  const { isProMode } = useContext(GenerativeProjectDetailContext);
  if (isLoaded) return null;

  return (
    <div
      className={`${s.skeleton} ${isProMode ? s.isDark : ''} ${className}`}
      style={
        fill
          ? { width: '100%', height: '100%' }
          : { width: `${width}px`, height: `${height}px` }
      }
    />
  );
};

export default Skeleton;
