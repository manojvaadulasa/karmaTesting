import { TestBed } from '@angular/core/testing';
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

// describe('CalculatorService',()=>{
//   it('should add two numbers',()=>{
//     const logger = new LoggerService();
//     spyOn(logger,"log"); // Here "log" is the method we spying on within the LoggerService.
//     const calculator = new CalculatorService(logger);
//     const result = calculator.add(5,5);
//     expect(result).toBe(10);
//     expect(logger.log).toHaveBeenCalledTimes(1);
//   });
//   it('should subtract two numbers',()=>{
//     // There is another way of spying on the methods used within the CalculatorService.
//     const logger= jasmine.createSpyObj("LoggerService",["log"]); // This method is called fake
//     // test of a service because we are actually doing a test suite of CalculatorService as
//     // declared in the describe method in the top.
//     const calculator= new CalculatorService(logger);
//     const result = calculator.subtract(20,10);
//     expect(result).toBe(10);
//     expect(logger.log).toHaveBeenCalledTimes(1);
//   });
//   it('should multiply two numbers',()=>{
//     const result=new CalculatorService(new LoggerService()).multiply(10,10);
//     expect(result).toBe(100);
//   });
// });

// describe("CalculatorService",()=>{
//   let calculator:CalculatorService,logger:any;
//   beforeEach(()=>{
//     logger=jasmine.createSpyObj("LoggerService",["log"]);
//     calculator=new CalculatorService(logger);
//   });
  // it("To add 2 numbers",()=>{
  //   const result=calculator.add(5,5);
  //   expect(result).toBe(10);
  //   expect(logger.log).toHaveBeenCalledTimes(1);
  // });
  // it("To subtract 2 numbers",()=>{
  //   const result=calculator.subtract(20,10);
  //   expect(result).toBe(10);
  //   expect(logger.log).toHaveBeenCalledTimes(1);
  // });
  // it("To multiply 2 numbers",()=>{
  //   const result = calculator.multiply(5,2);
  //   expect(result).toBe(10);
  //   expect(logger.log).toHaveBeenCalledTimes(1);
  // });
// });

describe("CalculatorService",()=>{
  let calculator:CalculatorService,logger:LoggerService;
  beforeEach(()=>{
    logger= jasmine.createSpyObj("LoggerService",["log"]);
    TestBed.configureTestingModule({
      providers:[
        CalculatorService,
        {provide:LoggerService,useValue:logger}
      ]
    });
    calculator=TestBed.inject(CalculatorService);
  });
  it("To add 2 numbers",()=>{
    const result=calculator.add(5,5);
    expect(result).toBe(10);
    expect(logger.log).toHaveBeenCalledTimes(1);
  });
  it("To subtract 2 numbers",()=>{
    const result=calculator.subtract(20,10);
    expect(result).toBe(10);
    expect(logger.log).toHaveBeenCalledTimes(1);
  });
  it("To multiply 2 numbers",()=>{
    const result = calculator.multiply(5,2);
    expect(result).toBe(10);
    expect(logger.log).toHaveBeenCalledTimes(1);
  });
});
