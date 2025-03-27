import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChainSymbol } from '@/library/types';
import { chainSymbolDecimals } from '@/library/contants';
import { Button, Input, Spinner } from '@/library/components';
import { GenericNullAddress, HEX_REGEX, ENS_REGEX } from '@/library/contants';
import { InputAmount, InputAmountValue, InputPrefix } from './components';

import styles from './Form.module.scss';

const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  amount: yup.string().required('Amount is required'),
  address: yup
    .string()
    .required('Address is required')
    .matches(new RegExp(`${HEX_REGEX.source}|${ENS_REGEX.source}`), 'Invalid Ethereum address or ENS name'),
});

interface FormData {
  amount: string | null;
  address: string | null;
}

export interface FormProps {
  symbolSelected: ChainSymbol;
  defaultFormData?: FormData;
  sendButtonState?: 'disabled' | 'sending' | 'fetching' | 'idle';
  onChange: (formData: FormData) => void;
  onSubmit: (formData: FormData) => void;
  onValidate: (isValid: boolean) => void;
  addressInfo: React.ReactNode;
  gasInfo: React.ReactNode;
}

type Comp = (props: FormProps) => React.ReactNode;

const Form: Comp = (props: FormProps) => {
  const {
    symbolSelected,
    sendButtonState = 'disabled',
    onChange,
    onSubmit,
    onValidate,
    addressInfo,
    gasInfo,
    defaultFormData,
  } = props;

  const decimalsLimit = chainSymbolDecimals[symbolSelected];

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

  useEffect(() => {
    onValidate(isValid);
  }, [isValid, onValidate]);

  const isSubmitDisabled =
    !isValid ||
    sendButtonState === 'disabled' ||
    sendButtonState === 'sending' ||
    sendButtonState === 'fetching' ||
    !isValid;
  const showSpinner = sendButtonState === 'sending';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['container']}>
      <div className={styles['form']}>
        <div className={styles['input-info-container']}>
          <div className={styles['input-label-container']}>
            <label htmlFor="amount">Amount</label>
            <div className={styles['input-amount-container']}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <InputAmount
                    value={formData.amount as InputAmountValue}
                    decimalsLimit={decimalsLimit}
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
          <div>{gasInfo}</div>
        </div>

        <div className={styles['input-info-container']}>
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
          <div>{addressInfo}</div>
        </div>
      </div>
      <Button
        type="submit"
        isDisabled={isSubmitDisabled}
        containerClass={styles['custom-button-container']}
        variant="secondary"
      >
        {showSpinner ? <Spinner /> : <span className={styles['custom-button-text']}>Send</span>}
      </Button>
    </form>
  );
};

export default Form;
