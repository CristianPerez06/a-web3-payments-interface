import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Spinner } from '@/library/components';
import { GenericNullAddress } from '@/library/contants';
import { InputAmount, InputPrefix } from '@/components/Content/Form/components';
import { InputAmountValue } from '@/components/Content/Form/components/InputAmount';

import styles from './Form.module.scss';

interface FormData {
  amount: string | null;
  address: string | null;
}

const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  amount: yup.string().required('Amount is required'),
  address: yup
    .string()
    .required('Address is required')
    .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format'),
});

export interface FormProps {
  symbolSelected: string;
  defaultFormData?: FormData;
  sendButtonState?: 'disabled' | 'loading' | 'idle';
  onChange: (formData: FormData) => void;
  onSubmit: (formData: FormData) => void;
  gasEstimate: React.ReactNode;
}

type Comp = (props: FormProps) => React.ReactNode;

const Form: Comp = (props: FormProps) => {
  const { symbolSelected, sendButtonState = 'disabled', onChange, onSubmit, gasEstimate, defaultFormData } = props;

  const [formData, setFormData] = useState<FormData>({
    amount: null,
    address: '',
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: defaultFormData,
  });

  useEffect(() => {
    if (defaultFormData) {
      setFormData(defaultFormData);
    }
  }, [defaultFormData]);

  const isSubmitDisabled = !isValid || sendButtonState === 'disabled' || sendButtonState === 'loading';

  return (
    <form onSubmit={handleSubmit((formData) => onSubmit(formData))} className={styles['container']}>
      <div className={styles['form']}>
        <div className={styles['amount-gas-container']}>
          <div className={styles['input-label-container']}>
            <label htmlFor="amount">Amount</label>
            <div className={styles['input-amount-container']}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <InputAmount
                    value={formData.amount as InputAmountValue}
                    onChange={(value) => {
                      field.onChange(value);

                      const prevFormData = { ...formData };
                      const newFormData = { ...prevFormData, amount: value };

                      setFormData(newFormData);
                      onChange(newFormData);
                    }}
                  />
                )}
              />
              {symbolSelected && <InputPrefix symbol={symbolSelected} />}
            </div>
          </div>
          <div className={styles['gas-estimate-container']}>{gasEstimate}</div>
        </div>

        <div className={styles['input-label-container']}>
          <label htmlFor="address">To</label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input
                name="address"
                placeholder={GenericNullAddress}
                value={formData.address ?? ''}
                onChange={(e) => {
                  field.onChange(e);

                  const prevFormData = { ...formData };
                  const newFormData = { ...prevFormData, address: e.target.value };

                  setFormData(newFormData);
                  onChange(newFormData);
                }}
                inputClass={styles['custom-address-input']}
              />
            )}
          />
        </div>
      </div>
      <Button
        type="submit"
        isDisabled={isSubmitDisabled}
        containerClass={styles['custom-button-container']}
        variant="primary"
      >
        {(sendButtonState === 'idle' || sendButtonState === 'disabled') && (
          <span className={styles['custom-button-text']}>Send</span>
        )}
        {sendButtonState === 'loading' && (
          <div>
            <Spinner />
          </div>
        )}
      </Button>
    </form>
  );
};

export default Form;
