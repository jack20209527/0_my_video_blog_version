'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

import { Link, usePathname } from '@/core/i18n/navigation';
import {
  BrandLogo,
  SignUser,
} from '@/shared/blocks/common';
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/shared/components/ui/navigation-menu';
import { cn } from '@/shared/lib/utils';
import { Header as HeaderType } from '@/shared/types/blocks/landing';
import { Button } from '@/shared/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet';

export function Header({ header }: { header: HeaderType }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="print:hidden fixed top-4 left-4 right-4 flex flex-col items-center gap-y-4 z-50 transition-colors duration-300">
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex h-[52px] rounded-[20px] px-6 w-full items-center justify-between z-10 relative transition-all duration-300">
        {/* Left Section - Logo and Nav */}
        <div className="flex items-center gap-4 rounded-2xl h-full pl-[10px] bg-[rgba(0,0,0,0.04)] backdrop-blur-[24px]">
          {header.brand && <BrandLogo brand={header.brand} />}
          
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-1 list-none items-center justify-center space-x-1">
                {header.nav?.items?.map((item, idx) => (
                  <NavigationMenuLink key={idx} asChild>
                    <Link
                      href={item.url || ''}
                      target={item.target || '_self'}
                      className={cn(
                        "inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:font-bold focus:outline-hidden disabled:pointer-events-none disabled:opacity-50",
                        pathname === item.url && "font-bold"
                      )}
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Right Section - Subscribe and Sign In */}
        <div className="flex items-center gap-2 rounded-2xl h-full shrink-0 pl-[10px] bg-[rgba(0,0,0,0.04)] backdrop-blur-[24px]">
          {header.buttons && header.buttons[0] && (
            <Button
              asChild
              className="cursor-pointer rounded-xl text-white p-5 opacity-80 border border-white/20 backdrop-blur-sm bg-white/15 shadow-[0_8px_32px_rgba(31,38,135,0.2),inset_0_4px_20px_rgba(255,255,255,0.3)] hover:shadow-xl hover:bg-muted hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
            >
              <Link href={header.buttons[0].url || ''} target={header.buttons[0].target || '_self'}>
                {header.buttons[0].title}
              </Link>
            </Button>
          )}
          
          <div className="flex items-center gap-x-2 px-2 cursor-pointer">
            {header.show_sign ? (
              <SignUser userNav={header.user_nav} />
            ) : (
              <Button
                variant="ghost"
                className="cursor-pointer"
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="block lg:hidden w-full">
        <div className="flex items-center justify-between w-full">
          {header.brand && <BrandLogo brand={header.brand} />}
          
          {mounted && (
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" className="size-9">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    {header.brand && <BrandLogo brand={header.brand} />}
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mb-8 mt-8 flex flex-col gap-4">
                  <div className="w-full" data-orientation="vertical">
                    {header.nav?.items?.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.url || ''}
                        target={item.target || '_self'}
                        className="font-semibold my-4 flex items-center gap-2 px-4"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex-1"></div>

                <div className="border-t pt-4">
                  <div className="mt-2 flex flex-col gap-3">
                    {header.buttons && header.buttons[0] && (
                      <div className="w-full">
                        <Button
                          asChild
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:shadow-xl hover:bg-muted hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 has-[>svg]:px-3 cursor-pointer rounded-xl text-white p-5 opacity-80 border border-white/20 backdrop-blur-sm bg-white/15 shadow-[0_8px_32px_rgba(31,38,135,0.2),inset_0_4px_20px_rgba(255,255,255,0.3)]"
                        >
                          <Link href={header.buttons[0].url || ''} target={header.buttons[0].target || '_blank'}>
                            {header.buttons[0].title}
                          </Link>
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-x-2 px-2 cursor-pointer">
                      {header.show_sign ? (
                        <SignUser userNav={header.user_nav} />
                      ) : (
                        <Button
                          variant="ghost"
                          className="cursor-pointer"
                        >
                          Sign in
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1"></div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
