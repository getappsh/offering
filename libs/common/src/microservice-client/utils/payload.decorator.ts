import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import {Payload, TcpContext } from "@nestjs/microservices";
import { extractRequest } from "./context-helpers";

export const V2Payload = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    let request = extractRequest(ctx);
    
    if (key === "stringValue"){
      key = undefined
    }

    if (request === "undefined"){
      request = undefined
    }
    return key ? request?.[key] : request;
  },
);

export const RpcPayload = process.env.RPC_PAYLOAD_VERSION === "2" ? V2Payload : Payload;

