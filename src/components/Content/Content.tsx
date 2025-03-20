import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Well } from '@/library/components';
import { InputAmount, InputPrefix } from '@/components/Content/components';

import styles from './Content.module.scss';

interface FormData {
  amount: number | null;
  address: string;
}

const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  amount: yup.number().nullable().required('Amount is required'),
  address: yup
    .string()
    .required('Address is required')
    .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format'),
});

interface ContentProps {
  symbolSelected: string;
}

type Comp = (props: ContentProps) => React.ReactNode;

const Content: Comp = (props) => {
  const { symbolSelected } = props;

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const [formData, setFormData] = useState<FormData>({
    amount: null,
    address: '',
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
  };

  return (
    <div className={styles['container']}>
      <Well>
        <form onSubmit={handleSubmit(onSubmit)} className={styles['content']}>
          <div className={styles['form']}>
            <div className={styles['input-label-container']}>
              <label htmlFor="amount">Amount</label>
              <div className={styles['input-amount-container']}>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <InputAmount
                      onChange={(value) => {
                        field.onChange(value);
                        setFormData((prev) => ({
                          ...prev,
                          amount: value,
                        }));
                      }}
                    />
                  )}
                />
                {symbolSelected && <InputPrefix symbol={symbolSelected} />}
              </div>
            </div>
            <div className={styles['input-label-container']}>
              <label htmlFor="address">To</label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    name="address"
                    placeholder="0x0000000000000000000000000000000000000000"
                    value={formData.address}
                    onChange={(e) => {
                      field.onChange(e);
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }));
                    }}
                    inputClass={styles['custom-address-input']}
                  />
                )}
              />
            </div>
          </div>
          <Button type="submit" isDisabled={!isValid} containerClass={styles['custom-button-container']}>
            <span className={styles['custom-button-text']}>Send</span>
          </Button>
        </form>
      </Well>
    </div>
  );
};

export default Content;
