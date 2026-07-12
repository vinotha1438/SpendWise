import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";

import ExpenseForm from "./ExpenseForm";
import IncomeForm from "./IncomeForm";

function AddExpenseModal() {
  const [open, setOpen] = useState(false);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  return (
    <>
      {/* Add Button */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setOpen(!open)}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg"
        >
          + Add ▼
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "45px",
              background: "white",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              overflow: "hidden",
              minWidth: "180px",
              zIndex: 999,
            }}
          >
            <button
              onClick={() => {
                setShowExpenseModal(true);
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                background: "white",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              💸 Add Expense
            </button>

            <button
              onClick={() => {
                setShowIncomeModal(true);
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                background: "white",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              💰 Add Income
            </button>
          </div>
        )}
      </div>

      {/* Expense Modal */}
      <Dialog
        open={showExpenseModal}
        onOpenChange={setShowExpenseModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>

          <ExpenseForm />
        </DialogContent>
      </Dialog>

      {/* Income Modal */}
      <Dialog
        open={showIncomeModal}
        onOpenChange={setShowIncomeModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Income</DialogTitle>
          </DialogHeader>

          <IncomeForm />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddExpenseModal;