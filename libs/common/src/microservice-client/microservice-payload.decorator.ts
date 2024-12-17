import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import {Payload, TcpContext } from "@nestjs/microservices";

export const V2Payload = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const input = ctx.switchToRpc();
    const msgContext = input.getContext();
    
    let value = input.getData();

    if (msgContext instanceof TcpContext) {
      value = value?.value;
    }
    
    if (key === "stringValue"){
      key = undefined
    }
    return key ? value?.[key] : value;
  },
);

export const RpcPayload = process.env.RPC_PAYLOAD_VERSION === "2" ? V2Payload : Payload;

