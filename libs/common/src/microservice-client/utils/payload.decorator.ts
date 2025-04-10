import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import {Payload, TcpContext } from "@nestjs/microservices";
import { extractRequest } from "./context-helpers";

export const V2Payload = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = extractRequest(ctx);
    
    if (key === "stringValue"){
      key = undefined
    }
    
    if (value === "undefined"){
      value = undefined
    }

    return key ? value?.[key] : value;
  },
);

export const RpcPayload = process.env.RPC_PAYLOAD_VERSION === "2" ? V2Payload : Payload;

