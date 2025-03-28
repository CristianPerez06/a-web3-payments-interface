import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import { Address, formatEther, parseEther } from 'viem';
import { BaseError } from '@wagmi/core';
import { useEstimateGas, useSendTransaction } from 'wagmi';
import { ChainSymbol } from '@/library/types';
import { Well } from '@/library/components';
import { useGetAddressFromEns, useTextUtilities } from '@/library/hooks';
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

  const { shortenAddress, isEns } = useTextUtilities();
  const debouncedAddress = useMemo(() => debounce((value: string | null) => value, 100), [])(formData.address);
  // Use ENS if it's valid, otherwise use the address
  const addressToUse = isEns(formData.address ?? '') ? debouncedAddress : formData.address;
  const { data: currentAddress } = useGetAddressFromEns(addressToUse || null);

  const {
    data: gasEstimate,
    isFetching: gasEstimateIsFetching,
    error: gasEstimateError,
  } = useEstimateGas({
    to: currentAddress ? (currentAddress as Address) : null,
    value: parseEther(formData.amount?.toString() ?? '0'),
    query: {
      enabled: !!formData.amount && !!currentAddress && isFormValid,
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
              {isFormValid && (
                <>
                  {gasEstimateIsFetching && (
                    <span className={styles['input-additional-info']}>{`Gas: Fetching...`}</span>
                  )}
                  {gasEstimateError && <span className={styles['input-additional-info']}>{`Gas: Error!`}</span>}
                  {!gasEstimateIsFetching && gasEstimate && (
                    <span className={styles['input-additional-info']}>{`Gas: ${formatEther(gasEstimate)}`}</span>
                  )}
                </>
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

export default TransferEth;
