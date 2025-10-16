def predict_future_expenses(transactions):
    # Placeholder: simple average prediction
    avg = sum(t['amount'] for t in transactions) / len(transactions) if transactions else 0
    return {"predicted_next_month": avg * 1.1}  # example: 10% increase
