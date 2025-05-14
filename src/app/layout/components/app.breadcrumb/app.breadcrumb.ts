// breadcrumb.component.ts
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, BreadcrumbModule, CommonModule],
  templateUrl: './app.breadcrumb.html',
})
export class BreadcrumbComponent implements OnInit {
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged(),
        startWith(null), // Forzar emisión inicial
        map(() => {
          // Reconstruir breadcrumb desde la ruta actual
          return this.buildBreadCrumb(this.activatedRoute.root);
        })
      )
      .subscribe((breadcrumbs) => {
        this.items = breadcrumbs;
      });

    this.items = this.buildBreadCrumb(this.activatedRoute.root);
  }

  buildBreadCrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: MenuItem[] = []
  ): MenuItem[] {
    // Obtener la ruta y el breadcrumb de la configuración
    const path = route.routeConfig?.path || '';
    const breadcrumbLabel = route.routeConfig?.data?.['breadcrumb'];

    // Manejar parámetros de ruta (como :id)
    const routeParams = route.snapshot.params;
    let resolvedPath = path;

    // Reemplazar parámetros con sus valores reales
    for (const key in routeParams) {
      if (routeParams.hasOwnProperty(key)) {
        resolvedPath = resolvedPath.replace(`:${key}`, routeParams[key]);
      }
    }

    // Construir la URL completa
    const nextUrl = path ? `${url}/${resolvedPath}` : url;

    // Solo agregar al breadcrumb si tiene label
    if (breadcrumbLabel) {
      // Resolver labels dinámicos si es una función
      const label =
        typeof breadcrumbLabel === 'function'
          ? breadcrumbLabel(route.snapshot.data)
          : breadcrumbLabel;

      const breadcrumbItem: MenuItem = {
        label: label,
        routerLink: nextUrl,
      };
      breadcrumbs.push(breadcrumbItem);
    }

    // Recursividad para rutas hijas
    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, breadcrumbs);
    }

    // Eliminar rutas duplicadas (puede ocurrir con rutas vacías)
    return breadcrumbs.filter(
      (item, index, self) => index === self.findIndex((t) => t.label === item.label)
    );
  }
}
