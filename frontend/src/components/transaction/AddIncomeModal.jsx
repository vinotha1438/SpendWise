import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import IncomeForm from "./IncomeForm";

function AddIncomeModal({
  open,
  setOpen,
  incomeToEdit = null,
  onSuccess,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">

        <DialogHeader>
          <DialogTitle>
            {incomeToEdit ? "Edit Income" : "Add New Income"}
          </DialogTitle>
        </DialogHeader>

        <IncomeForm
          incomeToEdit={incomeToEdit}
          onSuccess={() => {
            onSuccess();
            setOpen(false);
          }}
        />

      </DialogContent>
    </Dialog>
  );
}

export default AddIncomeModal;