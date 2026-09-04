const pool = require("../config/db");

const {
  addExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseControllers");

function makeRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

// Builds a fake transaction-capable connection and wires
// pool.getConnection to hand it out — matching the real
// mysql2 pool API used by withTransaction.js.
function setupFakeConnection(responses) {
  let call = 0;

  const connection = {
    query: jest.fn((sql, params, callback) => {
      const response = responses[call];
      call += 1;

      if (!response) {
        throw new Error(
          `connection.query called more times than expected (call #${call})`
        );
      }

      callback(response.err || null, response.result);
    }),
    beginTransaction: jest.fn((cb) => cb(null)),
    commit: jest.fn((cb) => cb(null)),
    rollback: jest.fn((cb) => cb(null)),
    release: jest.fn(),
  };

  pool.getConnection.mockImplementation((cb) => cb(null, connection));

  return connection;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("addExpense — deducts the correct amount from the account", () => {
  test("₹500 expense deducts exactly ₹500 from the chosen account", (done) => {
    const connection = setupFakeConnection([
      { result: [{ id: 7 }] }, // account ownership check
      { result: { insertId: 101 } }, // INSERT INTO expenses
      { result: {} }, // UPDATE accounts (balance deduction) — asserted below
      { result: {} }, // INSERT INTO notifications
    ]);

    const req = {
      body: {
        title: "Groceries",
        amount: 500,
        category: "Food",
        payment_method: "Cash",
        account_id: 7,
        expense_date: "2026-08-15",
        notes: "",
        where_to_pay: "BigBasket",
      },
      user: { id: 1 },
    };

    const res = makeRes();

    res.json.mockImplementation((body) => {
      const balanceCall = connection.query.mock.calls[2];
      const [sql, params] = balanceCall;

      expect(sql).toMatch(
        /current_balance\s*=\s*\n?\s*current_balance\s*-\s*\?/
      );
      expect(params).toEqual([500, 7, 1]);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(body.message).toBe("Expense Added Successfully");

      expect(connection.commit).toHaveBeenCalled();
      expect(connection.rollback).not.toHaveBeenCalled();
      expect(connection.release).toHaveBeenCalled();

      done();
    });

    addExpense(req, res);
  });
});

describe("updateExpense — same account, amount changes", () => {
  test("increasing ₹1000 -> ₹1500 deducts an additional ₹500", (done) => {
    const connection = setupFakeConnection([
      { result: [{ amount: 1000, account_id: 7 }] },
      { result: [{ id: 7 }] },
      { result: { affectedRows: 1 } },
      { result: {} },
    ]);

    const req = {
      params: { id: "55" },
      body: {
        title: "Groceries",
        amount: 1500,
        category: "Food",
        payment_method: "Cash",
        account_id: 7,
        expense_date: "2026-08-15",
        notes: "",
      },
      user: { id: 1 },
    };

    const res = makeRes();

    res.json.mockImplementation((body) => {
      const balanceCall = connection.query.mock.calls[3];
      const [sql, params] = balanceCall;

      expect(sql).toMatch(
        /current_balance\s*=\s*\n?\s*current_balance\s*-\s*\?/
      );
      expect(params).toEqual([500, 7, 1]);

      expect(body.message).toBe("Expense Updated Successfully");
      expect(connection.commit).toHaveBeenCalled();

      done();
    });

    updateExpense(req, res);
  });

  test("decreasing ₹1000 -> ₹700 restores ₹300 back to the account", (done) => {
    const connection = setupFakeConnection([
      { result: [{ amount: 1000, account_id: 7 }] },
      { result: [{ id: 7 }] },
      { result: { affectedRows: 1 } },
      { result: {} },
    ]);

    const req = {
      params: { id: "55" },
      body: {
        title: "Groceries",
        amount: 700,
        category: "Food",
        payment_method: "Cash",
        account_id: 7,
        expense_date: "2026-08-15",
        notes: "",
      },
      user: { id: 1 },
    };

    const res = makeRes();

    res.json.mockImplementation(() => {
      const balanceCall = connection.query.mock.calls[3];
      const [, params] = balanceCall;

      // difference = 700 - 1000 = -300 → balance goes UP by 300
      expect(params).toEqual([-300, 7, 1]);

      done();
    });

    updateExpense(req, res);
  });
});

describe("updateExpense — account changed", () => {
  test("moving a ₹1000 expense from Account A to Account B restores A and deducts B", (done) => {
    const connection = setupFakeConnection([
      { result: [{ amount: 1000, account_id: 7 }] }, // old: account A (7)
      { result: [{ id: 9 }] }, // new account B (9) ownership check
      { result: { affectedRows: 1 } },
      { result: {} }, // restore A — asserted below
      { result: {} }, // deduct B — asserted below
    ]);

    const req = {
      params: { id: "55" },
      body: {
        title: "Groceries",
        amount: 1000,
        category: "Food",
        payment_method: "Cash",
        account_id: 9,
        expense_date: "2026-08-15",
        notes: "",
      },
      user: { id: 1 },
    };

    const res = makeRes();

    res.json.mockImplementation(() => {
      const restoreCall = connection.query.mock.calls[3];
      const deductCall = connection.query.mock.calls[4];

      expect(restoreCall[0]).toMatch(
        /current_balance\s*=\s*\n?\s*current_balance\s*\+\s*\?/
      );
      expect(restoreCall[1]).toEqual([1000, 7, 1]);

      expect(deductCall[0]).toMatch(
        /current_balance\s*=\s*\n?\s*current_balance\s*-\s*\?/
      );
      expect(deductCall[1]).toEqual([1000, 9, 1]);

      done();
    });

    updateExpense(req, res);
  });
});

describe("deleteExpense — restores the amount to the account", () => {
  test("deleting a ₹2000 expense adds ₹2000 back to its account", (done) => {
    const connection = setupFakeConnection([
      { result: [{ amount: 2000, account_id: 7 }] },
      { result: { affectedRows: 1 } },
      { result: {} },
    ]);

    const req = {
      params: { id: "55" },
      user: { id: 1 },
    };

    const res = makeRes();

    res.json.mockImplementation((body) => {
      const restoreCall = connection.query.mock.calls[2];
      const [sql, params] = restoreCall;

      expect(sql).toMatch(
        /current_balance\s*=\s*\n?\s*current_balance\s*\+\s*\?/
      );
      expect(params).toEqual([2000, 7, 1]);

      expect(body.message).toBe("Expense Deleted Successfully");

      done();
    });

    deleteExpense(req, res);
  });
});

describe("addExpense — rejects invalid input before touching the database", () => {
  test("rejects a negative amount", () => {
    const req = {
      body: {
        title: "Groceries",
        amount: -500,
        category: "Food",
        payment_method: "Cash",
        account_id: 7,
        expense_date: "2026-08-15",
      },
      user: { id: 1 },
    };

    const res = makeRes();

    addExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(pool.getConnection).not.toHaveBeenCalled();
  });

  test("rejects a whitespace-only title", () => {
    const req = {
      body: {
        title: "   ",
        amount: 500,
        category: "Food",
        payment_method: "Cash",
        account_id: 7,
        expense_date: "2026-08-15",
      },
      user: { id: 1 },
    };

    const res = makeRes();

    addExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(pool.getConnection).not.toHaveBeenCalled();
  });
});

describe("addExpense — rolls back if the balance update fails mid-transaction", () => {
  test("a DB failure on the balance step rolls back and never commits", (done) => {
    const connection = setupFakeConnection([
      { result: [{ id: 7 }] }, // account check OK
      { result: { insertId: 101 } }, // insert OK
      { err: new Error("simulated DB failure") }, // balance update FAILS
    ]);

    const req = {
      body: {
        title: "Groceries",
        amount: 500,
        category: "Food",
        payment_method: "Cash",
        account_id: 7,
        expense_date: "2026-08-15",
        notes: "",
      },
      user: { id: 1 },
    };

    const res = makeRes();

    res.json.mockImplementation(() => {
      expect(connection.rollback).toHaveBeenCalled();
      expect(connection.commit).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);

      done();
    });

    addExpense(req, res);
  });
});