import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Pool } from '../../../generated/schema';
import { PoolAddressesProvider } from '../../../generated/templates';
import {
  AddressesProviderRegistered,
  AddressesProviderUnregistered,
  OwnershipTransferred,
} from '../../../generated/PoolAddressesProviderRegistry/PoolAddressesProviderRegistry';
import { getProtocol } from '../../helpers/v3/initializers';

export function handleAddressesProviderRegistered(event: AddressesProviderRegistered): void {
  let protocol = getProtocol();
  let address = event.params.addressesProvider.toHexString();
  if (Pool.load(address) == null) {
    let pool = new Pool(address);
    pool.protocol = protocol.id;
    pool.addressProviderId = event.params.id;
    pool.active = true;
    pool.paused = false;
    pool.lastUpdateTimestamp = event.block.timestamp.toI32();
    pool.save();

    PoolAddressesProvider.create(Address.fromString(address));
  }
}

export function handleAddressesProviderUnregistered(event: AddressesProviderUnregistered): void {
  let address = event.params.addressesProvider.toHexString();
  let pool = Pool.load(address);
  if (pool != null) {
    pool.active = false;
    pool.lastUpdateTimestamp = event.block.timestamp.toI32();
    pool.save();
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let protocol = getProtocol();
  let address = '0xb0811a1fc9fb9972ee683ba04c32cb828bcf587b'

  if (Pool.load(address) == null) {
    let pool = new Pool(address);
    pool.protocol = protocol.id;
    pool.addressProviderId = BigInt.fromI32(30);
    pool.active = true;
    pool.paused = false;
    pool.lastUpdateTimestamp = event.block.timestamp.toI32();
    pool.save();

    PoolAddressesProvider.create(Address.fromString(address));
  }
}
