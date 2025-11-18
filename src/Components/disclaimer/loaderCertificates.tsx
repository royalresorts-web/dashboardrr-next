"use client";
import React from 'react';
// Assuming you're using shadcn/ui, adjust import paths as needed
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from "@/Components/ui/alert-dialog";
// Assuming Loader is a custom component or from a library
import Loader from "@/Components/loader"; 

// 1. Define the props interface
interface LoadingDisclaimerProps {
  disclaimerLoading: boolean;
}

/**
 * Renders a loading indicator within an Alert Dialog.
 * * @param {LoadingDisclaimerProps} props - The component props.
 * @param {boolean} props.disclaimerLoading - Controls whether the dialog is open.
 */
const LoadingDisclaimer: React.FC<LoadingDisclaimerProps> = ({
  disclaimerLoading,
}) => {
  return (
    <AlertDialog open={disclaimerLoading}>
      <AlertDialogContent className="w-[200px] h-auto">
        <AlertDialogTitle className="hidden"></AlertDialogTitle>
        <Loader />
      </AlertDialogContent>
    </AlertDialog>
  );
};
export {LoadingDisclaimer}