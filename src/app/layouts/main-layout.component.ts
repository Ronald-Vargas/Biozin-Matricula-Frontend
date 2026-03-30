import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../features/estudiante/services/auth.service';


interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}


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
  currentView: 'admin' | 'student';

  adminSections: MenuSection[] = [
    {
      title: 'General',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      ],
    },
    {
      title: 'Académico',
      items: [
        { path: '/carreras', label: 'Carreras', icon: '📚' },
        { path: '/cursos', label: 'Cursos', icon: '📖' },
        { path: '/profesores', label: 'Profesores', icon: '👨‍🏫' },
        { path: '/asignaciones', label: 'Asignar Cursos', icon: '🔗' },
        { path: '/malla-curricular', label: 'Malla Curricular', icon: '🗂️' },
      ],
    },
    {
      title: 'Matrícula',
      items: [
        { path: '/periodos', label: 'Períodos', icon: '📅' },
        { path: '/oferta-academica', label: 'Oferta Académica', icon: '📋' },
      ],
    },
    {
      title: 'Infraestructura',
      items: [
        { path: '/aulas', label: 'Aulas', icon: '🏫' },
      ],
    },
    {
      title: 'Estudiantes',
      items: [
        { path: '/estudiantes', label: 'Lista Estudiantes', icon: '👨‍🎓' },
      ],
    },
  ];

  studentSections: MenuSection[] = [
    {
      title: 'Mi Portal',
      items: [
        { path: '/portal/inicio', label: 'Inicio', icon: '🏠' },
        { path: '/portal/matricular', label: 'Matricular', icon: '📝' },
        { path: '/portal/historial', label: 'Historial', icon: '📊' },
        { path: '/portal/pagos', label: 'Pagos', icon: '💳' },
      ],
    },
  ];

  get menuSections(): MenuSection[] {
    return this.currentView === 'admin' ? this.adminSections : this.studentSections;
  }

  get userName(): string {
    if (this.currentView === 'student') {
      return this.authService.getPerfil()?.nombreCompleto || 'Estudiante';
    }
    return this.authService.getAdminPerfil()?.nombreCompleto || 'Administrador';
  }

  get userRole(): string {
    return this.currentView === 'admin' ? 'Administrador' : 'Estudiante';
  }

  private get allItems(): MenuItem[] {
    return this.menuSections.flatMap((s) => s.items);
  }

  constructor(private router: Router, private authService: AuthService) {
    this.currentView = this.authService.getRole() === 'estudiante' ? 'student' : 'admin';
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const all = [...this.adminSections, ...this.studentSections].flatMap((s) => s.items);
        const match = all.find((item) => event.urlAfterRedirects.startsWith(item.path));
        this.currentPageTitle = match ? match.label : 'Dashboard';
        if (event.urlAfterRedirects.startsWith('/portal')) {
          this.currentView = 'student';
        }
      });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  switchView(view: 'admin' | 'student'): void {
    this.currentView = view;
    if (view === 'admin') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/portal/inicio']);
    }
  }
}







































