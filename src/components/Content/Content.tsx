import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { parseEther, formatEther, parseUnits, Address } from 'viem';
import { erc20Abi } from 'viem';
import { BaseError } from '@wagmi/core';
import { useEstimateGas, useSendTransaction, useSimulateContract } from 'wagmi';
import { GenericNullAddress } from '@/library/contants';
import { Well } from '@/library/components';
import Form from '@/components/Content/Form';

import styles from './Content.module.scss';

interface FormData {
  amount: string | null;
  address: string | null;
}

interface ContentProps {
  symbolSelected: string;
}

type Comp = (props: ContentProps) => React.ReactNode;

const Content: Comp = (props) => {
  const { symbolSelected } = props;

  const [currentSymbol, setCurrentSymbol] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    amount: null,
    address: '',
  });

  const {
    data: gasEstimate,
    isPending: gasEstimateIsPending,
    error: gasEstimateError,
  } = useEstimateGas({
    to: formData.address ? (formData.address as `0x${string}`) : null,
    value: parseEther(formData.amount?.toString() ?? '0'),
    query: {
      enabled: !!formData.amount && !!formData.address && symbolSelected === 'ETH',
    },
  });

  const {
    data: simulateContractData,
    isPending: simulateContractIsPending,
    error: simulateContractError,
  } = useSimulateContract({
    address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    abi: erc20Abi,
    functionName: 'transfer',
    args: [(formData.address as Address) || GenericNullAddress, parseUnits(formData.amount?.toString() ?? '0', 6)],
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

  const getCurrentState = () => {
    if (isSending) {
      return 'loading';
    }

    const gasEstimateNotReady = !gasEstimate || !!gasEstimateError || gasEstimateIsPending;
    const simulateContractNotReady = !simulateContractData || !!simulateContractError || simulateContractIsPending;
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

  // Handle symbol change
  useEffect(() => {
    setCurrentSymbol(symbolSelected);
    setFormData({
      amount: null,
      address: '',
    });
  }, [symbolSelected]);

  return (
    <div className={styles['container']}>
      <Well>
        <Form
          symbolSelected={currentSymbol}
          sendButtonState={getCurrentState()}
          defaultFormData={formData}
          onChange={(data) => setFormData(data)}
          onSubmit={(data) => onSubmit(data, gasEstimate!)}
          gasEstimate={
            getCurrentState() === 'idle' && (
              <>
                {gasEstimateIsPending && <span className={styles['gas-estimate']}>{`Gas: Fetching...`}</span>}
                {gasEstimateError && <span className={styles['gas-estimate']}>{`Gas: Error!`}</span>}
                {gasEstimate && <span className={styles['gas-estimate']}>{`Gas: ${formatEther(gasEstimate)}`}</span>}
              </>
            )
          }
        />
      </Well>
    </div>
  );
};

export default Content;
