"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function SectionCard({ title, description, icon: Icon, children, className, action }: SectionCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-6 w-6 text-primary" />}
            <CardTitle className="font-headline text-2xl">{title}</CardTitle>
          </div>
          {action}
        </div>
        {description && <CardDescription className="font-body">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="font-body">
        {children}
      </CardContent>
    </Card>
  );
}
