import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import API from "../services/api";
import AppLayout from "../components/layout/AppLayout";
import { useData } from "../context/DataContext";
import TransferModal from "../components/transaction/TransferModal";

function Accounts() {
  const { t } = useTranslation();

  // This page keeps its own richer local `accounts` state (used for
  // its own loading/display), but also notifies the shared
  // DataContext after every mutation so Sidebar/Dashboard/other
  // pages reflect account changes immediately too.
  const { refreshData, transfers } = useData();

  const [showTransferModal, setShowTransferModal] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const [formData, setFormData] = useState({
    account_name: "",
    account_type: "Bank",
    opening_balance: "",
  });

  const fetchAccounts = async () => {
    try {
      setLoading(true);

      const response = await API.get("/accounts");

      setAccounts(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.log("Accounts Error:", error);

      toast.error(
        error.response?.data?.message ||
          t("failedToLoadAccounts")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      account_name: "",
      account_type: "Bank",
      opening_balance: "",
    });

    setEditingAccount(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.account_name.trim()) {
      toast.error(t("enterAccountName"));
      return;
    }

    try {
      if (editingAccount) {
        await API.put(
          `/accounts/${editingAccount.id}`,
          {
            account_name: formData.account_name,
            account_type: formData.account_type,
            opening_balance:
              Number(formData.opening_balance) || 0,
          }
        );

        toast.success(t("accountUpdatedSuccessfully"));
      } else {
        await API.post("/accounts", {
          account_name: formData.account_name,
          account_type: formData.account_type,
          opening_balance:
            Number(formData.opening_balance) || 0,
        });

        toast.success(t("accountAddedSuccessfully"));
      }

      resetForm();
      fetchAccounts();
      refreshData();
    } catch (error) {
      console.log("Save Account Error:", error);

      toast.error(
        error.response?.data?.message ||
          t("failedToSaveAccount")
      );
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);

    setFormData({
      account_name: account.account_name || "",
      account_type: account.account_type || "Bank",
      opening_balance:
        account.opening_balance || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      t("confirmDeleteAccount")
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/accounts/${id}`);

      toast.success(t("accountDeletedSuccessfully"));

      fetchAccounts();
      refreshData();
    } catch (error) {
      console.log("Delete Account Error:", error);

      toast.error(
        error.response?.data?.message ||
          t("failedToDeleteAccount")
      );
    }
  };

  const totalBalance = accounts.reduce(
    (sum, account) =>
      sum + Number(account.current_balance || 0),
    0
  );

  const getAccountIcon = (type) => {
    if (type === "Cash") {
      return "💵";
    }

    if (type === "Wallet") {
      return "👛";
    }

    return "🏦";
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-foreground">
              🏦 {t("myAccounts")}
            </h1>

            <p className="mt-2 text-muted-foreground">
              {t("manageAccountsSubtitle")}
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() => setShowTransferModal(true)}
              className="rounded-xl bg-slate-700 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              🔁 Transfer
            </button>

            <button
              onClick={() => {
                setEditingAccount(null);

                setFormData({
                  account_name: "",
                  account_type: "Bank",
                  opening_balance: "",
                });

                setShowForm(true);
              }}
              className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              + {t("addAccount")}
            </button>

          </div>

        </div>

        {showTransferModal && (
          <TransferModal
            open={showTransferModal}
            onClose={() => setShowTransferModal(false)}
            onSuccess={() => {
              setShowTransferModal(false);
              fetchAccounts();
            }}
          />
        )}

        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">

          <p className="text-sm text-muted-foreground">
            {t("totalBalance")}
          </p>

          <h2 className="mt-2 text-4xl font-bold text-emerald-600">
            ₹{totalBalance.toLocaleString("en-IN")}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {t("acrossAllAccounts")}
          </p>

        </div>

        {showForm && (
          <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold text-foreground">
              {editingAccount
                ? `✏️ ${t("editAccount")}`
                : `➕ ${t("addAccount")}`}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 md:grid-cols-3"
            >

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  {t("accountName")}
                </label>

                <input
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                  placeholder={t("accountNamePlaceholder")}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  {t("accountType")}
                </label>

                <select
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Bank">
                    {t("bank")}
                  </option>

                  <option value="Cash">
                    {t("cash")}
                  </option>

                  <option value="Wallet">
                    {t("walletUpi")}
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  {t("openingBalance")}
                </label>

                <input
                  type="number"
                  name="opening_balance"
                  value={formData.opening_balance}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-3 md:col-span-3">

                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                  {editingAccount
                    ? t("updateAccount")
                    : t("saveAccount")}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-300"
                >
                  {t("cancel")}
                </button>

              </div>

            </form>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">
            {t("loadingAccounts")}
          </div>
        ) : accounts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">

            <div className="text-5xl">
              🏦
            </div>

            <h2 className="mt-4 text-xl font-bold text-foreground">
              {t("noAccountsYet")}
            </h2>

            <p className="mt-2 text-muted-foreground">
              {t("addYourAccountsPrompt")}
            </p>

          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {accounts.map((account) => (

              <div
                key={account.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                      {getAccountIcon(
                        account.account_type
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-foreground">
                        {account.account_name}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {account.account_type}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="mt-6">

                  <p className="text-sm text-muted-foreground">
                    {t("currentBalance")}
                  </p>

                  <h2
                    className={`mt-1 text-3xl font-bold ${
                      Number(account.current_balance) >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    ₹
                    {Number(
                      account.current_balance || 0
                    ).toLocaleString("en-IN")}
                  </h2>

                </div>

                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() =>
                      handleEdit(account)
                    }
                    className="flex-1 rounded-xl bg-slate-100 py-2.5 font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    ✏️ {t("edit")}
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(account.id)
                    }
                    className="flex-1 rounded-xl bg-red-50 py-2.5 font-semibold text-red-600 hover:bg-red-100"
                  >
                    🗑️ {t("delete")}
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

        {transfers.length > 0 && (
          <div className="mt-10">

            <h2 className="mb-4 text-xl font-bold text-foreground">
              🔁 Recent Transfers
            </h2>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">

              {transfers.slice(0, 10).map((transfer) => (
                <div
                  key={transfer.id}
                  className="flex items-center justify-between border-b border-border p-4 last:border-b-0"
                >

                  <div>
                    <p className="font-semibold text-foreground">
                      {transfer.from_account_name} → {transfer.to_account_name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        transfer.transfer_date
                      ).toLocaleDateString("en-IN")}
                      {transfer.notes ? ` · ${transfer.notes}` : ""}
                    </p>
                  </div>

                  <span className="font-bold text-slate-700">
                    ₹{Number(transfer.amount).toLocaleString("en-IN")}
                  </span>

                </div>
              ))}

            </div>

          </div>
        )}

      </div>
    </AppLayout>
  );
}

export default Accounts;