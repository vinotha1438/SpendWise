function PaymentSelect({value,onChange}) {
  return (
    <select
     className="w-full border rounded-lg p-2 mt-3"
     value={value}
     onChange={onChange}
    >
      <option value="">Select Payment Method</option>
      <option value="Cash">💵 Cash</option>
      <option value="UPI">📱 UPI</option>
      <option value="Debit Card">💳 Debit Card</option>
      <option value="Credit Card">💳 Credit Card</option>
      <option value="Bank Transfer">🏦 Bank Transfer</option>
    </select>
  );
}

export default PaymentSelect;