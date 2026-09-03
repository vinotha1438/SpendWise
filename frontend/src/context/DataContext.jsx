import { createContext, useContext, useEffect, useState, useMemo } from "react";
import API from "../services/api";
import { socket } from "../socket";

const DataContext = createContext();

export function DataProvider({ children }) {
    const [expenses, setExpenses] = useState([]);
    const [income, setIncome] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchExpenses = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await API.get("/expenses", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setExpenses(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.log(error);
        }
    };

    const fetchIncome = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await API.get("/income", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setIncome(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Accounts are the source of truth for balance. Each account's
    // current_balance already correctly includes its opening_balance
    // plus every income/expense applied to it (the backend maintains
    // this incrementally on every add/edit/delete). Everything that
    // needs "what's my balance" should read it from here instead of
    // recalculating income-minus-expense on its own.
    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await API.get("/accounts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAccounts(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch Budgets
    const fetchBudgets = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await API.get("/api/budgets", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setBudgets(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch Transfers
    const fetchTransfers = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await API.get("/transfers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTransfers(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Makes sure the shared socket is connected and has joined this
    // user's private room. Safe to call repeatedly — connect()/emit()
    // are no-ops (or harmlessly re-join the same room) if already
    // connected, so every refreshData() call can just call this
    // instead of the app needing a separate "log in" hook for it.
    const ensureSocketJoined = () => {
        const token = localStorage.getItem("token");

        if (!token) return;

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("join", token);
    };

    const refreshData = async () => {
        ensureSocketJoined();

        setLoading(true);

        await Promise.all([
            fetchExpenses(),
            fetchIncome(),
            fetchAccounts(),
            fetchBudgets(),
            fetchTransfers(),
        ]);

        setLoading(false);
    };

    useEffect(() => {
        // Don't call protected endpoints before a token exists.
        // Previously this fired on every app load (including the
        // very first render on /login, before any login happened),
        // which is what caused the /expenses and /income 401s.
        const token = localStorage.getItem("token");

        if (token) {
            refreshData();
        } else {
            setLoading(false);
        }
    }, []);

    // Real-time sync: the backend emits "data-changed" to every
    // device joined to this user's room whenever an expense, income,
    // account, or goal changes anywhere — including from a different
    // browser/phone. We just quietly refetch when that happens, so
    // every open device stays in sync without the person needing to
    // manually refresh.
    useEffect(() => {
        const handleDataChanged = () => {
            refreshData();
        };

        socket.on("data-changed", handleDataChanged);

        return () => {
            socket.off("data-changed", handleDataChanged);
        };
    }, []);

    // TOTAL BALANCE — derived from accounts, NOT from
    // totalIncome - totalExpense. That formula silently ignores
    // opening_balance and will disagree with the Accounts page
    // the moment any account starts with a non-zero balance.
    // This is now the one place total balance is calculated;
    // every page/component should read it from here.
    const totalBalance = useMemo(() => {
        return accounts.reduce(
            (sum, account) => sum + Number(account.current_balance || 0),
            0
        );
    }, [accounts]);

    // Kept as an alias so existing components that destructure
    // `balance` (e.g. AppLayout -> Sidebar) keep working without
    // changes, while pointing at the corrected calculation.
    const balance = totalBalance;

    return (
        <DataContext.Provider
            value={{
                expenses,
                income,
                accounts,
                budgets,
                transfers,
                balance,
                totalBalance,
                loading,
                refreshData,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}