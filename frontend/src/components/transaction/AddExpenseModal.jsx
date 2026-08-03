import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import ExpenseForm from "./ExpenseForm";
import IncomeForm from "./IncomeForm";

function AddExpenseModal({
  expense = null,
  isEdit = false,
  open: externalOpen,
  setOpen: setExternalOpen,
  onSuccess = () => {},
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [showExpenseModal, setShowExpenseModal] =
    useState(false);

  const [showIncomeModal, setShowIncomeModal] =
    useState(false);

  const modalOpen = isEdit
    ? externalOpen
    : showExpenseModal;

  const setModalOpen = isEdit
    ? setExternalOpen
    : setShowExpenseModal;

  return (
    <>
      {!isEdit && (
        <div className="relative">
          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold"
          >
            + Add
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">

              <button
                className="w-full text-left px-4 py-3 hover:bg-slate-100"
                onClick={() => {
                  setShowExpenseModal(true);
                  setMenuOpen(false);
                }}
              >
                💸 Add Expense
              </button>

              <button
                className="w-full text-left px-4 py-3 hover:bg-slate-100"
                onClick={() => {
                  setShowIncomeModal(true);
                  setMenuOpen(false);
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
        open={modalOpen}
        onOpenChange={setModalOpen}
      >
        <DialogContent>

          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? "Edit Expense"
                : "Add Expense"}
            </DialogTitle>
          </DialogHeader>

          <ExpenseForm
            expense={expense}
            isEdit={isEdit}
            onSuccess={() => {
              setModalOpen(false);
              onSuccess();
            }}
          />

        </DialogContent>
      </Dialog>

      {/* Income Modal */}

      {!isEdit && (
        <Dialog
          open={showIncomeModal}
          onOpenChange={setShowIncomeModal}
        >
          <DialogContent>

            <DialogHeader>
              <DialogTitle>
                Add Income
              </DialogTitle>
            </DialogHeader>

            <IncomeForm
              onSuccess={() => {
                setShowIncomeModal(false);
                onSuccess();
              }}
            />

          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default AddExpenseModal;