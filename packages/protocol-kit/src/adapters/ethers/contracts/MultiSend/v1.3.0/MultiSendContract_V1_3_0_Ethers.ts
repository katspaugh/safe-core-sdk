import MultiSendBaseContractEthers from '@safe-global/protocol-kit/adapters/ethers/contracts/MultiSend/MultiSendBaseContractEthers'
import EthersAdapter from '@safe-global/protocol-kit/adapters/ethers/EthersAdapter'
import {
  SafeVersion,
  multisend_1_3_0_ContractArtifacts,
  MultiSendContract_v1_3_0_Abi,
  MultiSendContract_v1_3_0_Contract
} from '@safe-global/safe-core-sdk-types'

/**
 * MultiSendContract_v1_3_0_Ethers is the implementation specific to the MultiSend contract version 1.3.0.
 *
 * This class specializes in handling interactions with the MultiSend contract version 1.3.0 using Ethers.js v6.
 *
 * @extends MultiSendBaseContractEthers<MultiSendContract_v1_3_0_Abi> - Inherits from MultiSendBaseContractEthers with ABI specific to MultiSend contract version 1.3.0.
 * @implements MultiSendContract_v1_3_0_Contract - Implements the interface specific to MultiSend contract version 1.3.0.
 */
class MultiSendContract_v1_3_0_Ethers
  extends MultiSendBaseContractEthers<MultiSendContract_v1_3_0_Abi>
  implements MultiSendContract_v1_3_0_Contract
{
  safeVersion: SafeVersion

  /**
   * Constructs an instance of MultiSendContract_v1_3_0_Ethers
   *
   * @param chainId - The chain ID where the contract resides.
   * @param ethersAdapter - An instance of EthersAdapter.
   * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the MultiSend deployments based on the chainId and safeVersion.
   * @param customContractAbi - Optional custom ABI for the contract. If not provided, the default ABI for version 1.3.0 is used.
   */
  constructor(
    chainId: bigint,
    ethersAdapter: EthersAdapter,
    customContractAddress?: string,
    customContractAbi?: MultiSendContract_v1_3_0_Abi
  ) {
    const safeVersion = '1.3.0'
    const defaultAbi = multisend_1_3_0_ContractArtifacts.abi

    super(chainId, ethersAdapter, defaultAbi, safeVersion, customContractAddress, customContractAbi)

    this.safeVersion = safeVersion
  }
}

export default MultiSendContract_v1_3_0_Ethers
