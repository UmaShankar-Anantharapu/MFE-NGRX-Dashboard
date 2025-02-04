import { Injector, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route:any, state:any) => {
  const injector = inject(Injector)
  const router = injector.get(Router)
  let user = localStorage.getItem('user')
  if(user){
    return true;
  }else{
    router.navigate(['/login'])
    return false;
  }
};
