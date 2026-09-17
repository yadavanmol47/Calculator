import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Inject,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CalculatorService } from './calculator.service.ts';
import { BaseConvertDto, EvaluateDto, MemoryActionDto } from './dto/calculator.dto.ts';

@Controller('calculator')
export class CalculatorController {
  constructor(
    @Inject(CalculatorService)
    private readonly calculatorService: CalculatorService,
  ) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      framework: 'NestJS v12',
      service: 'CalculatorService',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  evaluate(@Body() dto: EvaluateDto) {
    return this.calculatorService.evaluate(dto);
  }

  @Post('step-by-step')
  @HttpCode(HttpStatus.OK)
  getSteps(@Body() dto: EvaluateDto) {
    return this.calculatorService.evaluate(dto);
  }

  @Post('convert')
  @HttpCode(HttpStatus.OK)
  convert(@Body() dto: BaseConvertDto) {
    return this.calculatorService.convertBase(dto.value, dto.fromBase);
  }

  @Get('history')
  getHistory() {
    return {
      history: this.calculatorService.getHistory(),
    };
  }

  @Delete('history')
  clearHistory() {
    return this.calculatorService.clearHistory();
  }

  @Delete('history/:id')
  deleteHistoryItem(@Param('id') id: string) {
    return this.calculatorService.deleteHistoryItem(id);
  }

  @Get('memory')
  getMemory() {
    return this.calculatorService.getMemory();
  }

  @Post('memory')
  @HttpCode(HttpStatus.OK)
  handleMemory(@Body() dto: MemoryActionDto) {
    return this.calculatorService.handleMemory(dto);
  }

  @Get('constants')
  getConstants() {
    return {
      constants: this.calculatorService.getConstants(),
    };
  }
}
