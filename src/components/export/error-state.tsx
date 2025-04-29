
import React from 'react';
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-red-500 mb-4">{error}</p>
      <Button onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
};
