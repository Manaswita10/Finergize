// app/lib/handlers/loanSubmissionHandler.ts

import { VALUE_RANGES, loanService } from '@/app/api/services/loan-service';

interface LoanApplicationData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  loanInfo: {
    amount: number;
    term: number;
    interestRate: number;
    monthlyPayment: number;
    processingFee: number;
    totalAmount: number;
    loanType: string;
  };
}

interface FormData {
  annual_income: string;
  debt_to_income: string;
  credit_score: string;
  person_age: string;
  Education: string;
  credit_risk: string;
  emp_length: string;
  Mortgage: string;
  person_home_ownership: string;
  credit_card_usage: string;
  CreditCard: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface SubmissionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class LoanSubmissionHandler {
  private validateCommonFields(formData: FormData): ValidationResult {
    try {
      // Check for empty required fields
      const requiredFields = ['annual_income', 'debt_to_income', 'credit_score', 'person_age'];
      for (const field of requiredFields) {
        if (!formData[field as keyof FormData]) {
          return {
            isValid: false,
            error: `${field.replace(/_/g, ' ')} is required`
          };
        }
      }

      // Validate ranges for common fields
      const validations = [
        {
          value: parseFloat(formData.annual_income),
          min: VALUE_RANGES.annual_income.min,
          max: VALUE_RANGES.annual_income.max,
          field: 'Annual income'
        },
        {
          value: parseFloat(formData.debt_to_income),
          min: VALUE_RANGES.debt_to_income.min,
          max: VALUE_RANGES.debt_to_income.max,
          field: 'Debt to income ratio'
        },
        {
          value: parseFloat(formData.credit_score),
          min: VALUE_RANGES.credit_score.min,
          max: VALUE_RANGES.credit_score.max,
          field: 'Credit score'
        },
        {
          value: parseFloat(formData.person_age),
          min: VALUE_RANGES.person_age.min,
          max: VALUE_RANGES.person_age.max,
          field: 'Age'
        }
      ];

      for (const validation of validations) {
        const { value, min, max, field } = validation;
        if (isNaN(value) || value < min || value > max) {
          return {
            isValid: false,
            error: `${field} must be between ${min} and ${max}`
          };
        }
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid input values'
      };
    }
  }

  private validateStudentLoanFields(formData: FormData): ValidationResult {
    if (!formData.Education) {
      return {
        isValid: false,
        error: 'Education level is required'
      };
    }
    if (!formData.credit_risk) {
      return {
        isValid: false,
        error: 'Credit risk rating is required'
      };
    }

    try {
      const educationLevel = parseInt(formData.Education);
      const creditRisk = parseInt(formData.credit_risk);

      if (educationLevel < VALUE_RANGES.education_level.min || 
          educationLevel > VALUE_RANGES.education_level.max) {
        return {
          isValid: false,
          error: 'Invalid education level'
        };
      }

      if (creditRisk < VALUE_RANGES.credit_risk.min || 
          creditRisk > VALUE_RANGES.credit_risk.max) {
        return {
          isValid: false,
          error: 'Invalid credit risk rating'
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid student loan fields'
      };
    }
  }

  private validateAgriculturalLoanFields(formData: FormData): ValidationResult {
    if (!formData.Mortgage) {
      return {
        isValid: false,
        error: 'Mortgage amount is required'
      };
    }
    if (!formData.person_home_ownership) {
      return {
        isValid: false,
        error: 'Home ownership status is required'
      };
    }
    if (!formData.emp_length) {
      return {
        isValid: false,
        error: 'Agricultural experience is required'
      };
    }

    try {
      const empLength = parseFloat(formData.emp_length);
      if (empLength < VALUE_RANGES.emp_length.min || 
          empLength > VALUE_RANGES.emp_length.max) {
        return {
          isValid: false,
          error: `Experience must be between ${VALUE_RANGES.emp_length.min} and ${VALUE_RANGES.emp_length.max} years`
        };
      }

      const homeOwnership = parseInt(formData.person_home_ownership);
      if (homeOwnership !== 0 && homeOwnership !== 1) {
        return {
          isValid: false,
          error: 'Invalid home ownership status'
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid agricultural loan fields'
      };
    }
  }
  private validateBusinessLoanFields(formData: FormData): ValidationResult {
    if (!formData.emp_length) {
      return {
        isValid: false,
        error: 'Business experience is required'
      };
    }
    if (!formData.credit_card_usage) {
      return {
        isValid: false,
        error: 'Credit card usage is required'
      };
    }
    if (!formData.CreditCard) {
      return {
        isValid: false,
        error: 'Credit card status is required'
      };
    }

    try {
      const empLength = parseFloat(formData.emp_length);
      if (empLength < VALUE_RANGES.emp_length.min || 
          empLength > VALUE_RANGES.emp_length.max) {
        return {
          isValid: false,
          error: `Experience must be between ${VALUE_RANGES.emp_length.min} and ${VALUE_RANGES.emp_length.max} years`
        };
      }

      const creditCardUsage = parseFloat(formData.credit_card_usage);
      if (creditCardUsage < VALUE_RANGES.credit_card_usage.min || 
          creditCardUsage > VALUE_RANGES.credit_card_usage.max) {
        return {
          isValid: false,
          error: 'Invalid credit card usage percentage'
        };
      }

      const creditCard = parseInt(formData.CreditCard);
      if (creditCard !== 0 && creditCard !== 1) {
        return {
          isValid: false,
          error: 'Invalid credit card status'
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid business loan fields'
      };
    }
  }

  private preparePredictionRequest(formData: FormData, loanData: LoanApplicationData) {
    const baseRequest = {
      loan_type: loanData.loanInfo.loanType.toLowerCase(),
      loan_amount: this.standardizeValue(
        loanData.loanInfo.amount,
        VALUE_RANGES.loan_amount.min,
        VALUE_RANGES.loan_amount.max
      ),
      term: this.standardizeValue(
        loanData.loanInfo.term,
        VALUE_RANGES.term.min,
        VALUE_RANGES.term.max
      ),
      int_rate: this.standardizeValue(
        loanData.loanInfo.interestRate,
        VALUE_RANGES.int_rate.min,
        VALUE_RANGES.int_rate.max
      ),
      annual_income: this.standardizeValue(
        parseFloat(formData.annual_income),
        VALUE_RANGES.annual_income.min,
        VALUE_RANGES.annual_income.max
      ),
      debt_to_income: this.standardizeValue(
        parseFloat(formData.debt_to_income),
        VALUE_RANGES.debt_to_income.min,
        VALUE_RANGES.debt_to_income.max
      ),
      credit_score: this.standardizeValue(
        parseFloat(formData.credit_score),
        VALUE_RANGES.credit_score.min,
        VALUE_RANGES.credit_score.max
      ),
      person_age: this.standardizeValue(
        parseFloat(formData.person_age),
        VALUE_RANGES.person_age.min,
        VALUE_RANGES.person_age.max
      ),
      income_to_loan: parseFloat(formData.annual_income) / loanData.loanInfo.amount
    };

    switch (loanData.loanInfo.loanType.toLowerCase()) {
      case 'student':
        return {
          ...baseRequest,
          Education: formData.Education ? this.standardizeValue(
            parseFloat(formData.Education),
            VALUE_RANGES.education_level.min,
            VALUE_RANGES.education_level.max
          ) : null,
          credit_risk: formData.credit_risk ? this.standardizeValue(
            parseFloat(formData.credit_risk),
            VALUE_RANGES.credit_risk.min,
            VALUE_RANGES.credit_risk.max
          ) : null,
          Mortgage: null,
          person_home_ownership: null,
          emp_length: null,
          credit_card_usage: null,
          CreditCard: null
        };

      case 'agricultural':
        return {
          ...baseRequest,
          Education: null,
          credit_risk: null,
          Mortgage: formData.Mortgage ? parseFloat(formData.Mortgage) : null,
          person_home_ownership: formData.person_home_ownership ? 
            parseFloat(formData.person_home_ownership) : null,
          emp_length: formData.emp_length ? this.standardizeValue(
            parseFloat(formData.emp_length),
            VALUE_RANGES.emp_length.min,
            VALUE_RANGES.emp_length.max
          ) : null,
          credit_card_usage: null,
          CreditCard: null
        };

      case 'business':
        return {
          ...baseRequest,
          Education: null,
          credit_risk: null,
          Mortgage: null,
          person_home_ownership: null,
          emp_length: formData.emp_length ? this.standardizeValue(
            parseFloat(formData.emp_length),
            VALUE_RANGES.emp_length.min,
            VALUE_RANGES.emp_length.max
          ) : null,
          credit_card_usage: formData.credit_card_usage ? this.standardizeValue(
            parseFloat(formData.credit_card_usage),
            VALUE_RANGES.credit_card_usage.min,
            VALUE_RANGES.credit_card_usage.max
          ) : null,
          CreditCard: formData.CreditCard ? parseFloat(formData.CreditCard) : null
        };

      default:
        throw new Error(`Invalid loan type: ${loanData.loanInfo.loanType}`);
    }
  }

  private standardizeValue(value: number, min: number, max: number): number {
    if (value < min || value > max) {
      throw new Error(`Value ${value} must be between ${min} and ${max}`);
    }
    return (value - min) / (max - min);
  }

  public async handleSubmission(
    formData: FormData,
    loanData: LoanApplicationData
  ): Promise<SubmissionResult> {
    try {
      // Validate common fields first
      const commonValidation = this.validateCommonFields(formData);
      if (!commonValidation.isValid) {
        return {
          success: false,
          error: commonValidation.error
        };
      }

      // Validate loan-specific fields
      let specificValidation: ValidationResult;
      switch (loanData.loanInfo.loanType.toLowerCase()) {
        case 'student':
          specificValidation = this.validateStudentLoanFields(formData);
          break;
        case 'agricultural':
          specificValidation = this.validateAgriculturalLoanFields(formData);
          break;
        case 'business':
          specificValidation = this.validateBusinessLoanFields(formData);
          break;
        default:
          return {
            success: false,
            error: `Invalid loan type: ${loanData.loanInfo.loanType}`
          };
      }

      if (!specificValidation.isValid) {
        return {
          success: false,
          error: specificValidation.error
        };
      }

      // Prepare and send the prediction request
      const predictionRequest = this.preparePredictionRequest(formData, loanData);
      const result = await loanService.predictLoanApproval(predictionRequest);

      return {
        success: true,
        data: result
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error occurred during submission'
      };
    }
  }
}

export const loanSubmissionHandler = new LoanSubmissionHandler();