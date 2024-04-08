// auth.guard.ts

import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AxiosService } from './services/axios.service';

export const canAccess: CanActivateFn =
    (_route, _state) => {
        const axiosSvc = inject(AxiosService)
        const router = inject(Router)
        
        if (axiosSvc.isAuthenticatedUser()) {
            // console.log('AUTHENTICATED: ', axiosSvc.isAuthenticatedUser)
            return true
        } else {
            // console.log('NOT AUTHENTICATED: ', axiosSvc.isAuthenticatedUser)
            router.navigate(['/'])
            return false
        }
    }
