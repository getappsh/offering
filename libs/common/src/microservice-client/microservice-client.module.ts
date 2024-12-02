import { DynamicModule, Global, Module } from "@nestjs/common";
import { MicroserviceClient } from "./microservice-client.service";
import { MicroserviceModuleOptions } from "./microservice-client.interface";
import {ConfigService } from "@nestjs/config";
import { ClsService } from "nestjs-cls";


@Global()
@Module({})
export class MicroserviceModule{
  static register(options: MicroserviceModuleOptions): DynamicModule{
    return{
      module: MicroserviceModule,
      providers: [
       {
        provide: options.name,
        useFactory: (cnf: ConfigService, cls: ClsService) => {
          return new MicroserviceClient(options, cnf, cls)
        },
        inject: [ConfigService, ClsService]
       }
      ],
      exports: [options.name]
    }
  }
}


// export class MicroserviceModule extends ConfigurableModuleClass{}

// export class MicroserviceModule{
//   static register(options: MicroserviceModuleOptions): DynamicModule {
//     // const selectedModule = ClientsModule.registerAsync([{
//     //   name: 'DEPLOY_SERVICE',
//     //   useFactory: () => getClientConfig(options)
//     // }])
//     return {
//       module: MicroserviceModule,
//       // imports: [selectedModule],
//       providers: [
//         {
//           provide: 'DEPLOY_SERVICE',
//           useValue: options
//           // useFactory: () => {
//           //   return ClientProxyFactory.create(getClientConfig(options))
//           // }
//         },
//         MicroserviceClient, 
//       ],
//       exports: [MicroserviceClient],
//     };
//   } 
// }
// export class MicroserviceModule extends ConfigurableModuleClass {
//   static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
//     let res = super.registerAsync(options);
//     let resOptions = options.useFactory()
//     let module = getMicroserviceClient(resOptions);
//     res.exports.push(module)
//     return {
//       ...res
//     };
  // }

  // static forRootAsync(options: MicroserviceAsyncOptions): DynamicModule{
  //   let selectedModule;

  //   switch (options.type){
  //     case MicroserviceType.DELIVERY:
  //       selectedModule = KafkaDeliveryModule;
  //       break;
  //     case MicroserviceType.DEPLOY:
  //       selectedModule = KafkaDeployModule;
  //       break;

  //   }
  //   return {
  //     module: MicroserviceModule,
  //     imports: [
  //       selectedModule
  //     ],
  //     // providers: [
  //     //   {
  //     //     provide: "MICROSERVICE_OPTION",
  //     //     useValue: options
  //     //   }
  //     // ],
  //     exports: [selectedModule],
  //   }
  // }
// }

// function getMicroserviceClient(options): DynamicModule{
  //     let resModule: DynamicModule;
  
  //     switch (options.type){
  //       case MicroserviceType.DELIVERY:
  
  //         resModule = options.deployEnv == 
  //           DeployEnv.TNG ? 
  //           ClientsModule.register([{ name: 'DEPLOY_SERVICE', transport: Transport.TCP , options: {port: 3001}}]):
  //           KafkaDeliveryModule ;
  //         break;
  //       case MicroserviceType.DEPLOY:
  //         resModule = KafkaDeployModule;
  //         break;
  
  //     }
  
  //     return resModule;
  // }