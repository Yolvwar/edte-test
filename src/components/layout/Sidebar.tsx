import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, GitBranch, CheckSquare, User } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppSidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <LayoutDashboard className="mr-2 h-4 w-4" />, label: 'Tableau de bord' },
    { path: '/documents', icon: <FileText className="mr-2 h-4 w-4" />, label: 'Documents' },
    { path: '/processes', icon: <GitBranch className="mr-2 h-4 w-4" />, label: 'Processus' },
    { path: '/validations', icon: <CheckSquare className="mr-2 h-4 w-4" />, label: 'Validations' },
  ];

  return (
    <div className="h-full w-64 border-r bg-background flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold">DocWorkflow</h1>
      </div>

      <nav className="flex-1 px-2 py-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center text-sm font-medium py-2 px-3 rounded-md transition-colors",
                  isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <Separator />

      <div className="p-4">
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
                    </Avatar>
                    <div className="ml-2 text-left">
                      <p className="text-sm font-medium">Utilisateur</p>
                      <p className="text-xs text-muted-foreground">Service Juridique</p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>Paramètres</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Déconnexion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}