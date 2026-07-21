import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState, useEffect } from "react";

import ExpenseForm from "./ExpenseForm";
import IncomeForm from "./IncomeForm";

function AddExpenseModal({
  expenseToEdit = null,
  incomeToEdit = null,
  openExpense = false,
  openIncome = false,
  onExpenseClose,
  onIncomeClose,
}) {
  const [open, setOpen] = useState(false);

  const [showExpenseModal, setShowExpenseModal] = useState(openExpense);
  const [showIncomeModal, setShowIncomeModal] = useState(openIncome);

  useEffect(() => {
    setShowExpenseModal(openExpense);
  }, [openExpense]);

  useEffect(() => {
    setShowIncomeModal(openIncome);
  }, [openIncome]);

  return (
    <>
      {/* Add Button */}
      {!expenseToEdit && !incomeToEdit && (
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
      )}

      {/* Expense Modal */}
      <Dialog
        open={showExpenseModal}
        onOpenChange={(value) => {
          setShowExpenseModal(value);

          if (!value && onExpenseClose) {
            onExpenseClose();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {expenseToEdit ? "Edit Expense" : "Add New Expense"}
            </DialogTitle>
          </DialogHeader>

          <ExpenseForm
            expense={expenseToEdit}
            isEdit={!!expenseToEdit}
            onSuccess={() => {
              setShowExpenseModal(false);

              if (onExpenseClose) {
                onExpenseClose();
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Income Modal */}
      <Dialog
        open={showIncomeModal}
        onOpenChange={(value) => {
          setShowIncomeModal(value);

          if (!value && onIncomeClose) {
            onIncomeClose();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {incomeToEdit ? "Edit Income" : "Add New Income"}
            </DialogTitle>
          </DialogHeader>

          <IncomeForm
            incomeToEdit={incomeToEdit}
            onSuccess={() => {
              setShowIncomeModal(false);

              if (onIncomeClose) {
                onIncomeClose();
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddExpenseModal;