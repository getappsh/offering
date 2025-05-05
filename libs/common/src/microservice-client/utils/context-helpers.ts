import { ExecutionContext } from '@nestjs/common';
import { KafkaContext, TcpContext } from '@nestjs/microservices';


export function extractHeaders(context: ExecutionContext): Record<string, any> {
  const input = context.switchToRpc();
  const msgContext = input.getContext();
 
  if (msgContext instanceof KafkaContext) {
    return msgContext.getMessage().headers;
  } else if (msgContext instanceof TcpContext) {
    return input.getData()?.headers;
  }
  return {};
}


export function extractRequest(context: ExecutionContext): Record<string, any> | string {
  const input = context.switchToRpc();
  const msgContext = input.getContext();

  if (msgContext instanceof KafkaContext) {
    return input.getData();
  } else if (msgContext instanceof TcpContext) {
    return input.getData()?.value;
  }
  return {};
}
