"use client";

import { MenuIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../Authcontext/AuthContext';


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "../mode-toggle";

const Navbar5 = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const features = [
    { title: "Dashboard", description: "Overview of your activity", href: "#" },
    { title: "Analytics", description: "Track your performance", href: "#" },
    { title: "Settings", description: "Configure your preferences", href: "#" },
    { title: "Integrations", description: "Connect with other tools", href: "#" },
    { title: "Storage", description: "Manage your files", href: "#" },
    { title: "Support", description: "Get help when needed", href: "#" },
  ];

  return (
    <section className="py-4">
      <div className="container">
        <nav className="flex items-center justify-between px-4 ">
          <a href="https://www.shadcnblocks.com" className="flex items-center gap-2">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
              className="max-h-8"
              alt="Shadcn UI Navbar"
            />
            <span className="text-lg font-semibold tracking-tighter">Shadcnblocks.com</span>
          </a>

          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {features.map((feature, index) => (
                      <NavigationMenuLink
                        href={feature.href}
                        key={index}
                        className="rounded-md p-3 transition-colors hover:bg-muted/70"
                      >
                        <p className="mb-1 font-semibold text-foreground">{feature.title}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Other menu items... */}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden items-center gap-4 lg:flex">
            {!user ? (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
                <Button onClick={() => navigate('/register')}>Sign up</Button>
              </>
            ) : (
              <>
                <span className="mr-4 font-semibold">Hello, {user.name || 'User'}</span>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
            <ModeToggle />
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="max-h-screen overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  <a href="https://www.shadcnblocks.com" className="flex items-center gap-2">
                    <img
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                      className="max-h-8"
                      alt="Shadcn UI Navbar"
                    />
                    <span className="text-lg font-semibold tracking-tighter">Shadcnblocks.com</span>
                  </a>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4">
                {/* Features accordion */}
                {/* ... your accordion code here ... */}
                <div className="mt-6 flex flex-col gap-4">
                  {!user ? (
                    <>
                      <Button variant="outline" onClick={() => navigate('/login')}>
                        Sign in
                      </Button>
                      <Button onClick={() => navigate('/register')}>Sign up</Button>
                    </>
                  ) : (
                    <>
                      <span className="mb-2 font-semibold">Hello, {user.name || 'User'}</span>
                      <Button variant="outline" onClick={logout}>
                        Logout
                      </Button>
                    </>
                  )}
                  <ModeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </section>
  );
};

export default Navbar5;
