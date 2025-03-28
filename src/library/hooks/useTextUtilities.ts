import { ENS_REGEX, HEX_REGEX } from '@/library/contants';

const useTextUtilities = () => {
  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const isEns = (input: string) => {
    let testResult = false;
    if (ENS_REGEX.test(input)) {
      testResult = true;
    }
    return testResult;
  };

  const isAddress = (input: string) => {
    let testResult = false;
    if (HEX_REGEX.test(input)) {
      testResult = true;
    }
    return testResult;
  };

  return {
    shortenAddress,
    isEns,
    isAddress,
  };
};

export default useTextUtilities;
