import { CheckCircle, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./dialog";
import { truncateAddress } from "@aptos-labs/wallet-adapter-react";

interface TxSuccessDialogProps {
  open: boolean;
  txLink?: string;
  children?: React.ReactNode;
  onOpenChange: () => void;
}

export function TxSuccessDialog({
  open,
  txLink,
  children,
  onOpenChange,
}: TxSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle> Transaction success!</DialogTitle>
        <div className="flex justify-center items-center">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <DialogDescription className="text-center">
          Transaction submitted successfully
        </DialogDescription>
        {children}
        <DialogDescription className="mt-5 w-full flex justify-between">
          <span>Transaction link:</span>
          <a
            href={txLink}
            target="blank_"
            className="text-end underline flex font-semibold cursor-pointer"
          >
            {truncateAddress(txLink)}
            <ExternalLink className="ml-2 w-4 h-4" />
          </a>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
