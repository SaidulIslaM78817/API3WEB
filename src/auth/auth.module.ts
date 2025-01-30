import { Module, forwardRef } from '@nestjs/common'; // Import forwardRef
import { AdminModule } from '../admin/admin.module'; // Import AdminModule
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    forwardRef(() => AdminModule), // Use forwardRef to avoid circular dependency
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '120s' },
    }),
  ],
})
export class AuthModule {}
