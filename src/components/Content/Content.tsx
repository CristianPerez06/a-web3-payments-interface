import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { parseEther, formatEther } from 'viem';
import { BaseError } from '@wagmi/core';
import { useEstimateGas, useSendTransaction } from 'wagmi';
import { Button, Input, Spinner, Well } from '@/library/components';
import { InputAmount, InputPrefix } from '@/components/Content/components';
import { InputAmountValue } from '@/components/Content/components/InputAmount';

import styles from './Content.module.scss';

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

  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    amount: null,
    address: '',
  });

  const {
    data: gasEstimate,
    error: gasEstimateError,
    isPending: gasEstimateIsPending,
  } = useEstimateGas({
    to: formData.address ? (formData.address as `0x${string}`) : null,
    value: parseEther(formData.amount?.toString() ?? '0'),
    query: {
      enabled: !!formData.amount && !!formData.address && symbolSelected === 'ETH',
    },
  });

  const { sendTransaction } = useSendTransaction();

  const onSubmit = async (formData: FormData, gasEstimate: bigint) => {
    setIsSending(true);
    sendTransaction(
      {
        gas: gasEstimate,
        to: formData.address as `0x${string}`,
        value: parseEther(formData.amount?.toString() ?? '0'),
      },
      {
        onSuccess: () => {
          setFormData({
            amount: null,
            address: '',
          });
          toast.success('Success: Transaction sent!');
          setIsSending(false);
        },
        onError: (sendTransactionError) => {
          console.log('error: ', sendTransactionError);
          const errorDetails = sendTransactionError as BaseError;
          toast.error('Error: ' + errorDetails.shortMessage);
          setIsSending(false);
        },
      },
    );
  };

  const isSubmitDisabled =
    !isValid || !gasEstimate || !!gasEstimateError || gasEstimateIsPending || isSending || symbolSelected !== 'ETH';

  useEffect(() => {
    if (gasEstimateError) {
      const errorDetails = gasEstimateError as BaseError;
      toast.error('Error: ' + errorDetails.shortMessage);
    }
  }, [gasEstimateError]);

  return (
    <div className={styles['container']}>
      <Well>
        <form onSubmit={handleSubmit((formData) => onSubmit(formData, gasEstimate!))} className={styles['content']}>
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
              <div className={styles['gas-estimate-container']}>
                {isValid && symbolSelected === 'ETH' && (
                  <>
                    {gasEstimateIsPending && <span className={styles['gas-estimate']}>{`Gas: Fetching...`}</span>}
                    {gasEstimateError && <span className={styles['gas-estimate']}>{`Gas: Error!`}</span>}
                    {gasEstimate && (
                      <span className={styles['gas-estimate']}>{`Gas: ${formatEther(gasEstimate)}`}</span>
                    )}
                  </>
                )}
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
                    value={formData.address ?? ''}
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
          <Button type="submit" isDisabled={isSubmitDisabled} containerClass={styles['custom-button-container']}>
            {!isSending && <span className={styles['custom-button-text']}>Send</span>}
            {isSending && (
              <div>
                <Spinner />
              </div>
            )}
          </Button>
        </form>
      </Well>
    </div>
  );
};

export default Content;
