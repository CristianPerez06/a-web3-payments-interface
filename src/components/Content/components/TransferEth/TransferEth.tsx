import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { parseEther, formatEther, Address } from 'viem';
import { BaseError } from '@wagmi/core';
import { useEstimateGas, useSendTransaction } from 'wagmi';
import { ChainSymbol } from '@/library/types';
import { Well } from '@/library/components';
import { Form } from '@/components/Content/components';

import styles from './TransferEth.module.scss';

interface FormData {
  amount: string | null;
  address: string | null;
}

interface TransferEthProps {
  currentSymbol: ChainSymbol;
}

type Comp = (props: TransferEthProps) => React.ReactNode;

const TransferEth: Comp = (props) => {
  const { currentSymbol } = props;

  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    amount: null,
    address: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const {
    data: gasEstimate,
    isFetching: gasEstimateIsFetching,
    error: gasEstimateError,
  } = useEstimateGas({
    to: formData.address ? (formData.address as Address) : null,
    value: parseEther(formData.amount?.toString() ?? '0'),
    query: {
      enabled: !!formData.amount && !!formData.address && isFormValid,
    },
  });

  const { sendTransaction } = useSendTransaction();

  const onSubmit = async () => {
    setIsSending(true);
    sendTransaction(
      {
        gas: gasEstimate,
        to: formData.address as Address,
        value: parseEther(formData.amount?.toString() ?? '0'),
      },
      {
        onSuccess: () => {
          setFormData({
            amount: null,
            address: '',
          });
          setIsFormValid(false);
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

  const getButtonState = () => {
    if (isSending) {
      return 'sending';
    }

    if (gasEstimateIsFetching) {
      return 'fetching';
    }

    const gasEstimateNotReady = !gasEstimate || !!gasEstimateError;

    if (gasEstimateNotReady) {
      return 'disabled';
    }

    return 'idle';
  };

  // Handle gas estimate error
  useEffect(() => {
    if (gasEstimateError) {
      const errorDetails = gasEstimateError as BaseError;
      toast.error('Error: ' + errorDetails.shortMessage);
    }
  }, [gasEstimateError]);

  return (
    <div className={styles['container']}>
      <Well>
        <Form
          symbolSelected={currentSymbol}
          sendButtonState={getButtonState()}
          defaultFormData={formData}
          onChange={(data) => {
            setFormData(data);
          }}
          onValidate={(isValid) => {
            setIsFormValid(isValid);
          }}
          onSubmit={onSubmit}
          gasEstimate={
            <>
              {gasEstimateIsFetching && <span className={styles['gas-estimate']}>{`Gas: Fetching...`}</span>}
              {gasEstimateError && <span className={styles['gas-estimate']}>{`Gas: Error!`}</span>}
              {!gasEstimateIsFetching && gasEstimate && (
                <span className={styles['gas-estimate']}>{`Gas: ${formatEther(gasEstimate)}`}</span>
              )}
            </>
          }
        />
      </Well>
    </div>
  );
};

export default TransferEth;
