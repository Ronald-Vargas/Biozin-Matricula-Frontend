import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayoutComponent {
  sidebarCollapsed = false;
  today = new Date();
  currentPageTitle = 'Dashboard';

  menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/estudiantes', label: 'Estudiantes', icon: '👨‍🎓' },
    { path: '/carreras', label: 'Carreras', icon: '📚' },
    { path: '/cursos', label: 'Cursos', icon: '📖' },
    { path: '/asignaciones', label: 'Asignaciones', icon: '🔗' },
  ];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const match = this.menuItems.find((item) => event.urlAfterRedirects.startsWith(item.path));
        this.currentPageTitle = match ? match.label : 'Dashboard';
      });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}


