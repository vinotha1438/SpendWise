import { createContext, useContext, useEffect, useState, useMemo } from "react";
import API from "../services/api";

const DataContext = createContext();

export function DataProvider({ children }) {
    const [expenses, setExpenses] = useState([]);
    const [income, setIncome] = useState([]);
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

    const refreshData = async () => {
        setLoading(true);

        await Promise.all([
            fetchExpenses(),
            fetchIncome(),
        ]);

        setLoading(false);
    };

    useEffect(() => {
        refreshData();
    }, []);

    const balance = useMemo(() => {
        const totalIncome = income.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

        const totalExpense = expenses.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

        return totalIncome - totalExpense;
    }, [income, expenses]);

    return (
        <DataContext.Provider
            value={{
                expenses,
                income,
                balance,
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