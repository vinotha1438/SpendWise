import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import { useData } from "../../context/DataContext";

function TransferModal({ open, onClose, onSuccess }) {
  const { accounts, refreshData } = useData();

  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");

  const [transferDate, setTransferDate] = useState(
    new Date().toISOString().substring(0, 10)
  );

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const fromAccount = accounts.find(
    (a) => String(a.id) === String(fromAccountId)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fromAccountId || !toAccountId) {
      return toast.error("Select both accounts");
    }

    if (fromAccountId === toAccountId) {
      return toast.error(
        "Source and destination accounts must be different"
      );
    }

    if (!amount || Number(amount) <= 0) {
      return toast.error("Enter a valid amount");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await API.post(
        "/transfers",
        {
          from_account_id: Number(fromAccountId),
          to_account_id: Number(toAccountId),
          amount: Number(amount),
          transfer_date: transferDate,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Transfer Successful");

      setFromAccountId("");
      setToAccountId("");
      setAmount("");
      setNotes("");

      refreshData();
      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Transfer failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        <h2 className="mb-2 text-2xl font-bold">
          🔁 Transfer Between Accounts
        </h2>

        <p className="mb-6 text-sm text-slate-500">
          Move money between your own accounts. This is not
          counted as income or expense.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              From Account
            </label>

            <select
              className="w-full rounded-xl border border-slate-300 p-3"
              value={fromAccountId}
              onChange={(e) =>
                setFromAccountId(e.target.value)
              }
            >
              <option value="">
                Select Account
              </option>

              {accounts.map((account) => (
                <option
                  key={account.id}
                  value={account.id}
                >
                  {account.account_name} — ₹
                  {Number(
                    account.current_balance || 0
                  ).toLocaleString("en-IN")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              To Account
            </label>

            <select
              className="w-full rounded-xl border border-slate-300 p-3"
              value={toAccountId}
              onChange={(e) =>
                setToAccountId(e.target.value)
              }
            >
              <option value="">
                Select Account
              </option>

              {accounts
                .filter(
                  (account) =>
                    String(account.id) !==
                    String(fromAccountId)
                )
                .map((account) => (
                  <option
                    key={account.id}
                    value={account.id}
                  >
                    {account.account_name} — ₹
                    {Number(
                      account.current_balance || 0
                    ).toLocaleString("en-IN")}
                  </option>
                ))}
            </select>
          </div>

          <input
            type="number"
            placeholder="Amount"
            className="w-full rounded-xl border border-slate-300 p-3"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />

          {fromAccount &&
            amount &&
            Number(amount) >
              Number(fromAccount.current_balance || 0) && (
              <p className="text-sm text-amber-600">
                ⚠️ This will take {fromAccount.account_name} into
                a negative balance.
              </p>
            )}

          <input
            type="date"
            className="w-full rounded-xl border border-slate-300 p-3"
            value={transferDate}
            onChange={(e) =>
              setTransferDate(e.target.value)
            }
          />

          <textarea
            placeholder="Notes (optional)"
            className="w-full rounded-xl border border-slate-300 p-3"
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-200 px-5 py-2 hover:bg-slate-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-emerald-500 px-5 py-2 text-white hover:bg-emerald-600"
            >
              {loading
                ? "Transferring..."
                : "Transfer"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default TransferModal;
