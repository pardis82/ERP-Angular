import { Injectable } from '@angular/core';

export interface IBranchcodeRequirements{
  isValid: boolean ,
  unmet : string[] 
}

@Injectable({
  providedIn: 'root',
})
export class BranchCodeValidationService {
branchCodeValidation(branchCode:string|number):IBranchcodeRequirements{
  const unmet : string[] =[]
  if(!branchCode || branchCode===null || branchCode=== undefined) {
    unmet.push('کد شعبه الزامی است') 
    return {isValid:false , unmet}
  }
  const CleanedCode = String(branchCode).trim()
  if(CleanedCode.length!=4) {
    unmet.push('کد شعبه باید 4 رقم باشد')
    return{isValid:false , unmet}
  }
  if (/\D/.test(CleanedCode)){
    unmet.push('کد شعبه فقط میتواند شامل اعداد باشد')
    return {isValid:false , unmet}
  }
  if(/^(\d)\1{3}/.test(CleanedCode)){
    unmet.push('کد شعبه معتبر نمیباشد')
    return {isValid:false , unmet}
  }
  return {
    isValid: unmet.length===0,
    unmet
  }
}
  
}
