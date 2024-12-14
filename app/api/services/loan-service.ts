// app/services/loan.service.ts

interface LoanPredictionResponse {
  approved: boolean;
  confidence: number;
  feedback: string[];
}

export const loanService = {
  predictLoan: async (data: any): Promise<LoanPredictionResponse> => {
    try {
      const response = await fetch('https://loan-approval-api.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loan_type: data.loanType,
          loan_amount: data.loan_amount,
          term: data.term,
          int_rate: data.int_rate,
          annual_income: data.annual_income,
          debt_to_income: data.debt_to_income,
          credit_score: data.credit_score,
          person_age: data.person_age,
          income_to_loan: data.income_to_loan,
          ...(data.loanType === 'student' && {
            Education: data.Education,
            credit_risk: data.credit_risk
          }),
          ...(data.loanType === 'agricultural' && {
            Mortgage: data.Mortgage,
            person_home_ownership: data.person_home_ownership,
            emp_length: data.emp_length
          }),
          ...(data.loanType === 'business' && {
            emp_length: data.emp_length,
            credit_card_usage: data.credit_card_usage,
            CreditCard: data.CreditCard
          })
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Prediction error:', error);
      throw new Error('Failed to process loan application');
    }
  }
};