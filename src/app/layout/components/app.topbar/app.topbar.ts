import { Component, inject, Inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../service/layout.service';
import { MenuModule } from 'primeng/menu';
// import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, MenuModule],
  templateUrl: './app.topbar.html',
})
export class AppTopbar {
  items!: MenuItem[];
  //   private authService = inject(AuthService);

  constructor(public layoutService: LayoutService) {}

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme,
    }));
  }

  overlayMenuItems = [
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-fw pi-sign-out',
      command: () => {
        // this.authService.logout();
      },
    },
  ];
}
