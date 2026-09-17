import { Module } from '@nestjs/common';
import { CalculatorController } from './calculator.controller.ts';
import { CalculatorService } from './calculator.service.ts';

@Module({
  controllers: [CalculatorController],
  providers: [CalculatorService],
  exports: [CalculatorService],
})
export class CalculatorModule {}
