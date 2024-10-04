import { CircleX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./dialog";

interface TxFailedDialogProps {
  open: boolean;
  error?: string;
  children?: React.ReactNode;
  onOpenChange: () => void;
}

export function TxFailedDialog({
  open,
  error,
  children,
  onOpenChange,
}: TxFailedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle> Transaction failed!</DialogTitle>
        <div className="flex justify-center items-center">
          <CircleX className="h-10 w-10 text-destructive" />
        </div>
        <DialogDescription className="text-center">
          Failed to broadcast the transaction
        </DialogDescription>
        {children}
        <DialogDescription className="mt-5 w-full">
          <span>Error message:</span>
          <span className="text-destructive ml-2">
            {error?.length && error.length > 250 ? error.slice(0, 250) + '...' : error}
          </span>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
