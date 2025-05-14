import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../app.menuitem/app.menuitem';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  templateUrl: './app.menu.html',
})
export class AppMenu {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Inicio',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
        ],
      },
      {
        label: 'Cositas',
        items: [
          { label: 'Item1', icon: 'pi pi-fw pi-users', routerLink: ['/item'] },
          {
            label: 'Item2',
            icon: 'pi pi-fw pi-user',
            routerLink: ['/item/details'],
          },
        ],
      },
      {
        label: 'Otros',
        items: [
          {
            label: '404',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/notfound'],
          },
        ],
      },
    ];
  }
}
