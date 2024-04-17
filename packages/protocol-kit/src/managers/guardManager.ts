import {
  hasSafeFeature,
  isZeroAddress,
  SAFE_FEATURES,
  SafeContractCompatibleWithGuardManager,
  sameString
} from '@safe-global/protocol-kit/utils'
import { ZERO_ADDRESS } from '@safe-global/protocol-kit/utils/constants'
import { EthAdapter } from '@safe-global/protocol-kit/adapters/ethAdapter'
import { SafeContractImplementationType } from '@safe-global/protocol-kit/types'

class GuardManager {
  #ethAdapter: EthAdapter
  #safeContract?: SafeContractImplementationType
  // keccak256("guard_manager.guard.address")
  #slot = '0x4a204f620c8c5ccdca3fd54d003badd85ba500436a431f0cbda4f558c93c34c8'

  constructor(ethAdapter: EthAdapter, safeContract?: SafeContractImplementationType) {
    this.#ethAdapter = ethAdapter
    this.#safeContract = safeContract
  }

  private validateGuardAddress(guardAddress: string): void {
    const isValidAddress = this.#ethAdapter.isAddress(guardAddress)
    if (!isValidAddress || isZeroAddress(guardAddress)) {
      throw new Error('Invalid guard address provided')
    }
  }

  private validateGuardIsNotEnabled(currentGuard: string, newGuardAddress: string): void {
    if (sameString(currentGuard, newGuardAddress)) {
      throw new Error('Guard provided is already enabled')
    }
  }

  private validateGuardIsEnabled(guardAddress: string): void {
    if (isZeroAddress(guardAddress)) {
      throw new Error('There is no guard enabled yet')
    }
  }

  private async isGuardCompatible(): Promise<SafeContractCompatibleWithGuardManager> {
    if (!this.#safeContract) {
      throw new Error('Safe is not deployed')
    }
    const safeVersion = await this.#safeContract.getVersion()
    if (!hasSafeFeature(SAFE_FEATURES.SAFE_TX_GUARDS, safeVersion)) {
      throw new Error(
        'Current version of the Safe does not support Safe transaction guards functionality'
      )
    }

    return this.#safeContract as SafeContractCompatibleWithGuardManager
  }

  async getGuard(): Promise<string> {
    const safeContract = await this.isGuardCompatible()

    return this.#ethAdapter.getStorageAt(await safeContract.getAddress(), this.#slot)
  }

  async encodeEnableGuardData(guardAddress: string): Promise<string> {
    const safeContract = await this.isGuardCompatible()

    this.validateGuardAddress(guardAddress)
    const currentGuard = await this.getGuard()
    this.validateGuardIsNotEnabled(currentGuard, guardAddress)
    return safeContract.encode('setGuard', [guardAddress])
  }

  async encodeDisableGuardData(): Promise<string> {
    const safeContract = await this.isGuardCompatible()

    const currentGuard = await this.getGuard()
    this.validateGuardIsEnabled(currentGuard)
    return safeContract.encode('setGuard', [ZERO_ADDRESS])
  }
}

export default GuardManager
