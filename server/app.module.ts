import { Module } from '@nestjs/common';
import { CalculatorModule } from './calculator/calculator.module.ts';

@Module({
  imports: [CalculatorModule],
})
export class AppModule {}
