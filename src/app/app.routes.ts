import { Routes } from '@angular/router';

import { AppLayout } from './layout/components/app.layout/app.layout';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      // En los children se definen las rutas hijas
      // para que el breadcrumb funcione correctamente
      // se debe definir el campo data: { breadcrumb: 'Nombre' }
      // y ese nombre se mostrará en el breadcrumb
      //   {
      //     path: '',
      //     component: AppComponent,
      //     data: { breadcrumb: 'Inicio' },
      //   },
    ],
  },
];
