/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as Icons from 'lucide-react';

interface M3IconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function M3Icon({ name, className = '', size = 24 }: M3IconProps) {
  // Safe lookup for Lucide icons
  const LucideIcon = (Icons as any)[name];
  
  if (!LucideIcon) {
    // Return a default icon if not found
    const Fallback = Icons.Calculator;
    return <Fallback className={className} size={size} />;
  }

  return <LucideIcon className={className} size={size} />;
}
