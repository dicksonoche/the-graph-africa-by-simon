import { Transfer as TransferEvent } from "../generated/Request/Request"
import { Transfer } from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {
  //Create the unique id by concatenating the trx hash with the log index
  let id = event.transaction.hash.concatI32(event.logIndex.toI32())
  
  let transfer = Transfer.load(id);

  //If it exist, no need to store, store(the event parameters) only when it doesn't exist
  if (!transfer) {
    transfer = new Transfer(id);
  }

  transfer.sender = event.params.from
  transfer.receiver = event.params.to
  transfer.amount = event.params.value

  transfer.blockNumber = event.block.number
  transfer.blockTimestamp = event.block.timestamp
  transfer.transactionHash = event.transaction.hash

  transfer.save()
}
