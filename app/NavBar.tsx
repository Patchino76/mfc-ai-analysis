"use client"

import Link from "next/link"
import Image from "next/image"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function NavBar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/rawdata" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Данни</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/chat" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Анализи</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/questions" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Въпроси</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <h1 className="text-2xl font-semibold">АНАЛИЗ НА ДАННИ С ИИ</h1>
        <div className="flex items-center space-x-4">
          <Image src="/images/em_logo.jpg" alt="Logo" width={152} height={52} />
        </div>
      </div>
    </div>
  )
}
