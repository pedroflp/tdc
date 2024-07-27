'use client';

import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { ThemeEnum } from '@/providers/ThemeProvider'
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';

export default function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  function handleToggleTheme() {
    if (theme === ThemeEnum.DARK) {
      setTheme(ThemeEnum.LIGHT)
    } else {
      setTheme(ThemeEnum.DARK)
    }
  }

  return (
    <Button variant="outline" className='w-full gap-2 hover:bg-background overflow-hidden' onClick={handleToggleTheme}>
      {theme === ThemeEnum.DARK
        ? <Sun size={18} />
        : <Moon size={18} />
      }
      Utilizar tema {theme === ThemeEnum.DARK ? 'claro' : 'escuro'}
    </Button>
  )
}
