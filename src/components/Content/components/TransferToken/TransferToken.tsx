import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { formatEther } from 'viem';
import { BaseError } from '@wagmi/core';
import { useEstimateGas, useSendTransaction, useSimulateContract } from 'wagmi';
import { ChainSymbol } from '@/library/types';
import { Well } from '@/library/components';
import { useEstimateGasConfig, useSimulateContractConfig } from '@/library/hooks';
import { Form } from '@/components/Content/components';

import styles from './TransferToken.module.scss';

interface FormData {
  amount: string | null;
  address: string | null;
}

interface TransferTokenProps {
  currentSymbol: ChainSymbol;
}

type Comp = (props: TransferTokenProps) => React.ReactNode;

const TransferToken: Comp = (props) => {
  const { currentSymbol } = props;

  const { getConfig: getEstimateGasConfig } = useEstimateGasConfig();
  const { getConfig: getSimulateContractConfig } = useSimulateContractConfig();

  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    amount: null,
    address: '',
  });

  const estimateGasConfig = getEstimateGasConfig(
    currentSymbol,
    formData.address ?? undefined,
    formData.amount ?? undefined,
  );
  const simulateContractConfig = getSimulateContractConfig(
    currentSymbol,
    formData.address ?? undefined,
    formData.amount ?? undefined,
  );

  const {
    data: gasEstimate,
    isFetching: gasEstimateIsFetching,
    error: gasEstimateError,
  } = useEstimateGas(estimateGasConfig);

  // Simulate contract
  const {
    data: simulateContractData,
    isFetching: simulateContractIsFetching,
    error: simulateContractError,
  } = useSimulateContract(simulateContractConfig);

  const { sendTransaction } = useSendTransaction();

  const onSubmit = async () => {
    setIsSending(true);

    sendTransaction(
      {
        account: estimateGasConfig.account,
        to: estimateGasConfig.to,
        gas: gasEstimate,
        data: estimateGasConfig.data,
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

  const getButtonState = () => {
    if (isSending) {
      return 'sending';
    }

    if (gasEstimateIsFetching || simulateContractIsFetching) {
      return 'fetching';
    }

    const gasEstimateNotReady = !gasEstimate || !!gasEstimateError;
    const simulateContractNotReady = !simulateContractData || !!simulateContractError;

    if (gasEstimateNotReady || simulateContractNotReady) {
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
          onChange={(data) => setFormData(data)}
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

export default TransferToken;
