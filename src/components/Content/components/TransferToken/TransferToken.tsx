import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import { formatEther } from 'viem';
import { BaseError } from '@wagmi/core';
import { useEstimateGas, UseEstimateGasParameters, useSendTransaction, useSimulateContract } from 'wagmi';
import { ChainSymbol } from '@/library/types';
import { Well } from '@/library/components';
import {
  useEstimateGasConfig,
  useGetAddressFromEns,
  useSimulateContractConfig,
  useTextUtilities,
} from '@/library/hooks';
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

  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    amount: null,
    address: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const { shortenAddress, isEns } = useTextUtilities();
  const debouncedAddress = useMemo(() => debounce((value: string | null) => value, 100), [])(formData.address);
  // Use ENS if it's valid, otherwise use the address
  const addressToUse = isEns(formData.address ?? '') ? debouncedAddress : formData.address;
  const { data: currentAddress } = useGetAddressFromEns(addressToUse || null);
  const { getConfig: getEstimateGasConfig } = useEstimateGasConfig();
  const { getConfig: getSimulateContractConfig } = useSimulateContractConfig();

  let estimateGasConfig: UseEstimateGasParameters = {
    query: {
      enabled: false,
    },
  };
  if (isFormValid) {
    estimateGasConfig = getEstimateGasConfig(currentSymbol, currentAddress ?? undefined, formData.amount ?? undefined);
  }

  const simulateContractConfig = getSimulateContractConfig(
    currentSymbol,
    currentAddress ?? undefined,
    formData.amount ?? undefined,
  );

  // Estimate gas
  const {
    data: gasEstimate,
    isFetching: gasEstimateIsFetching,
    error: gasEstimateError,
  } = useEstimateGas({
    ...estimateGasConfig,
    query: {
      ...estimateGasConfig.query,
      enabled: estimateGasConfig.query?.enabled && isFormValid,
    },
  });

  // Simulate contract
  const {
    data: simulateContractData,
    isFetching: simulateContractIsFetching,
    error: simulateContractError,
  } = useSimulateContract({
    ...simulateContractConfig,
    query: {
      ...simulateContractConfig.query,
      enabled: simulateContractConfig.query?.enabled && isFormValid,
    },
  });

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

  const showAddressInfo = isEns(formData.address ?? '') && currentAddress;

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
          gasInfo={
            <div className={styles['gas-estimate-container']}>
              {gasEstimateIsFetching && <span className={styles['input-additional-info']}>{`Gas: Fetching...`}</span>}
              {gasEstimateError && <span className={styles['input-additional-info']}>{`Gas: Error!`}</span>}
              {!gasEstimateIsFetching && gasEstimate && (
                <span className={styles['input-additional-info']}>{`Gas: ${formatEther(gasEstimate)}`}</span>
              )}
            </div>
          }
          addressInfo={
            <div className={styles['address-from-ens-container']}>
              <span className={styles['input-additional-info']}>
                {showAddressInfo ? shortenAddress(currentAddress) : ''}
              </span>
            </div>
          }
        />
      </Well>
    </div>
  );
};

export default TransferToken;
