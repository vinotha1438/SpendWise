import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import ExpenseForm from "./ExpenseForm";

function AddExpenseModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded-lg"
        > 
          + Add Expense
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        <ExpenseForm />

      </DialogContent>
    </Dialog>
  );
}

export default AddExpenseModal;