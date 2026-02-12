import { Module, DynamicModule, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PermissionsService } from './permissions.service';
import { PermissionsGuard } from './permissions.guard';

/**
 * Module for role-based permissions
 */
@Global()
@Module({})
export class PermissionsModule {
  /**
   * Register permissions module with default configuration
   */
  static forRoot(): DynamicModule {
    return {
      module: PermissionsModule,
      imports: [JwtModule.register({})],
      providers: [PermissionsService, PermissionsGuard],
      exports: [PermissionsService, PermissionsGuard, JwtModule],
    };
  }
}
