import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import IncomeForm from "./IncomeForm";

function AddIncomeModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          style={{ display: "none" }}
          id="openIncomeModal"
        >
          Open
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Income</DialogTitle>
        </DialogHeader>

        <IncomeForm />

      </DialogContent>
    </Dialog>
  );
}

export default AddIncomeModal;